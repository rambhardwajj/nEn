/* eslint-disable @typescript-eslint/no-explicit-any */
export const actionSchemas: Record<string, any> = {
  Telegram: {
    fields: [
      {
        name: "chatId",
        label: "Chat ID",
        type: "text",
        required: true,
        placeholder: "Enter Telegram chat ID or @username",
        description: "The chat ID or username to send message to"
      },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        required: true,
        placeholder: "Enter your message here...",
        description: "The message content to send"
      },
      {
        name: "parseMode",
        label: "Parse Mode",
        type: "select",
        required: false,
        options: ["HTML", "Markdown", "MarkdownV2"],
        placeholder: "Select parse mode (optional)"
      }
    ]
  },
  GmailTrigger:{
    fields:[]
  },
  
  OpenAi: {
    fields: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        required: true,
        placeholder: "Enter your prompt...",
      },
      {
        name: "model",
        label: "Model",
        type: "select",
        required: true,
        options: ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"],
      },
      {
        name: "maxTokens",
        label: "Max Tokens",
        type: "number",
        required: false,
        min: 1,
        max: 4000,
        step: 1,
        placeholder: "2000"
      }
    ]
  },

  // Gmail: {
  //   fields: [
  //     {
  //       name: "to",
  //       label: "To Email",
  //       type: "text",
  //       required: true,
  //       placeholder: "recipient@example.com"
  //     },
  //     {
  //       name: "subject",
  //       label: "Subject",
  //       type: "text",
  //       required: true,
  //       placeholder: "Email subject"
  //     },
  //     {
  //       name: "body",
  //       label: "Message Body",
  //       type: "textarea",
  //       required: true,
  //       placeholder: "Email content..."
  //     }
  //   ]
  // },

  WebHookNodeType: {
    fields: [
      {
        name: "url",
        label: "Webhook URL",
        type: "text",
        required: true,
        placeholder: "https://api.example.com/webhook"
      },
      {
        name: "method",
        label: "HTTP Method",
        type: "select",
        required: true,
        options: ["GET", "POST", "PUT", "DELETE", "PATCH"]
      },
      {
        name: "headers",
        label: "Headers (JSON)",
        type: "textarea",
        required: false,
        placeholder: '{"Content-Type": "application/json"}'
      },
      {
        name: "body",
        label: "Request Body",
        type: "textarea",
        required: false,
        placeholder: "Request payload"
      }
    ]
  }
};