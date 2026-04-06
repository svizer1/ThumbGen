import { TelegramUpdate, TelegramUser } from '@/types/telegram';
import { getTelegramBotClient } from './bot';
import { getMessage, Language } from './messages';
import {
  createMainMenuKeyboard,
  createCreditPackagesKeyboard,
  createSubscriptionPackagesKeyboard,
  createCurrencyKeyboard,
  createLanguageKeyboard,
  createPaymentKeyboard,
} from './keyboards';
import { adminDb } from '@/lib/firebase-admin';
import { getCryptoBotClient } from '../cryptobot/client';
import { CREDIT_PACKAGES, SUBSCRIPTION_PACKAGES, CryptoCurrency } from '@/types/payment';

// Get user language from Firestore or default to 'ru'
async function getUserLanguage(telegramId: number): Promise<Language> {
  try {
    const userDoc = await adminDb.collection('telegram_users').doc(telegramId.toString()).get();
    if (userDoc.exists) {
      return (userDoc.data()?.language as Language) || 'ru';
    }
    return 'ru';
  } catch (error) {
    console.error('Error getting user language:', error);
    return 'ru';
  }
}

// Set user language
async function setUserLanguage(telegramId: number, language: Language): Promise<void> {
  try {
    await adminDb.collection('telegram_users').doc(telegramId.toString()).update({ language });
  } catch (error) {
    console.error('Error setting user language:', error);
  }
}

// Get or create Telegram user in Firestore
async function getOrCreateTelegramUser(user: TelegramUser) {
  const telegramId = user.id.toString();
  const userRef = adminDb.collection('telegram_users').doc(telegramId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    // Create new telegram user
    await userRef.set({
      telegramId: user.id,
      username: user.username || null,
      firstName: user.first_name,
      lastName: user.last_name || null,
      language: user.language_code === 'en' ? 'en' : 'ru',
      firebaseUid: null, // Will be set when user links account
      linkedAt: null,
      createdAt: new Date(),
      lastInteraction: new Date(),
    });
  } else {
    // Update last interaction
    await userRef.update({
      lastInteraction: new Date(),
    });
  }

  return userDoc.exists ? userDoc.data() : null;
}

// Get Firebase user by Telegram ID
async function getFirebaseUserByTelegramId(telegramId: number): Promise<any> {
  try {
    const telegramUserDoc = await adminDb.collection('telegram_users').doc(telegramId.toString()).get();
    if (!telegramUserDoc.exists) {
      return null;
    }

    const firebaseUid = telegramUserDoc.data()?.firebaseUid;
    if (!firebaseUid) {
      return null;
    }

    const userDoc = await adminDb.collection('users').doc(firebaseUid).get();
    if (!userDoc.exists) {
      return null;
    }

    const data = userDoc.data();
    return { 
      uid: firebaseUid, 
      credits: data?.credits || 0,
      subscription: data?.subscription || { plan: 'free', status: 'expired' },
      ...data 
    };
  } catch (error) {
    console.error('Error getting Firebase user:', error);
    return null;
  }
}

// Handle /start command
export async function handleStart(update: TelegramUpdate) {
  try {
    console.log('handleStart called');
    const message = update.message;
    if (!message || !message.from) {
      console.log('No message or from');
      return;
    }

    console.log('Getting bot client');
    const bot = getTelegramBotClient();
    const user = message.from;
    
    console.log('Creating/getting telegram user');
    await getOrCreateTelegramUser(user);

    console.log('Getting user language');
    const lang = await getUserLanguage(user.id);
    
    console.log('Getting message text');
    const text = getMessage(lang, 'welcome');
    
    console.log('Creating keyboard');
    const keyboard = createMainMenuKeyboard(lang);

    console.log('Sending message to chat:', message.chat.id);
    await bot.sendMessage({
      chat_id: message.chat.id,
      text,
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error in handleStart:', error);
  }
}

// Handle /balance command
export async function handleBalance(update: TelegramUpdate) {
  const message = update.message;
  if (!message || !message.from) return;

  const bot = getTelegramBotClient();
  const lang = await getUserLanguage(message.from.id);
  const firebaseUser = await getFirebaseUserByTelegramId(message.from.id);

  if (!firebaseUser) {
    await bot.sendMessage({
      chat_id: message.chat.id,
      text: getMessage(lang, 'error_no_account'),
      parse_mode: 'HTML',
    });
    return;
  }

  const credits = firebaseUser.credits || 0;
  const subscription = firebaseUser.subscription || { plan: 'free', status: 'expired' };

  let text = getMessage(lang, 'balance_title') + '\n\n';
  text += getMessage(lang, 'balance_credits', { credits: credits.toString() }) + '\n';

  if (subscription.status === 'active' && subscription.plan !== 'free') {
    const date = subscription.currentPeriodEnd?.toDate?.()?.toLocaleDateString() || 'N/A';
    text += getMessage(lang, 'balance_subscription', { plan: subscription.plan }) + '\n';
    text += getMessage(lang, 'balance_subscription_until', { date });
  } else {
    text += getMessage(lang, 'balance_no_subscription');
  }

  await bot.sendMessage({
    chat_id: message.chat.id,
    text,
    parse_mode: 'HTML',
  });
}

// Handle /buy command
export async function handleBuy(update: TelegramUpdate) {
  const message = update.message;
  if (!message || !message.from) return;

  const bot = getTelegramBotClient();
  const lang = await getUserLanguage(message.from.id);
  const text = getMessage(lang, 'buy_menu_title');
  const keyboard = createMainMenuKeyboard(lang);

  await bot.sendMessage({
    chat_id: message.chat.id,
    text,
    parse_mode: 'HTML',
    reply_markup: keyboard,
  });
}

// Handle /help command
export async function handleHelp(update: TelegramUpdate) {
  const message = update.message;
  if (!message || !message.from) return;

  const bot = getTelegramBotClient();
  const lang = await getUserLanguage(message.from.id);
  const text = getMessage(lang, 'help_title') + '\n\n' + getMessage(lang, 'help_text');

  await bot.sendMessage({
    chat_id: message.chat.id,
    text,
    parse_mode: 'HTML',
  });
}

// Handle /language command
export async function handleLanguage(update: TelegramUpdate) {
  const message = update.message;
  if (!message || !message.from) return;

  const bot = getTelegramBotClient();
  const keyboard = createLanguageKeyboard();

  await bot.sendMessage({
    chat_id: message.chat.id,
    text: '🌐 Choose language / Выберите язык:',
    reply_markup: keyboard,
  });
}

// Handle callback queries
export async function handleCallbackQuery(update: TelegramUpdate) {
  const callbackQuery = update.callback_query;
  if (!callbackQuery || !callbackQuery.from || !callbackQuery.data) return;

  const bot = getTelegramBotClient();
  const data = callbackQuery.data;
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  const lang = await getUserLanguage(callbackQuery.from.id);

  // Answer callback query immediately
  await bot.answerCallbackQuery({ callback_query_id: callbackQuery.id });

  if (!chatId || !messageId) return;

  // Main menu
  if (data === 'main_menu') {
    const text = getMessage(lang, 'welcome');
    const keyboard = createMainMenuKeyboard(lang);
    await bot.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
    return;
  }

  // Balance
  if (data === 'balance') {
    const firebaseUser = await getFirebaseUserByTelegramId(callbackQuery.from.id);
    if (!firebaseUser) {
      const bot = getTelegramBotClient();
      await bot.sendMessage({
        chat_id: chatId,
        text: getMessage(lang, 'error_no_account'),
        parse_mode: 'HTML',
      });
      return;
    }

    const credits = firebaseUser.credits || 0;
    const subscription = firebaseUser.subscription || { plan: 'free', status: 'expired' };

    let text = getMessage(lang, 'balance_title') + '\n\n';
    text += getMessage(lang, 'balance_credits', { credits: credits.toString() }) + '\n';

    if (subscription.status === 'active' && subscription.plan !== 'free') {
      const date = subscription.currentPeriodEnd?.toDate?.()?.toLocaleDateString() || 'N/A';
      text += getMessage(lang, 'balance_subscription', { plan: subscription.plan }) + '\n';
      text += getMessage(lang, 'balance_subscription_until', { date });
    } else {
      text += getMessage(lang, 'balance_no_subscription');
    }

    await bot.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      reply_markup: createMainMenuKeyboard(lang),
    });
    return;
  }

  // Buy credits
  if (data === 'buy_credits') {
    const text = getMessage(lang, 'credits_menu_title');
    const keyboard = createCreditPackagesKeyboard(lang);
    await bot.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
    return;
  }

  // Buy subscription
  if (data === 'buy_subscription') {
    const text = getMessage(lang, 'subscription_menu_title');
    const keyboard = createSubscriptionPackagesKeyboard(lang);
    await bot.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
    return;
  }

  // Select credit package
  if (data.startsWith('credits_')) {
    const credits = parseInt(data.replace('credits_', ''));
    const text = getMessage(lang, 'currency_menu_title');
    const keyboard = createCurrencyKeyboard(`credits_${credits}`, lang);
    await bot.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
    return;
  }

  // Select subscription package
  if (data.startsWith('subscription_')) {
    const plan = data.replace('subscription_', '');
    const text = getMessage(lang, 'currency_menu_title');
    const keyboard = createCurrencyKeyboard(`subscription_${plan}`, lang);
    await bot.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
    return;
  }

  // Select currency and create invoice
  if (data.startsWith('currency_')) {
    const parts = data.split('_');
    const type = parts[1]; // 'credits' or 'subscription'
    const item = parts[2]; // credits amount or subscription plan
    const currency = parts[3] as CryptoCurrency;

    await bot.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text: getMessage(lang, 'payment_creating'),
      parse_mode: 'HTML',
    });

    try {
      let amount: number;
      let description: string;
      let payload: string;

      if (type === 'credits') {
        const credits = parseInt(item);
        const pkg = CREDIT_PACKAGES.find((p) => p.credits === credits);
        if (!pkg) throw new Error('Package not found');

        amount = pkg.price;
        const totalCredits = pkg.credits + pkg.bonus;
        description = `${totalCredits} credits`;
        payload = JSON.stringify({
          type: 'credits',
          credits: totalCredits,
          telegramId: callbackQuery.from.id,
        });
      } else {
        const plan = item;
        const pkg = SUBSCRIPTION_PACKAGES.find((p) => p.id === plan);
        if (!pkg) throw new Error('Package not found');

        amount = pkg.price;
        description = `${pkg.name} subscription`;
        payload = JSON.stringify({
          type: 'subscription',
          plan: pkg.id,
          telegramId: callbackQuery.from.id,
        });
      }

      // Create invoice via CryptoBot
      const cryptoBot = getCryptoBotClient();
      const invoice = await cryptoBot.createInvoice({
        asset: currency,
        amount: amount.toString(),
        description,
        payload,
      });

      const text = getMessage(lang, 'payment_created', {
        amount: invoice.amount,
        currency: invoice.asset,
        description,
      });

      const keyboard = createPaymentKeyboard(invoice.bot_invoice_url, lang);

      await bot.editMessageText({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      await bot.editMessageText({
        chat_id: chatId,
        message_id: messageId,
        text: getMessage(lang, 'payment_error'),
        parse_mode: 'HTML',
        reply_markup: createMainMenuKeyboard(lang),
      });
    }
    return;
  }

  // Language selection
  if (data.startsWith('lang_')) {
    const newLang = data.replace('lang_', '') as Language;
    await setUserLanguage(callbackQuery.from.id, newLang);

    const text = getMessage(newLang, 'welcome');
    const keyboard = createMainMenuKeyboard(newLang);

    await bot.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
    return;
  }

  // Help
  if (data === 'help') {
    const text = getMessage(lang, 'help_title') + '\n\n' + getMessage(lang, 'help_text');
    await bot.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      reply_markup: createMainMenuKeyboard(lang),
    });
    return;
  }

  // Language menu
  if (data === 'language') {
    const keyboard = createLanguageKeyboard();
    await bot.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text: '🌐 Choose language / Выберите язык:',
      reply_markup: keyboard,
    });
    return;
  }
}

// Main handler for all updates
export async function handleTelegramUpdate(update: TelegramUpdate) {
  try {
    if (update.message) {
      const text = update.message.text;

      if (text === '/start') {
        await handleStart(update);
      } else if (text === '/balance') {
        await handleBalance(update);
      } else if (text === '/buy') {
        await handleBuy(update);
      } else if (text === '/help') {
        await handleHelp(update);
      } else if (text === '/language') {
        await handleLanguage(update);
      }
    } else if (update.callback_query) {
      await handleCallbackQuery(update);
    }
  } catch (error) {
    console.error('Error handling Telegram update:', error);
  }
}
