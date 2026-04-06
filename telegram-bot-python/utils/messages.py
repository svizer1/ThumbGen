"""
Message templates for the bot
"""

MESSAGES = {
    'ru': {
        # Welcome and main menu
        'welcome': '<tg-emoji emoji-id="5870994129244131212">👤</tg-emoji> <b>Добро пожаловать в ThumbnailGen Bot!</b>\n\nЗдесь вы можете купить кредиты и подписки для генерации изображений с помощью криптовалюты.\n\n<tg-emoji emoji-id="5260752406890711732">👾</tg-emoji> Поддерживаемые криптовалюты: TON, USDT, BTC, ETH\n\nВыберите действие:',
        
        # Balance
        'balance_title': '<tg-emoji emoji-id="5769126056262898415">👛</tg-emoji> <b>Ваш баланс</b>',
        'balance_credits': '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Кредиты: <b>{credits}</b>',
        'balance_subscription': '<tg-emoji emoji-id="5884479287171485878">📦</tg-emoji> Подписка: <b>{plan}</b>',
        'balance_subscription_until': '<tg-emoji emoji-id="5890937706803894250">📅</tg-emoji> Действует до: <b>{date}</b>',
        'balance_linked': '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> Аккаунт: <b>Привязан</b>',
        'balance_not_linked': '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> Аккаунт: <b>Не привязан</b>',
        'balance_stats': '\n<tg-emoji emoji-id="5870921681735781843">📊</tg-emoji> <b>Статистика:</b>\n   • Всего генераций: <b>{generations}</b>',
        
        # Account linking
        'link_not_linked': '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> <b>Аккаунт не привязан</b>\n\nДля покупки кредитов и подписок необходимо привязать Telegram к аккаунту на сайте.\n\n<b>Как привязать:</b>\n1. Перейдите на сайт thumb-gen-swart.vercel.app\n2. Войдите в свой аккаунт\n3. Откройте страницу профиля\n4. Нажмите "Привязать Telegram"\n5. Перейдите по ссылке из профиля',
        'link_success': '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Аккаунт успешно привязан!</b>\n\nТеперь вы можете:\n• Покупать кредиты и подписки\n• Синхронизировать баланс с сайтом\n• Получать уведомления о генерациях',
        'link_already_linked': '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Ваш аккаунт уже привязан!</b>\n\nВы можете покупать кредиты и подписки.',
        'link_invalid_token': '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> <b>Неверный код привязки</b>\n\nКод недействителен или уже использован.\nПолучите новый код на сайте.',
        'link_required': '<tg-emoji emoji-id="5870657884844462243">⚠️</tg-emoji> <b>Требуется привязка аккаунта</b>\n\nДля покупки кредитов и подписок сначала привяжите Telegram к аккаунту на сайте.',
        
        # Purchase
        'buy_menu': '<tg-emoji emoji-id="5884479287171485878">📦</tg-emoji> <b>Что вы хотите купить?</b>',
        'credits_menu': '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> <b>Выберите пакет кредитов:</b>',
        'subscription_menu': '<tg-emoji emoji-id="5884479287171485878">📦</tg-emoji> <b>Выберите план подписки:</b>',
        'subscription_current': '\n<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Текущий план:</b> {plan}\n<tg-emoji emoji-id="5890937706803894250">📅</tg-emoji> Действует до: {date}\n<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Кредиты: {credits}',
        'subscription_free': '\n<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> У вас пока нет активной подписки.',
        'currency_menu': '<tg-emoji emoji-id="5260752406890711732">👾</tg-emoji> <b>Выберите криптовалюту:</b>',
        'payment_creating': '<tg-emoji emoji-id="5345906554510012647">🔄</tg-emoji> Создаю счет на оплату...',
        'payment_created': '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Счет создан!</b>\n\n<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Сумма: <b>{amount} {currency}</b>\n<tg-emoji emoji-id="5884479287171485878">📦</tg-emoji> Покупка: <b>{description}</b>\n\nНажмите кнопку ниже для оплаты:',
        'payment_success': '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Оплата успешна!</b>\n\n<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Начислено: <b>{credits}</b>\n\n<tg-emoji emoji-id="6041731551845159060">🎉</tg-emoji> Спасибо за покупку!',
        
        # Notifications
        'notification_low_balance': '<tg-emoji emoji-id="5870657884844462243">⚠️</tg-emoji> <b>Низкий баланс кредитов</b>\n\nУ вас осталось всего <b>{credits}</b> кредитов.\n\nПополните баланс, чтобы продолжить генерацию изображений.',
        'notification_subscription_expiring': '<tg-emoji emoji-id="5890937706803894250">⏰</tg-emoji> <b>Подписка заканчивается</b>\n\nВаша подписка <b>{plan}</b> истекает через <b>{days}</b> дней ({date}).\n\nПродлите подписку, чтобы не потерять доступ к премиум функциям.',
        'notification_subscription_expired': '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> <b>Подписка истекла</b>\n\nВаша подписка <b>{plan}</b> истекла {date}.\n\nВы переведены на бесплатный план.',
        
        # Help
        'help': '<tg-emoji emoji-id="6028435952299413210">ℹ</tg-emoji> <b>Помощь</b>\n\n<b>Доступные команды:</b>\n\n/start - Главное меню\n/balance - Проверить баланс\n/buy - Купить кредиты\n/subscription - Управление подпиской\n/help - Показать эту справку\n\n<b>Поддержка:</b>\nЕсли у вас возникли вопросы, свяжитесь с нами на сайте.',
        
        # Admin
        'admin_menu': '<tg-emoji emoji-id="5870982283724328568">⚙️</tg-emoji> <b>Админ панель</b>\n\nВыберите действие:',
        'admin_stats': '<tg-emoji emoji-id="5870921681735781843">📊</tg-emoji> <b>Статистика бота</b>\n\n<tg-emoji emoji-id="5870772616305839506">👥</tg-emoji> Всего пользователей: <b>{total_users}</b>\n<tg-emoji emoji-id="5891207662678317861">👤</tg-emoji> С привязанным аккаунтом: <b>{linked_users}</b>\n<tg-emoji emoji-id="5893192487324880883">👤</tg-emoji> Без привязки: <b>{unlinked_users}</b>',
        'admin_users': '<tg-emoji emoji-id="5870772616305839506">👥</tg-emoji> <b>Последние пользователи:</b>\n\n{users_list}',
        'admin_no_access': '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> У вас нет доступа к админ панели',
        
        # Broadcast
        'broadcast_select_audience': '<tg-emoji emoji-id="6039422865189638057">📢</tg-emoji> <b>Рассылка сообщений</b>\n\nВыберите аудиторию:',
        'broadcast_enter_message': '<tg-emoji emoji-id="5870753782874246579">✍</tg-emoji> <b>Введите сообщение для рассылки</b>\n\nВы можете использовать:\n• Текст (до 4096 символов)\n• HTML разметку\n• Кастомные эмодзи\n\nОтправьте сообщение или /cancel для отмены.',
        'broadcast_preview': '<tg-emoji emoji-id="6037397706505195857">👁</tg-emoji> <b>Предпросмотр сообщения</b>\n\n{message}\n\n<b>Аудитория:</b> {audience} ({count} чел.)',
        'broadcast_sending': '<tg-emoji emoji-id="5345906554510012647">🔄</tg-emoji> <b>Отправка...</b>\n\nОтправлено: {sent} / {total}\nОшибок: {errors}',
        'broadcast_completed': '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Рассылка завершена!</b>\n\n<tg-emoji emoji-id="5870921681735781843">📊</tg-emoji> <b>Статистика:</b>\n   • Отправлено: <b>{sent}</b>\n   • Ошибок: <b>{errors}</b>\n   • Время: <b>{time}</b>',
        'broadcast_cancelled': '<tg-emoji emoji-id="5870657884844462243">❌</tg-emoji> Рассылка отменена',
    }
}


def get_message(lang: str, key: str, **kwargs) -> str:
    """Get message template with formatting"""
    msg = MESSAGES.get(lang, {}).get(key, key)
    if kwargs:
        try:
            return msg.format(**kwargs)
        except KeyError:
            return msg
    return msg


def format_subscription_plan(plan: str) -> str:
    """Format subscription plan name"""
    plans = {
        'free': 'Free',
        'starter': 'Starter 🥉',
        'pro': 'Pro ⭐',
        'unlimited': 'Unlimited 🥇'
    }
    return plans.get(plan, plan)
