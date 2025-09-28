import Imap from "imap";
import { simpleParser } from "mailparser";
import { prisma } from "@repo/db";
import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";

const publisherRedis = createClient({ url: "redis://localhost:6379" });
publisherRedis.connect();

class GmailMonitor {
  private connections: Map<string, Imap> = new Map();

  // start the monitoring job - create hte imap obj add user and token to the obj
  // when imap i sat ready start monitoring the inbox
  async startMonitoring(
    userId: string,
    access_token: string,
    emailAddress: string
  ) {
    console.log(`Starting IMAP monitoring-> ${emailAddress}`);

    const imap = new Imap({
      user: emailAddress,
      xoauth2: access_token,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      password: "",
    });

    // When IMAP connects successfully
    imap.once("ready", () => {
      console.log(`IMAP connected for: ${emailAddress}`);
      this.watchInbox(imap, userId);
    });

    imap.once("error", (err: any) => {
      console.error(`IMAP error for ${emailAddress}:`, err.message);
    });

    imap.connect();
    this.connections.set(userId, imap);
  }

  // start openBox INBOX -> when on mail handler -> handle any new email
  private watchInbox(imap: Imap, userId: string) {
    imap.openBox("INBOX", true, (err, box) => {
      if (err) {
        console.error("Cannot open inbox:", err);
        return;
      }

      console.log(`Watching inbox for user: ${userId}`);

      // Listen for new emails
      imap.on("mail", (numNewMsgs: any) => {
        console.log(`New email detected for user: ${userId}`);
        this.handleNewEmail(imap, userId);
      });
    });
  }

  // fetch all the emails ->
  private handleNewEmail(imap: Imap, userId: string) {
    // imap.seq.fetch('*', ...) means "get the most recent email"
    // '*' = the last (newest) email in the inbox
    // bodies: '' = get the full email content (headers + body)
    // struct: true = also get email structure info (attachments, etc.)

    const fetch = imap.seq.fetch("*", {
      bodies: "",
      struct: true,
    });

    // process when the message arrives
    fetch.on("message", (msg) => {
      // email content bnao
      let emailContent = "";

      // collect email body in chunks
      msg.on("body", (stream) => {
        stream.on("data", (chunk) => {
          emailContent += chunk.toString("utf8");
        });
      });

      // Email is fully received, now process it
      msg.once("end", async () => {
        try {
          const parsed = await simpleParser(emailContent); // simpleParser() converts raw email text into structured data

          const emailData = {
            from: parsed.from?.text || "",
            subject: parsed.subject || "",
            body: parsed.text || "",
            date: new Date(),
          };

          console.log(
            `Email from: ${emailData.from}, Subject: ${emailData.subject}`
          );

          // Check if any workflows should trigger
          await this.checkForTriggers(userId, emailData);
        } catch (error) {
          console.error("Error parsing email:", error);
        }
      });
    });
  }

  private async checkForTriggers(userId: string, emailData: any) {
    try {
      // Find user's active workflows
      const workflows = await prisma.workflow.findMany({
        where: { userId: userId, active: true },
      });

      for (const workflow of workflows) {
        const nodes = workflow.nodes as any[];
        const emailTriggers = nodes.filter(
          (node) => node.type === "emailTrigger"
        );

        for (const trigger of emailTriggers) {
          // Simple filter check
          if (this.emailMatches(emailData, trigger.data)) {
            await this.triggerWorkflow(workflow, emailData, trigger.id);
            console.log(`Triggered workflow: ${workflow.name}`);
          }
        }
      }
    } catch (error) {
      console.error("Error checking triggers:", error);
    }
  }

  private emailMatches(emailData: any, triggerConfig: any): boolean {
    if (!triggerConfig.senderFilter && !triggerConfig.subjectFilter)
      return true;

    if (triggerConfig.senderFilter)
      if (!emailData.from.includes(triggerConfig.senderFilter)) return false;

    if (triggerConfig.subjectFilter)
      if (!emailData.subject.includes(triggerConfig.subjectFilter))
        return false;

    return true;
  }

  private async triggerWorkflow(workflow: any, emailData: any, nodeId: string) {
    const executionId = uuidv4();

    const job = {
      executionId,
      workflowId: workflow.id,
      userId: workflow.userId,
      triggeredBy: "email",
      triggeredAt: new Date().toISOString(),
      triggerData: {
        nodeId,
        emailData,
      },
      workflow: {
        id: workflow.id,
        name: workflow.name,
        nodes: workflow.nodes,
        edges: workflow.edges,
        active: workflow.active,
      },
      status: "queued",
      priority: "high",
    };

    await publisherRedis.zAdd("workflow:execution", {
      score: Date.now(),
      value: JSON.stringify(job),
    });

    console.log(`Queued workflow execution: ${executionId}`);
  }
}

export const gmailMonitor = new GmailMonitor();
