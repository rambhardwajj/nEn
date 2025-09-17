

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const actionSchemas : Record<string, { fields: any[] }> = {
  Telegram: {
    fields: [
      { name: 'botToken', type: 'password', label: 'Bot Token', required: true },
      { name: 'chatId', type: 'text', label: 'Chat ID', required: true },
      { name: 'message', type: 'textarea', label: 'Message', required: true },
      { name: 'parseMode', type: 'select', label: 'Parse Mode', options: ['HTML', 'Markdown'], required: false }
    ]
  },
  OpenAi: {
    fields: [
      { name: 'apiKey', type: 'password', label: 'API Key', required: true },
      { name: 'model', type: 'select', label: 'Model', options: ['gpt-4', 'gpt-3.5-turbo'], required: true },
      { name: 'prompt', type: 'textarea', label: 'Prompt', required: true },
      { name: 'temperature', type: 'number', label: 'Temperature', min: 0, max: 2, step: 0.1, required: false }
    ]
  }
}