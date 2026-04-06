import axios, { AxiosInstance } from 'axios';
import {
  TelegramSendMessageOptions,
  TelegramAnswerCallbackQueryOptions,
  TelegramEditMessageTextOptions,
} from '@/types/telegram';

export class TelegramBotClient {
  private api: AxiosInstance;
  private botToken: string;

  constructor(botToken: string) {
    this.botToken = botToken;
    this.api = axios.create({
      baseURL: `https://api.telegram.org/bot${botToken}`,
    });
  }

  /**
   * Send a message
   */
  async sendMessage(options: TelegramSendMessageOptions): Promise<any> {
    try {
      const response = await this.api.post('/sendMessage', options);
      return response.data.result;
    } catch (error: any) {
      console.error('Telegram sendMessage error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Edit message text
   */
  async editMessageText(options: TelegramEditMessageTextOptions): Promise<any> {
    try {
      const response = await this.api.post('/editMessageText', options);
      return response.data.result;
    } catch (error: any) {
      console.error('Telegram editMessageText error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Answer callback query
   */
  async answerCallbackQuery(options: TelegramAnswerCallbackQueryOptions): Promise<any> {
    try {
      const response = await this.api.post('/answerCallbackQuery', options);
      return response.data.result;
    } catch (error: any) {
      console.error('Telegram answerCallbackQuery error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Set webhook
   */
  async setWebhook(url: string, secretToken?: string): Promise<any> {
    try {
      const response = await this.api.post('/setWebhook', {
        url,
        secret_token: secretToken,
        allowed_updates: ['message', 'callback_query'],
      });
      return response.data;
    } catch (error: any) {
      console.error('Telegram setWebhook error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get webhook info
   */
  async getWebhookInfo(): Promise<any> {
    try {
      const response = await this.api.get('/getWebhookInfo');
      return response.data.result;
    } catch (error: any) {
      console.error('Telegram getWebhookInfo error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(): Promise<any> {
    try {
      const response = await this.api.post('/deleteWebhook');
      return response.data;
    } catch (error: any) {
      console.error('Telegram deleteWebhook error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get bot info
   */
  async getMe(): Promise<any> {
    try {
      const response = await this.api.get('/getMe');
      return response.data.result;
    } catch (error: any) {
      console.error('Telegram getMe error:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Singleton instance
let telegramBotClient: TelegramBotClient | null = null;

export function getTelegramBotClient(): TelegramBotClient {
  if (!telegramBotClient) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      // Return a dummy client during build time
      if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
        throw new Error('TELEGRAM_BOT_TOKEN is not set');
      }
      // During build, create a dummy instance
      return new TelegramBotClient('dummy_token_for_build');
    }
    telegramBotClient = new TelegramBotClient(botToken);
  }
  return telegramBotClient;
}
