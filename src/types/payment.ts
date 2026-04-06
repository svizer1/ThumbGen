// Payment and CryptoBot Types

export type CryptoCurrency = 'TON' | 'USDT' | 'BTC' | 'ETH' | 'USDC' | 'BUSD';

export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'cancelled';

export type PurchaseType = 'credits' | 'subscription';

export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'unlimited';

// CryptoBot API Types
export interface CryptoBotInvoice {
  invoice_id: string;
  status: PaymentStatus;
  hash: string;
  currency_type: 'crypto';
  asset: CryptoCurrency;
  amount: string;
  paid_asset?: CryptoCurrency;
  paid_amount?: string;
  fee_asset?: CryptoCurrency;
  fee_amount?: string;
  pay_url: string;
  bot_invoice_url: string;
  description?: string;
  created_at: string;
  paid_at?: string;
  payload?: string;
  expiration_date?: string;
}

export interface CryptoBotCreateInvoiceParams {
  asset: CryptoCurrency;
  amount: string;
  description?: string;
  payload?: string;
  expires_in?: number;
}

export interface CryptoBotWebhookUpdate {
  update_id: number;
  update_type: 'invoice_paid';
  request_date: string;
  payload: CryptoBotInvoice;
}

// Internal Payment Types
export interface PaymentTransaction {
  transactionId: string;
  userId: string;
  telegramId?: number;
  type: PurchaseType;
  amount: number; // USD
  currency: CryptoCurrency;
  cryptoAmount: number;
  provider: 'cryptobot';
  invoiceId: string;
  status: PaymentStatus;
  credits?: number;
  subscriptionPlan?: SubscriptionPlan;
  createdAt: Date;
  paidAt?: Date;
  expiresAt?: Date;
}

export interface CreditPackage {
  credits: number;
  price: number;
  bonus: number;
  popular: boolean;
}

export interface SubscriptionPackage {
  id: SubscriptionPlan;
  name: string;
  price: number;
  credits: number;
  popular: boolean;
}

// Pricing data
export const CREDIT_PACKAGES: CreditPackage[] = [
  { credits: 50, price: 3, bonus: 0, popular: false },
  { credits: 150, price: 8, bonus: 10, popular: true },
  { credits: 400, price: 20, bonus: 50, popular: false },
];

export const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  { id: 'starter', name: 'Starter', price: 5, credits: 200, popular: false },
  { id: 'pro', name: 'Pro', price: 15, credits: 600, popular: true },
  { id: 'unlimited', name: 'Unlimited', price: 30, credits: -1, popular: false },
];
