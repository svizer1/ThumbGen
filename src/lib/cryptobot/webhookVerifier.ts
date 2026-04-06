import crypto from 'crypto';

/**
 * Verify CryptoBot webhook signature
 * @param body - Raw request body as string
 * @param signature - Signature from header 'crypto-pay-api-signature'
 * @param secret - API token
 * @returns true if signature is valid
 */
export function verifyCryptoBotWebhook(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hash = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return hash === signature;
  } catch (error) {
    console.error('Error verifying CryptoBot webhook signature:', error);
    return false;
  }
}
