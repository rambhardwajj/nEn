import axios from "axios";

export class ActionExecutor {
  private credentials: Map<string, any>;
  private nodeOutputs: Map<string, any>;

  constructor() {
    this.credentials = new Map();
    this.nodeOutputs = new Map();
  }

  setCredentials(credentialsMap: Map<string, any>) {
    this.credentials = credentialsMap;
  }

  getNodeOutput(nodeId: string): any {
    return this.nodeOutputs.get(nodeId);
  }

  setNodeOutput(nodeId: string, output: any) {
    this.nodeOutputs.set(nodeId, output);
  }

  // Resolve dynamic values like {{previousNode.output}}
  private resolveDynamicValue(value: any, context: any = {}): any {
    if (typeof value !== "string") return value;

    // Simple template resolution
    return value.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const keys = path.trim().split(".");
      let result = context;

      for (const key of keys) {
        result = result?.[key];
      }

      return result !== undefined ? result : match;
    });
  }

  async executeAction(
    node: any,
    previousOutputs: Record<string, any> = {}
  ): Promise<any> {
    const { actionType, parameters, credentials: credConfig } = node.data;

    try {
      switch (actionType) {
        case "TelegramNodeType":
          return await this.executeTelegramAction(
            parameters,
            credConfig,
            previousOutputs
          );

        case "WebHookNodeType":
          return await this.executeWebhookAction(parameters, previousOutputs);

        default:
          throw new Error(`Unknown action type: ${actionType}`);
      }
    } catch (error: any) {
      throw new Error(`Action execution failed: ${error.message}`);
    }
  }

private async executeTelegramAction(params: any, credConfig: any, context: any): Promise<any> {
  console.log("=== TELEGRAM ACTION DEBUG ===");
  
  const botToken = credConfig?.data?.accessToken;
  const chatId = this.resolveDynamicValue(params.chatId, context);
  const message = this.resolveDynamicValue(params.message, context);
  const parseMode = params.parseMode;

  console.log("Bot token:", botToken);
  console.log("Chat ID:", chatId);
  console.log("Message:", message);
  console.log("Parse mode:", parseMode);

  const baseUrl = credConfig.data.baseUrl || 'https://api.telegram.org';
  const telegramUrl = `${baseUrl}/bot${botToken}/sendMessage`;

  console.log("Telegram URL:", telegramUrl);

  const payload = {
    chat_id: chatId,
    text: message
  };

  // if (parseMode) {
  //   payload.parse_mode = parseMode;
  // }

  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(telegramUrl, payload, {
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      timeout: 10000
    });

    console.log("Telegram API Response:", response.data);

    if (!response.data.ok) {
      throw new Error(`Telegram API error: ${response.data.description}`);
    }

    return {
      success: true,
      messageId: response.data.result.message_id,
      chatId: response.data.result.chat.id,
      sentAt: new Date(response.data.result.date * 1000).toISOString()
    }

  } catch (error: any) {
    console.log("Telegram API Error Details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}

  private async executeWebhookAction(params: any, context: any): Promise<any> {
    const url = this.resolveDynamicValue(params.url, context);
    const method = params.method || "POST";
    const headers = params.headers ? JSON.parse(params.headers) : {};
    const body = params.body
      ? this.resolveDynamicValue(params.body, context)
      : undefined;

    const response = await axios({
      method: method.toLowerCase(),
      url,
      headers,
      data: body ? JSON.parse(body) : undefined,
      timeout: 30000,
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  }
}
