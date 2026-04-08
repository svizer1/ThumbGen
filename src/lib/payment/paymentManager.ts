import { adminDb } from '@/lib/firebase-admin';
import { SubscriptionPlan } from '@/types/payment';
import * as admin from 'firebase-admin';

/**
 * Add credits to user account
 */
export async function addCreditsToUser(
  telegramId: number,
  credits: number,
  transactionId: string
): Promise<boolean> {
  try {
    // Get Firebase UID from Telegram ID
    const telegramUserDoc = await adminDb.collection('telegram_users').doc(telegramId.toString()).get();
    if (!telegramUserDoc.exists) {
      console.error('Telegram user not found:', telegramId);
      return false;
    }

    const firebaseUid = telegramUserDoc.data()?.firebaseUid;
    if (!firebaseUid) {
      console.error('Firebase UID not linked for Telegram user:', telegramId);
      // Create a temporary Firebase user for this Telegram user
      const tempUid = `telegram_${telegramId}`;
      await adminDb.collection('users').doc(tempUid).set({
        uid: tempUid,
        email: null,
        displayName: telegramUserDoc.data()?.firstName,
        photoURL: null,
        emailVerified: false,
        credits: credits,
        balanceMode: 'credits',
        dollarBalance: 0,
        subscription: {
          plan: 'free',
          status: 'active',
          currentPeriodEnd: null,
        },
        totalGenerations: 0,
        favoriteModel: null,
        modelUsage: {},
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        telegramId: telegramId,
        telegramUsername: telegramUserDoc.data()?.username,
      });

      // Link Firebase UID to Telegram user
      await adminDb.collection('telegram_users').doc(telegramId.toString()).update({
        firebaseUid: tempUid,
        linkedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Created temporary Firebase user ${tempUid} for Telegram user ${telegramId}`);
      return true;
    }

    // Update credits
    await adminDb.collection('users').doc(firebaseUid).update({
      credits: admin.firestore.FieldValue.increment(credits),
    });

    // Log transaction
    await adminDb.collection('users').doc(firebaseUid).collection('spending_history').doc(transactionId).set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      type: 'credit_purchase',
      credits: credits,
      spent: 0,
      currency: 'crypto',
      status: 'success',
      source: 'telegram_bot',
      transactionId,
    });

    console.log(`Added ${credits} credits to user ${firebaseUid}`);
    return true;
  } catch (error) {
    console.error('Error adding credits to user:', error);
    return false;
  }
}

/**
 * Activate subscription for user
 */
export async function activateSubscription(
  telegramId: number,
  plan: SubscriptionPlan,
  transactionId: string,
  isYearly: boolean = false
): Promise<boolean> {
  try {
    let creditsToAdd = 0;
    if (plan === 'starter') creditsToAdd = isYearly ? 2400 : 200;
    else if (plan === 'pro') creditsToAdd = isYearly ? 7200 : 600;
    else if (plan === 'unlimited') creditsToAdd = 999999;

    // Get Firebase UID from Telegram ID
    const telegramUserDoc = await adminDb.collection('telegram_users').doc(telegramId.toString()).get();
    if (!telegramUserDoc.exists) {
      console.error('Telegram user not found:', telegramId);
      return false;
    }

    const firebaseUid = telegramUserDoc.data()?.firebaseUid;
    if (!firebaseUid) {
      console.error('Firebase UID not linked for Telegram user:', telegramId);
      // Create a temporary Firebase user
      const tempUid = `telegram_${telegramId}`;
      const currentPeriodEnd = new Date();
      if (isYearly) {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      } else {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      }

      await adminDb.collection('users').doc(tempUid).set({
        uid: tempUid,
        email: null,
        displayName: telegramUserDoc.data()?.firstName,
        photoURL: null,
        emailVerified: false,
        credits: creditsToAdd,
        balanceMode: 'credits',
        dollarBalance: 0,
        subscription: {
          plan: plan,
          status: 'active',
          currentPeriodEnd: admin.firestore.Timestamp.fromDate(currentPeriodEnd),
        },
        totalGenerations: 0,
        favoriteModel: null,
        modelUsage: {},
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        telegramId: telegramId,
        telegramUsername: telegramUserDoc.data()?.username,
      });

      // Link Firebase UID to Telegram user
      await adminDb.collection('telegram_users').doc(telegramId.toString()).update({
        firebaseUid: tempUid,
        linkedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Created temporary Firebase user ${tempUid} with subscription ${plan}`);
      return true;
    }

    // Calculate subscription end date
    const currentPeriodEnd = new Date();
    if (isYearly) {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    } else {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    }

    // Update subscription
    await adminDb.collection('users').doc(firebaseUid).update({
      'subscription.plan': plan,
      'subscription.status': 'active',
      'subscription.currentPeriodEnd': admin.firestore.Timestamp.fromDate(currentPeriodEnd),
      credits: admin.firestore.FieldValue.increment(creditsToAdd)
    });

    // Log transaction
    await adminDb.collection('users').doc(firebaseUid).collection('spending_history').doc(transactionId).set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      type: 'subscription_purchase',
      subscriptionPlan: plan,
      spent: 0,
      currency: 'crypto',
      status: 'success',
      source: 'telegram_bot',
      transactionId,
    });

    console.log(`Activated ${plan} subscription for user ${firebaseUid}`);
    return true;
  } catch (error) {
    console.error('Error activating subscription:', error);
    return false;
  }
}

/**
 * Check if invoice has been processed
 */
export async function isInvoiceProcessed(invoiceId: string): Promise<boolean> {
  try {
    const invoiceDoc = await adminDb.collection('processed_invoices').doc(invoiceId).get();
    return invoiceDoc.exists;
  } catch (error) {
    console.error('Error checking invoice:', error);
    return false;
  }
}

/**
 * Mark invoice as processed
 */
export async function markInvoiceAsProcessed(
  invoiceId: string,
  userId: string
): Promise<void> {
  try {
    await adminDb.collection('processed_invoices').doc(invoiceId).set({
      invoiceId,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      userId,
      status: 'paid',
    });
  } catch (error) {
    console.error('Error marking invoice as processed:', error);
    throw error;
  }
}
