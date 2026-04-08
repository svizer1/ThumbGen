"""
Inline keyboards for the bot
"""
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup


def main_menu_keyboard(is_admin: bool = False) -> InlineKeyboardMarkup:
    """Main menu keyboard"""
    keyboard = [
        [
            InlineKeyboardButton(text="Купить кредиты", callback_data="buy_credits", icon_custom_emoji_id="5904462880941545555"),
            InlineKeyboardButton(text="Подписка", callback_data="subscription", icon_custom_emoji_id="5870633910337015697"),
        ],
        [
            InlineKeyboardButton(text="Мой баланс", callback_data="balance", icon_custom_emoji_id="5769126056262898415"),
            InlineKeyboardButton(text="Привязать аккаунт", callback_data="link_account", icon_custom_emoji_id="5769289093221454192"),
        ],
        [InlineKeyboardButton(text="Помощь", callback_data="help", icon_custom_emoji_id="6028435952299413210")],
    ]
    
    if is_admin:
        keyboard.append([InlineKeyboardButton(text="⚙️ Админ панель", callback_data="admin_panel", icon_custom_emoji_id="5870982283724328568")])
    
    return InlineKeyboardMarkup(inline_keyboard=keyboard)


def balance_keyboard(is_linked: bool) -> InlineKeyboardMarkup:
    """Balance menu keyboard"""
    keyboard = [
        [InlineKeyboardButton(text="Пополнить", callback_data="buy_credits", icon_custom_emoji_id="5904462880941545555")],
    ]
    
    if not is_linked:
        keyboard.append([InlineKeyboardButton(text="Привязать аккаунт", callback_data="link_account", icon_custom_emoji_id="5769289093221454192")])
    
    keyboard.append([InlineKeyboardButton(text="Назад", callback_data="main_menu", icon_custom_emoji_id="5893057118545646106")])
    
    return InlineKeyboardMarkup(inline_keyboard=keyboard)


def link_account_keyboard() -> InlineKeyboardMarkup:
    """Link account keyboard"""
    keyboard = [
        [InlineKeyboardButton(text="Как привязать?", callback_data="link_help", icon_custom_emoji_id="6028435952299413210")],
        [InlineKeyboardButton(text="Назад", callback_data="main_menu", icon_custom_emoji_id="5893057118545646106")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)


def credit_packages_keyboard() -> InlineKeyboardMarkup:
    """Credit packages keyboard"""
    packages = [
        {'credits': 50, 'price': 3, 'bonus': 0},
        {'credits': 150, 'price': 8, 'bonus': 10},
        {'credits': 400, 'price': 20, 'bonus': 50},
    ]
    
    keyboard = []
    for pkg in packages:
        total = pkg['credits'] + pkg['bonus']
        bonus_text = f" (+{pkg['bonus']} бонус)" if pkg['bonus'] > 0 else ""
        text = f"{total} кредитов{bonus_text} - ${pkg['price']}"
        keyboard.append([InlineKeyboardButton(text=text, callback_data=f"credits_{pkg['credits']}", icon_custom_emoji_id="5904462880941545555")])
    
    keyboard.append([InlineKeyboardButton(text="Назад", callback_data="main_menu", icon_custom_emoji_id="5893057118545646106")])
    return InlineKeyboardMarkup(inline_keyboard=keyboard)


def subscription_packages_keyboard(current_plan: str = 'free') -> InlineKeyboardMarkup:
    """Subscription packages keyboard"""
    packages = [
        {'id': 'starter', 'name': 'Starter 🥉', 'price': 5, 'credits': 200, 'period': 'мес'},
        {'id': 'pro', 'name': 'Pro ⭐', 'price': 15, 'credits': 600, 'period': 'мес'},
        {'id': 'unlimited', 'name': 'Unlimited 🥇', 'price': 30, 'credits': -1, 'period': 'мес'},
        {'id': 'starter_yearly', 'name': 'Starter 🥉 (Год)', 'price': 50, 'credits': 2400, 'period': 'год'},
        {'id': 'pro_yearly', 'name': 'Pro ⭐ (Год)', 'price': 150, 'credits': 7200, 'period': 'год'},
        {'id': 'unlimited_yearly', 'name': 'Unlimited 🥇 (Год)', 'price': 300, 'credits': -1, 'period': 'год'},
    ]
    
    keyboard = []
    for pkg in packages:
        credits_text = "Безлимит" if pkg['credits'] == -1 else f"{pkg['credits']} кредитов"
        current = " (текущий)" if pkg['id'] == current_plan else ""
        text = f"{pkg['name']} - ${pkg['price']}/{pkg['period']}\n{credits_text}{current}"
        keyboard.append([InlineKeyboardButton(text=text, callback_data=f"sub_{pkg['id']}", icon_custom_emoji_id="5884479287171485878")])
    
    keyboard.append([InlineKeyboardButton(text="Назад", callback_data="main_menu", icon_custom_emoji_id="5893057118545646106")])
    return InlineKeyboardMarkup(inline_keyboard=keyboard)


def currency_keyboard(purchase_type: str) -> InlineKeyboardMarkup:
    """Currency selection keyboard"""
    keyboard = [
        [InlineKeyboardButton(text="TON", callback_data=f"currency_{purchase_type}_TON", icon_custom_emoji_id="5260752406890711732")],
        [InlineKeyboardButton(text="USDT", callback_data=f"currency_{purchase_type}_USDT", icon_custom_emoji_id="5904462880941545555")],
        [InlineKeyboardButton(text="BTC", callback_data=f"currency_{purchase_type}_BTC", icon_custom_emoji_id="5904462880941545555")],
        [InlineKeyboardButton(text="ETH", callback_data=f"currency_{purchase_type}_ETH", icon_custom_emoji_id="5904462880941545555")],
        [InlineKeyboardButton(text="Назад", callback_data="buy_credits" if "credits" in purchase_type else "subscription", icon_custom_emoji_id="5893057118545646106")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)


def payment_keyboard(pay_url: str) -> InlineKeyboardMarkup:
    """Payment keyboard"""
    keyboard = [
        [InlineKeyboardButton(text="Оплатить", url=pay_url, icon_custom_emoji_id="5890848474563352982")],
        [InlineKeyboardButton(text="Главное меню", callback_data="main_menu", icon_custom_emoji_id="5873147866364514353")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)


def admin_menu_keyboard() -> InlineKeyboardMarkup:
    """Admin menu keyboard"""
    keyboard = [
        [InlineKeyboardButton(text="📊 Статистика", callback_data="admin_stats", icon_custom_emoji_id="5870921681735781843")],
        [InlineKeyboardButton(text="📢 Рассылка", callback_data="admin_broadcast", icon_custom_emoji_id="6039422865189638057")],
        [InlineKeyboardButton(text="👥 Пользователи", callback_data="admin_users", icon_custom_emoji_id="5870772616305839506")],
        [InlineKeyboardButton(text="Назад", callback_data="main_menu", icon_custom_emoji_id="5893057118545646106")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)


def broadcast_audience_keyboard() -> InlineKeyboardMarkup:
    """Broadcast audience selection keyboard"""
    keyboard = [
        [InlineKeyboardButton(text="👥 Всем пользователям", callback_data="broadcast_all", icon_custom_emoji_id="5870772616305839506")],
        [InlineKeyboardButton(text="✅ С привязкой аккаунта", callback_data="broadcast_linked", icon_custom_emoji_id="5870633910337015697")],
        [InlineKeyboardButton(text="❌ Без привязки", callback_data="broadcast_unlinked", icon_custom_emoji_id="5870657884844462243")],
        [InlineKeyboardButton(text="Назад", callback_data="admin_panel", icon_custom_emoji_id="5893057118545646106")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)


def broadcast_preview_keyboard() -> InlineKeyboardMarkup:
    """Broadcast preview keyboard"""
    keyboard = [
        [InlineKeyboardButton(text="✅ Отправить", callback_data="broadcast_confirm", icon_custom_emoji_id="5870633910337015697")],
        [InlineKeyboardButton(text="✏️ Редактировать", callback_data="broadcast_edit", icon_custom_emoji_id="5870676941614354370")],
        [InlineKeyboardButton(text="❌ Отменить", callback_data="broadcast_cancel", icon_custom_emoji_id="5870657884844462243")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)


def back_to_main_keyboard() -> InlineKeyboardMarkup:
    """Simple back to main menu keyboard"""
    keyboard = [
        [InlineKeyboardButton(text="Главное меню", callback_data="main_menu", icon_custom_emoji_id="5873147866364514353")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)
