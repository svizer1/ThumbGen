import {
  TelegramInlineKeyboardMarkup,
  TelegramInlineKeyboardButton,
} from '@/types/telegram';
import { CREDIT_PACKAGES, SUBSCRIPTION_PACKAGES } from '@/types/payment';

export function createMainMenuKeyboard(lang: 'ru' | 'en'): TelegramInlineKeyboardMarkup {
  const buttons: TelegramInlineKeyboardButton[][] = [
    [
      { text: lang === 'ru' ? '💳 Купить кредиты' : '💳 Buy Credits', callback_data: 'buy_credits' },
      { text: lang === 'ru' ? '⭐ Купить подписку' : '⭐ Buy Subscription', callback_data: 'buy_subscription' },
    ],
    [
      { text: lang === 'ru' ? '💰 Мой баланс' : '💰 My Balance', callback_data: 'balance' },
    ],
    [
      { text: lang === 'ru' ? '🔗 Привязать аккаунт' : '🔗 Link Account', callback_data: 'link_account' },
    ],
    [
      { text: lang === 'ru' ? '❓ Помощь' : '❓ Help', callback_data: 'help' },
      { text: '🌐 Language', callback_data: 'language' },
    ],
  ];

  return { inline_keyboard: buttons };
}

export function createBackButton(lang: 'ru' | 'en'): TelegramInlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: lang === 'ru' ? '« Назад' : '« Back', callback_data: 'main_menu' }],
    ],
  };
}

export function createCreditPackagesKeyboard(lang: 'ru' | 'en'): TelegramInlineKeyboardMarkup {
  const buttons: TelegramInlineKeyboardButton[][] = CREDIT_PACKAGES.map((pkg) => {
    const text = pkg.bonus > 0
      ? `${pkg.credits} + ${pkg.bonus} ${lang === 'ru' ? 'кредитов' : 'credits'} - $${pkg.price}${pkg.popular ? ' ⭐' : ''}`
      : `${pkg.credits} ${lang === 'ru' ? 'кредитов' : 'credits'} - $${pkg.price}`;
    
    return [{ text, callback_data: `credits_${pkg.credits}` }];
  });

  buttons.push([{ text: lang === 'ru' ? '« Назад' : '« Back', callback_data: 'main_menu' }]);

  return { inline_keyboard: buttons };
}

export function createSubscriptionPackagesKeyboard(lang: 'ru' | 'en'): TelegramInlineKeyboardMarkup {
  const buttons: TelegramInlineKeyboardButton[][] = SUBSCRIPTION_PACKAGES.map((pkg) => {
    const text = `${pkg.name} - $${pkg.price}${lang === 'ru' ? '/месяц' : '/month'}${pkg.popular ? ' ⭐' : ''}`;
    return [{ text, callback_data: `subscription_${pkg.id}` }];
  });

  buttons.push([{ text: lang === 'ru' ? '« Назад' : '« Back', callback_data: 'main_menu' }]);

  return { inline_keyboard: buttons };
}

export function createCurrencyKeyboard(
  purchaseType: string,
  lang: 'ru' | 'en'
): TelegramInlineKeyboardMarkup {
  const buttons: TelegramInlineKeyboardButton[][] = [
    [{ text: '💎 TON', callback_data: `currency_${purchaseType}_TON` }],
    [{ text: '💵 USDT', callback_data: `currency_${purchaseType}_USDT` }],
    [{ text: '₿ BTC', callback_data: `currency_${purchaseType}_BTC` }],
    [{ text: 'Ξ ETH', callback_data: `currency_${purchaseType}_ETH` }],
    [{ text: lang === 'ru' ? '« Назад' : '« Back', callback_data: 'buy_menu' }],
  ];

  return { inline_keyboard: buttons };
}

export function createPaymentKeyboard(
  payUrl: string,
  lang: 'ru' | 'en'
): TelegramInlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: lang === 'ru' ? '💳 Оплатить' : '💳 Pay', url: payUrl }],
      [{ text: lang === 'ru' ? '🏠 Главное меню' : '🏠 Main Menu', callback_data: 'main_menu' }],
    ],
  };
}

export function createLanguageKeyboard(): TelegramInlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: '🇷🇺 Русский', callback_data: 'lang_ru' }],
      [{ text: '🇬🇧 English', callback_data: 'lang_en' }],
      [{ text: '« Back', callback_data: 'main_menu' }],
    ],
  };
}
