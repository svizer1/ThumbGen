import { doc, getDoc, setDoc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SubscriptionPlan } from '@/types/payment';

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
    const telegramUserDoc = await getDoc(doc(db, 'telegram_users', telegramId.toString()));
    if (!telegramUserDoc.exists()) {
      console.error('Telegram user not found:', telegramId);
      return false;
    }

    const firebaseUid = telegramUserDoc.data().firebaseUid;
    if (!firebaseUid) {
      console.error('Firebase UID not linked for Telegram user:', telegramId);
      // Create a temporary Firebase user for this Telegram user
      const tempUid = `telegram_${telegramId}`;
      await setDoc(doc(db, 'users', tempUid), {
        uid: tempUid,
        email: null,
        displayName: telegramUserDoc.data().firstName,
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
        createdAt: new Date(),
        telegramId: telegramId,
        telegramUsername: telegramUserDoc.data().username,
      });

      // Link Firebase UID to Telegram user
      await updateDoc(doc(db, 'telegram_users', telegramId.toString()), {
        firebaseUid: tempUid,
        linkedAt: new Date(),
      });

      console.log(`Created temporary Firebase user ${tempUid} for Telegram user ${telegramId}`);
      return true;
    }

    // Update credits
    const userRef = doc(db, 'users', firebaseUid);
    await updateDoc(userRef, {
      credits: increment(credits),
    });

    // Log transaction
    await setDoc(doc(db, 'users', firebaseUid, 'spending_history', transactionId), {
      timestamp: Timestamp.now(),
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
  transactionId: string
): Promise<boolean> {
  try {
    // Get Firebase UID from Telegram ID
    const telegramUserDoc = await getDoc(doc(db, 'telegram_users', telegramId.toString()));
    if (!telegramUserDoc.exists()) {
      console.error('Telegram user not found:', telegramId);
      return false;
    }

    const firebaseUid = telegramUserDoc.data().firebaseUid;
    if (!firebaseUid) {
      console.error('Firebase UID not linked for Telegram user:', telegramId);
      // Create a temporary Firebase user
      const tempUid = `telegram_${telegramId}`;
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

      await setDoc(doc(db, 'users', tempUid), {
        uid: tempUid,
        email: null,
        displayName: telegramUserDoc.data().firstName,
        photoURL: null,
        emailVerified: false,
        credits: 0,
        balanceMode: 'credits',
        dollarBalance: 0,
        subscription: {
          plan: plan,
          status: 'active',
          currentPeriodEnd: Timestamp.fromDate(currentPeriodEnd),
        },
        totalGenerations: 0,
        favoriteModel: null,
        modelUsage: {},
        createdAt: new Date(),
        telegramId: telegramId,
        telegramUsername: telegramUserDoc.data().username,
      });

      // Link Firebase UID to Telegram user
      await updateDoc(doc(db, 'telegram_users', telegramId.toString()), {
        firebaseUid: tempUid,
        linkedAt: new Date(),
      });

      console.log(`Created temporary Firebase user ${tempUid} with subscription ${plan}`);
      return true;
    }

    // Calculate subscription end date (1 month from now)
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    // Update subscription
    const userRef = doc(db, 'users', firebaseUid);
    await updateDoc(userRef, {
      'subscription.plan': plan,
      'subscription.status': 'active',
      'subscription.currentPeriodEnd': Timestamp.fromDate(currentPeriodEnd),
    });

    // Log transaction
    await setDoc(doc(db, 'users', firebaseUid, 'spending_history', transactionId), {
      timestamp: Timestamp.now(),
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
    const invoiceDoc = await getDoc(doc(db, 'processed_invoices', invoiceId));
    return invoiceDoc.exists();
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
    await setDoc(doc(db, 'processed_invoices', invoiceId), {
      invoiceId,
      processedAt: Timestamp.now(),
      userId,
      status: 'paid',
    });
  } catch (error) {
    console.error('Error marking invoice as processed:', error);
    throw error;
  }
}
