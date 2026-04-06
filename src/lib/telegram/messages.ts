export const messages = {
  ru: {
    // Welcome & Start
    welcome: `<tg-emoji emoji-id="5870994129244131212">👤</tg-emoji> <b>Добро пожаловать в ThumbnailGen Bot!</b>

Здесь вы можете купить кредиты и подписки для генерации изображений с помощью криптовалюты.

<tg-emoji emoji-id="5260752406890711732">👾</tg-emoji> Поддерживаемые криптовалюты: TON, USDT, BTC, ETH

Выберите действие:`,

    // Balance
    balance_title: '<tg-emoji emoji-id="5769126056262898415">👛</tg-emoji> <b>Ваш баланс</b>',
    balance_credits: '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Кредиты: <b>{credits}</b>',
    balance_subscription: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Подписка: <b>{plan}</b>',
    balance_subscription_until: '<tg-emoji emoji-id="5890937706803894250">📅</tg-emoji> Действует до: <b>{date}</b>',
    balance_no_subscription: '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> Подписка: <b>Нет активной</b>',

    // Buy Menu
    buy_menu_title: '<tg-emoji emoji-id="5884479287171485878">📦</tg-emoji> <b>Что вы хотите купить?</b>',
    buy_credits: '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Купить кредиты',
    buy_subscription: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Купить подписку',

    // Credit Packages
    credits_menu_title: '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> <b>Выберите пакет кредитов:</b>',
    credits_package: '{credits} кредитов - ${price}',
    credits_package_bonus: '{credits} кредитов + {bonus} бонус - ${price}',
    credits_popular: '<tg-emoji emoji-id="6041731551845159060">🎉</tg-emoji> Популярно',

    // Subscription Packages
    subscription_menu_title: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Выберите подписку:</b>',
    subscription_starter: 'Starter - $5/месяц\n200 генераций',
    subscription_pro: 'Pro - $15/месяц\n600 генераций',
    subscription_unlimited: 'Unlimited - $30/месяц\n∞ Безлимит',

    // Currency Selection
    currency_menu_title: '<tg-emoji emoji-id="5260752406890711732">👾</tg-emoji> <b>Выберите криптовалюту:</b>',
    currency_ton: '💎 TON',
    currency_usdt: '💵 USDT',
    currency_btc: '₿ BTC',
    currency_eth: 'Ξ ETH',

    // Payment
    payment_creating: '<tg-emoji emoji-id="5345906554510012647">🔄</tg-emoji> Создаю счет на оплату...',
    payment_created: `<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Счет создан!</b>

<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Сумма: <b>{amount} {currency}</b>
<tg-emoji emoji-id="5884479287171485878">📦</tg-emoji> Покупка: <b>{description}</b>

Нажмите кнопку ниже для оплаты:`,
    payment_button: '<tg-emoji emoji-id="5890848474563352982">🪙</tg-emoji> Оплатить {amount} {currency}',
    payment_success: `<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Оплата успешна!</b>

{reward}

<tg-emoji emoji-id="6041731551845159060">🎉</tg-emoji> Спасибо за покупку!`,
    payment_credits_reward: '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Начислено кредитов: <b>{credits}</b>',
    payment_subscription_reward: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Подписка <b>{plan}</b> активирована до <b>{date}</b>',
    payment_error: '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> Ошибка при создании счета. Попробуйте позже.',

    // Link Account
    link_menu_title: '<tg-emoji emoji-id="5769289093221454192">🔗</tg-emoji> <b>Привязка аккаунта</b>',
    link_description: `Чтобы привязать ваш Telegram к существующему аккаунту на сайте:

1. Перейдите на сайт: thumbnail-gen.vercel.app
2. Войдите в свой аккаунт
3. Откройте настройки профиля
4. Введите код привязки: <code>{code}</code>

<tg-emoji emoji-id="5775896410780079073">🕓</tg-emoji> Код действителен 10 минут.`,
    link_success: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Аккаунт успешно привязан!',
    link_already_linked: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Ваш Telegram уже привязан к аккаунту.',

    // Help
    help_title: '<tg-emoji emoji-id="6028435952299413210">ℹ</tg-emoji> <b>Помощь</b>',
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
    btn_back: '<tg-emoji emoji-id="5893057118545646106">📰</tg-emoji> Назад',
    btn_main_menu: '<tg-emoji emoji-id="5873147866364514353">🏘</tg-emoji> Главное меню',
    btn_buy_credits: '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Купить кредиты',
    btn_buy_subscription: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Купить подписку',
    btn_balance: '<tg-emoji emoji-id="5769126056262898415">👛</tg-emoji> Мой баланс',
    btn_link_account: '<tg-emoji emoji-id="5769289093221454192">🔗</tg-emoji> Привязать аккаунт',
    btn_help: '<tg-emoji emoji-id="6028435952299413210">ℹ</tg-emoji> Помощь',
    btn_language: '<tg-emoji emoji-id="5870801517140775623">🔗</tg-emoji> Язык',

    // Errors
    error_generic: '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> Произошла ошибка. Попробуйте позже.',
    error_no_account: '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> Аккаунт не найден. Используйте /link для привязки.',
  },

  en: {
    // Welcome & Start
    welcome: `<tg-emoji emoji-id="5870994129244131212">👤</tg-emoji> <b>Welcome to ThumbnailGen Bot!</b>

Here you can buy credits and subscriptions for image generation using cryptocurrency.

<tg-emoji emoji-id="5260752406890711732">👾</tg-emoji> Supported cryptocurrencies: TON, USDT, BTC, ETH

Choose an action:`,

    // Balance
    balance_title: '<tg-emoji emoji-id="5769126056262898415">👛</tg-emoji> <b>Your Balance</b>',
    balance_credits: '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Credits: <b>{credits}</b>',
    balance_subscription: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Subscription: <b>{plan}</b>',
    balance_subscription_until: '<tg-emoji emoji-id="5890937706803894250">📅</tg-emoji> Valid until: <b>{date}</b>',
    balance_no_subscription: '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> Subscription: <b>None active</b>',

    // Buy Menu
    buy_menu_title: '<tg-emoji emoji-id="5884479287171485878">📦</tg-emoji> <b>What would you like to buy?</b>',
    buy_credits: '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Buy Credits',
    buy_subscription: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Buy Subscription',

    // Credit Packages
    credits_menu_title: '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> <b>Choose a credit package:</b>',
    credits_package: '{credits} credits - ${price}',
    credits_package_bonus: '{credits} credits + {bonus} bonus - ${price}',
    credits_popular: '<tg-emoji emoji-id="6041731551845159060">🎉</tg-emoji> Popular',

    // Subscription Packages
    subscription_menu_title: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Choose a subscription:</b>',
    subscription_starter: 'Starter - $5/month\n200 generations',
    subscription_pro: 'Pro - $15/month\n600 generations',
    subscription_unlimited: 'Unlimited - $30/month\n∞ Unlimited',

    // Currency Selection
    currency_menu_title: '<tg-emoji emoji-id="5260752406890711732">👾</tg-emoji> <b>Choose cryptocurrency:</b>',
    currency_ton: '💎 TON',
    currency_usdt: '💵 USDT',
    currency_btc: '₿ BTC',
    currency_eth: 'Ξ ETH',

    // Payment
    payment_creating: '<tg-emoji emoji-id="5345906554510012647">🔄</tg-emoji> Creating invoice...',
    payment_created: `<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Invoice created!</b>

<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Amount: <b>{amount} {currency}</b>
<tg-emoji emoji-id="5884479287171485878">📦</tg-emoji> Purchase: <b>{description}</b>

Click the button below to pay:`,
    payment_button: '<tg-emoji emoji-id="5890848474563352982">🪙</tg-emoji> Pay {amount} {currency}',
    payment_success: `<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Payment successful!</b>

{reward}

<tg-emoji emoji-id="6041731551845159060">🎉</tg-emoji> Thank you for your purchase!`,
    payment_credits_reward: '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Credits added: <b>{credits}</b>',
    payment_subscription_reward: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Subscription <b>{plan}</b> activated until <b>{date}</b>',
    payment_error: '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> Error creating invoice. Please try again later.',

    // Link Account
    link_menu_title: '<tg-emoji emoji-id="5769289093221454192">🔗</tg-emoji> <b>Link Account</b>',
    link_description: `To link your Telegram to an existing website account:

1. Go to: thumbnail-gen.vercel.app
2. Log in to your account
3. Open profile settings
4. Enter the link code: <code>{code}</code>

<tg-emoji emoji-id="5775896410780079073">🕓</tg-emoji> Code is valid for 10 minutes.`,
    link_success: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Account successfully linked!',
    link_already_linked: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Your Telegram is already linked to an account.',

    // Help
    help_title: '<tg-emoji emoji-id="6028435952299413210">ℹ</tg-emoji> <b>Help</b>',
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
    btn_back: '<tg-emoji emoji-id="5893057118545646106">📰</tg-emoji> Back',
    btn_main_menu: '<tg-emoji emoji-id="5873147866364514353">🏘</tg-emoji> Main Menu',
    btn_buy_credits: '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Buy Credits',
    btn_buy_subscription: '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Buy Subscription',
    btn_balance: '<tg-emoji emoji-id="5769126056262898415">👛</tg-emoji> My Balance',
    btn_link_account: '<tg-emoji emoji-id="5769289093221454192">🔗</tg-emoji> Link Account',
    btn_help: '<tg-emoji emoji-id="6028435952299413210">ℹ</tg-emoji> Help',
    btn_language: '<tg-emoji emoji-id="5870801517140775623">🔗</tg-emoji> Language',

    // Errors
    error_generic: '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> An error occurred. Please try again later.',
    error_no_account: '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> Account not found. Use /link to connect.',
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
