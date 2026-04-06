export const messages = {
  ru: {
    // Welcome & Start
    welcome: `👋 Добро пожаловать в <b>ThumbnailGen Bot</b>!

Здесь вы можете купить кредиты и подписки для генерации изображений с помощью криптовалюты.

💎 Поддерживаемые криптовалюты: TON, USDT, BTC, ETH

Выберите действие:`,

    // Balance
    balance_title: '💰 <b>Ваш баланс</b>',
    balance_credits: '🎫 Кредиты: <b>{credits}</b>',
    balance_subscription: '⭐ Подписка: <b>{plan}</b>',
    balance_subscription_until: '📅 Действует до: <b>{date}</b>',
    balance_no_subscription: '⭐ Подписка: <b>Нет активной</b>',

    // Buy Menu
    buy_menu_title: '🛒 <b>Что вы хотите купить?</b>',
    buy_credits: '💳 Купить кредиты',
    buy_subscription: '⭐ Купить подписку',

    // Credit Packages
    credits_menu_title: '💳 <b>Выберите пакет кредитов:</b>',
    credits_package: '{credits} кредитов - ${price}',
    credits_package_bonus: '{credits} кредитов + {bonus} бонус - ${price}',
    credits_popular: '⭐ Популярно',

    // Subscription Packages
    subscription_menu_title: '⭐ <b>Выберите подписку:</b>',
    subscription_starter: 'Starter - $5/месяц\n200 генераций',
    subscription_pro: 'Pro - $15/месяц\n600 генераций',
    subscription_unlimited: 'Unlimited - $30/месяц\n∞ Безлимит',

    // Currency Selection
    currency_menu_title: '💱 <b>Выберите криптовалюту:</b>',
    currency_ton: '💎 TON',
    currency_usdt: '💵 USDT',
    currency_btc: '₿ BTC',
    currency_eth: 'Ξ ETH',

    // Payment
    payment_creating: '⏳ Создаю счет на оплату...',
    payment_created: `✅ <b>Счет создан!</b>

💰 Сумма: <b>{amount} {currency}</b>
📦 Покупка: <b>{description}</b>

Нажмите кнопку ниже для оплаты:`,
    payment_button: '💳 Оплатить {amount} {currency}',
    payment_success: `✅ <b>Оплата успешна!</b>

{reward}

Спасибо за покупку! 🎉`,
    payment_credits_reward: '🎫 Начислено кредитов: <b>{credits}</b>',
    payment_subscription_reward: '⭐ Подписка <b>{plan}</b> активирована до <b>{date}</b>',
    payment_error: '❌ Ошибка при создании счета. Попробуйте позже.',

    // Link Account
    link_menu_title: '🔗 <b>Привязка аккаунта</b>',
    link_description: `Чтобы привязать ваш Telegram к существующему аккаунту на сайте:

1. Перейдите на сайт: thumbnail-gen.vercel.app
2. Войдите в свой аккаунт
3. Откройте настройки профиля
4. Введите код привязки: <code>{code}</code>

Код действителен 10 минут.`,
    link_success: '✅ Аккаунт успешно привязан!',
    link_already_linked: '✅ Ваш Telegram уже привязан к аккаунту.',

    // Help
    help_title: '❓ <b>Помощь</b>',
    help_text: `<b>Доступные команды:</b>

/start - Главное меню
/balance - Проверить баланс
/buy - Купить кредиты или подписку
/link - Привязать аккаунт
/language - Сменить язык
/help - Показать эту справку

<b>Поддержка:</b>
Если у вас возникли вопросы, напишите нам на сайте.`,

    // Buttons
    btn_back: '« Назад',
    btn_main_menu: '🏠 Главное меню',
    btn_buy_credits: '💳 Купить кредиты',
    btn_buy_subscription: '⭐ Купить подписку',
    btn_balance: '💰 Мой баланс',
    btn_link_account: '🔗 Привязать аккаунт',
    btn_help: '❓ Помощь',
    btn_language: '🌐 Язык',

    // Errors
    error_generic: '❌ Произошла ошибка. Попробуйте позже.',
    error_no_account: '❌ Аккаунт не найден. Используйте /link для привязки.',
  },

  en: {
    // Welcome & Start
    welcome: `👋 Welcome to <b>ThumbnailGen Bot</b>!

Here you can buy credits and subscriptions for image generation using cryptocurrency.

💎 Supported cryptocurrencies: TON, USDT, BTC, ETH

Choose an action:`,

    // Balance
    balance_title: '💰 <b>Your Balance</b>',
    balance_credits: '🎫 Credits: <b>{credits}</b>',
    balance_subscription: '⭐ Subscription: <b>{plan}</b>',
    balance_subscription_until: '📅 Valid until: <b>{date}</b>',
    balance_no_subscription: '⭐ Subscription: <b>None active</b>',

    // Buy Menu
    buy_menu_title: '🛒 <b>What would you like to buy?</b>',
    buy_credits: '💳 Buy Credits',
    buy_subscription: '⭐ Buy Subscription',

    // Credit Packages
    credits_menu_title: '💳 <b>Choose a credit package:</b>',
    credits_package: '{credits} credits - ${price}',
    credits_package_bonus: '{credits} credits + {bonus} bonus - ${price}',
    credits_popular: '⭐ Popular',

    // Subscription Packages
    subscription_menu_title: '⭐ <b>Choose a subscription:</b>',
    subscription_starter: 'Starter - $5/month\n200 generations',
    subscription_pro: 'Pro - $15/month\n600 generations',
    subscription_unlimited: 'Unlimited - $30/month\n∞ Unlimited',

    // Currency Selection
    currency_menu_title: '💱 <b>Choose cryptocurrency:</b>',
    currency_ton: '💎 TON',
    currency_usdt: '💵 USDT',
    currency_btc: '₿ BTC',
    currency_eth: 'Ξ ETH',

    // Payment
    payment_creating: '⏳ Creating invoice...',
    payment_created: `✅ <b>Invoice created!</b>

💰 Amount: <b>{amount} {currency}</b>
📦 Purchase: <b>{description}</b>

Click the button below to pay:`,
    payment_button: '💳 Pay {amount} {currency}',
    payment_success: `✅ <b>Payment successful!</b>

{reward}

Thank you for your purchase! 🎉`,
    payment_credits_reward: '🎫 Credits added: <b>{credits}</b>',
    payment_subscription_reward: '⭐ Subscription <b>{plan}</b> activated until <b>{date}</b>',
    payment_error: '❌ Error creating invoice. Please try again later.',

    // Link Account
    link_menu_title: '🔗 <b>Link Account</b>',
    link_description: `To link your Telegram to an existing website account:

1. Go to: thumbnail-gen.vercel.app
2. Log in to your account
3. Open profile settings
4. Enter the link code: <code>{code}</code>

Code is valid for 10 minutes.`,
    link_success: '✅ Account successfully linked!',
    link_already_linked: '✅ Your Telegram is already linked to an account.',

    // Help
    help_title: '❓ <b>Help</b>',
    help_text: `<b>Available commands:</b>

/start - Main menu
/balance - Check balance
/buy - Buy credits or subscription
/link - Link account
/language - Change language
/help - Show this help

<b>Support:</b>
If you have questions, contact us on the website.`,

    // Buttons
    btn_back: '« Back',
    btn_main_menu: '🏠 Main Menu',
    btn_buy_credits: '💳 Buy Credits',
    btn_buy_subscription: '⭐ Buy Subscription',
    btn_balance: '💰 My Balance',
    btn_link_account: '🔗 Link Account',
    btn_help: '❓ Help',
    btn_language: '🌐 Language',

    // Errors
    error_generic: '❌ An error occurred. Please try again later.',
    error_no_account: '❌ Account not found. Use /link to connect.',
  },
};

export type Language = 'ru' | 'en';

export function getMessage(lang: Language, key: string, params?: Record<string, string>): string {
  let message = messages[lang][key as keyof typeof messages.ru] || messages.ru[key as keyof typeof messages.ru] || key;

  if (params) {
    Object.keys(params).forEach((param) => {
      message = message.replace(new RegExp(`{${param}}`, 'g'), params[param]);
    });
  }

  return message;
}
