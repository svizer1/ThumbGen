import axios, { AxiosInstance } from 'axios';
import {
  CryptoBotInvoice,
  CryptoBotCreateInvoiceParams,
  CryptoCurrency,
} from '@/types/payment';

export class CryptoBotClient {
  private api: AxiosInstance;
  private apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
    this.api = axios.create({
      baseURL: 'https://pay.crypt.bot/api',
      headers: {
        'Crypto-Pay-API-Token': apiToken,
      },
    });
  }

  /**
   * Create a new invoice
   */
  async createInvoice(
    params: CryptoBotCreateInvoiceParams
  ): Promise<CryptoBotInvoice> {
    try {
      const response = await this.api.post('/createInvoice', params);
      
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to create invoice');
      }

      return response.data.result;
    } catch (error: any) {
      console.error('CryptoBot createInvoice error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get invoice by ID
   */
  async getInvoice(invoiceId: string): Promise<CryptoBotInvoice> {
    try {
      const response = await this.api.get('/getInvoices', {
        params: { invoice_ids: invoiceId },
      });

      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to get invoice');
      }

      const invoices = response.data.result.items;
      if (!invoices || invoices.length === 0) {
        throw new Error('Invoice not found');
      }

      return invoices[0];
    } catch (error: any) {
      console.error('CryptoBot getInvoice error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get all invoices with optional filters
   */
  async getInvoices(params?: {
    asset?: CryptoCurrency;
    invoice_ids?: string;
    status?: 'active' | 'paid' | 'expired';
    offset?: number;
    count?: number;
  }): Promise<CryptoBotInvoice[]> {
    try {
      const response = await this.api.get('/getInvoices', { params });

      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to get invoices');
      }

      return response.data.result.items || [];
    } catch (error: any) {
      console.error('CryptoBot getInvoices error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get exchange rates
   */
  async getExchangeRates(): Promise<any> {
    try {
      const response = await this.api.get('/getExchangeRates');

      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to get exchange rates');
      }

      return response.data.result;
    } catch (error: any) {
      console.error('CryptoBot getExchangeRates error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get currencies
   */
  async getCurrencies(): Promise<any> {
    try {
      const response = await this.api.get('/getCurrencies');

      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to get currencies');
      }

      return response.data.result;
    } catch (error: any) {
      console.error('CryptoBot getCurrencies error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get balance
   */
  async getBalance(): Promise<any> {
    try {
      const response = await this.api.get('/getBalance');

      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to get balance');
      }

      return response.data.result;
    } catch (error: any) {
      console.error('CryptoBot getBalance error:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Singleton instance
let cryptoBotClient: CryptoBotClient | null = null;

export function getCryptoBotClient(): CryptoBotClient {
  if (!cryptoBotClient) {
    const apiToken = process.env.CRYPTOBOT_API_TOKEN;
    if (!apiToken) {
      // Return a dummy client during build time
      if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
        throw new Error('CRYPTOBOT_API_TOKEN is not set');
      }
      // During build, create a dummy instance
      return new CryptoBotClient('dummy_token_for_build');
    }
    cryptoBotClient = new CryptoBotClient(apiToken);
  }
  return cryptoBotClient;
}
