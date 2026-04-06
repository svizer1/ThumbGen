import {
  TelegramInlineKeyboardMarkup,
  TelegramInlineKeyboardButton,
} from '@/types/telegram';
import { CREDIT_PACKAGES, SUBSCRIPTION_PACKAGES } from '@/types/payment';

export function createMainMenuKeyboard(lang: 'ru' | 'en'): TelegramInlineKeyboardMarkup {
  const buttons: TelegramInlineKeyboardButton[][] = [
    [
      { 
        text: lang === 'ru' ? 'Купить кредиты' : 'Buy Credits', 
        callback_data: 'buy_credits',
        icon_custom_emoji_id: '5904462880941545555'
      },
      { 
        text: lang === 'ru' ? 'Купить подписку' : 'Buy Subscription', 
        callback_data: 'buy_subscription',
        icon_custom_emoji_id: '5870633910337015697'
      },
    ],
    [
      { 
        text: lang === 'ru' ? 'Мой баланс' : 'My Balance', 
        callback_data: 'balance',
        icon_custom_emoji_id: '5769126056262898415'
      },
    ],
    [
      { 
        text: lang === 'ru' ? 'Привязать аккаунт' : 'Link Account', 
        callback_data: 'link_account',
        icon_custom_emoji_id: '5769289093221454192'
      },
    ],
    [
      { 
        text: lang === 'ru' ? 'Помощь' : 'Help', 
        callback_data: 'help',
        icon_custom_emoji_id: '6028435952299413210'
      },
      { 
        text: 'Language', 
        callback_data: 'language',
        icon_custom_emoji_id: '5870801517140775623'
      },
    ],
  ];

  return { inline_keyboard: buttons };
}

export function createBackButton(lang: 'ru' | 'en'): TelegramInlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ 
        text: lang === 'ru' ? 'Назад' : 'Back', 
        callback_data: 'main_menu',
        icon_custom_emoji_id: '5893057118545646106'
      }],
    ],
  };
}

export function createCreditPackagesKeyboard(lang: 'ru' | 'en'): TelegramInlineKeyboardMarkup {
  const buttons: TelegramInlineKeyboardButton[][] = CREDIT_PACKAGES.map((pkg) => {
    const text = pkg.bonus > 0
      ? `${pkg.credits} + ${pkg.bonus} ${lang === 'ru' ? 'кредитов' : 'credits'} - $${pkg.price}${pkg.popular ? ' ⭐' : ''}`
      : `${pkg.credits} ${lang === 'ru' ? 'кредитов' : 'credits'} - $${pkg.price}`;
    
    return [{ 
      text, 
      callback_data: `credits_${pkg.credits}`,
      icon_custom_emoji_id: '5904462880941545555'
    }];
  });

  buttons.push([{ 
    text: lang === 'ru' ? 'Назад' : 'Back', 
    callback_data: 'main_menu',
    icon_custom_emoji_id: '5893057118545646106'
  }]);

  return { inline_keyboard: buttons };
}

export function createSubscriptionPackagesKeyboard(lang: 'ru' | 'en'): TelegramInlineKeyboardMarkup {
  const buttons: TelegramInlineKeyboardButton[][] = SUBSCRIPTION_PACKAGES.map((pkg) => {
    const text = `${pkg.name} - $${pkg.price}${lang === 'ru' ? '/месяц' : '/month'}${pkg.popular ? ' ⭐' : ''}`;
    return [{ 
      text, 
      callback_data: `subscription_${pkg.id}`,
      icon_custom_emoji_id: '5870633910337015697'
    }];
  });

  buttons.push([{ 
    text: lang === 'ru' ? 'Назад' : 'Back', 
    callback_data: 'main_menu',
    icon_custom_emoji_id: '5893057118545646106'
  }]);

  return { inline_keyboard: buttons };
}

export function createCurrencyKeyboard(
  purchaseType: string,
  lang: 'ru' | 'en'
): TelegramInlineKeyboardMarkup {
  const buttons: TelegramInlineKeyboardButton[][] = [
    [{ 
      text: 'TON', 
      callback_data: `currency_${purchaseType}_TON`,
      icon_custom_emoji_id: '5260752406890711732'
    }],
    [{ 
      text: 'USDT', 
      callback_data: `currency_${purchaseType}_USDT`,
      icon_custom_emoji_id: '5904462880941545555'
    }],
    [{ 
      text: 'BTC', 
      callback_data: `currency_${purchaseType}_BTC`,
      icon_custom_emoji_id: '5904462880941545555'
    }],
    [{ 
      text: 'ETH', 
      callback_data: `currency_${purchaseType}_ETH`,
      icon_custom_emoji_id: '5904462880941545555'
    }],
    [{ 
      text: lang === 'ru' ? 'Назад' : 'Back', 
      callback_data: 'buy_menu',
      icon_custom_emoji_id: '5893057118545646106'
    }],
  ];

  return { inline_keyboard: buttons };
}

export function createPaymentKeyboard(
  payUrl: string,
  lang: 'ru' | 'en'
): TelegramInlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ 
        text: lang === 'ru' ? 'Оплатить' : 'Pay', 
        url: payUrl,
        icon_custom_emoji_id: '5890848474563352982'
      }],
      [{ 
        text: lang === 'ru' ? 'Главное меню' : 'Main Menu', 
        callback_data: 'main_menu',
        icon_custom_emoji_id: '5873147866364514353'
      }],
    ],
  };
}

export function createLanguageKeyboard(): TelegramInlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ 
        text: 'Русский', 
        callback_data: 'lang_ru',
        icon_custom_emoji_id: '5870801517140775623'
      }],
      [{ 
        text: 'English', 
        callback_data: 'lang_en',
        icon_custom_emoji_id: '5870801517140775623'
      }],
      [{ 
        text: 'Back', 
        callback_data: 'main_menu',
        icon_custom_emoji_id: '5893057118545646106'
      }],
    ],
  };
}
