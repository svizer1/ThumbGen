import os
import logging
import asyncio
from aiogram import Bot, Dispatcher, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.filters import Command
from aiogram.enums import ParseMode
import requests
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Initialize Firebase Admin
cred_dict = {
    "type": "service_account",
    "project_id": os.getenv('FIREBASE_ADMIN_PROJECT_ID'),
    "private_key_id": "4b56f0d78f",
    "private_key": os.getenv('FIREBASE_ADMIN_PRIVATE_KEY').replace('\\n', '\n'),
    "client_email": os.getenv('FIREBASE_ADMIN_CLIENT_EMAIL'),
    "client_id": "324938535273",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.getenv('FIREBASE_ADMIN_CLIENT_EMAIL')}"
}
cred = credentials.Certificate(cred_dict)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Bot tokens
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
CRYPTOBOT_API_TOKEN = os.getenv('CRYPTOBOT_API_TOKEN')

# Admin IDs
ADMIN_IDS = [5887561026]

# Pricing data
CREDIT_PACKAGES = [
    {'credits': 50, 'price': 3, 'bonus': 0},
    {'credits': 150, 'price': 8, 'bonus': 10},
    {'credits': 400, 'price': 20, 'bonus': 50},
]

SUBSCRIPTION_PACKAGES = [
    {'id': 'starter', 'name': 'Starter', 'price': 5, 'credits': 200},
    {'id': 'pro', 'name': 'Pro', 'price': 15, 'credits': 600},
    {'id': 'unlimited', 'name': 'Unlimited', 'price': 30, 'credits': -1},
]

# Messages
MESSAGES = {
    'ru': {
        'welcome': '<tg-emoji emoji-id="5870994129244131212">👤</tg-emoji> <b>Добро пожаловать в ThumbnailGen Bot!</b>\n\nЗдесь вы можете купить кредиты и подписки для генерации изображений с помощью криптовалюты.\n\n<tg-emoji emoji-id="5260752406890711732">👾</tg-emoji> Поддерживаемые криптовалюты: TON, USDT, BTC, ETH\n\nВыберите действие:',
        'balance_title': '<tg-emoji emoji-id="5769126056262898415">👛</tg-emoji> <b>Ваш баланс</b>',
        'balance_credits': '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Кредиты: <b>{credits}</b>',
        'buy_menu': '<tg-emoji emoji-id="5884479287171485878">📦</tg-emoji> <b>Что вы хотите купить?</b>',
        'credits_menu': '<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> <b>Выберите пакет кредитов:</b>',
        'currency_menu': '<tg-emoji emoji-id="5260752406890711732">👾</tg-emoji> <b>Выберите криптовалюту:</b>',
        'payment_creating': '<tg-emoji emoji-id="5345906554510012647">🔄</tg-emoji> Создаю счет на оплату...',
        'payment_created': '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Счет создан!</b>\n\n<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Сумма: <b>{amount} {currency}</b>\n<tg-emoji emoji-id="5884479287171485878">📦</tg-emoji> Покупка: <b>{description}</b>\n\nНажмите кнопку ниже для оплаты:',
        'payment_success': '<tg-emoji emoji-id="5870633910337015697">✅</tg-emoji> <b>Оплата успешна!</b>\n\n<tg-emoji emoji-id="5904462880941545555">🪙</tg-emoji> Начислено кредитов: <b>{credits}</b>\n\n<tg-emoji emoji-id="6041731551845159060">🎉</tg-emoji> Спасибо за покупку!',
        'help': '<tg-emoji emoji-id="6028435952299413210">ℹ</tg-emoji> <b>Помощь</b>\n\n<b>Доступные команды:</b>\n\n/start - Главное меню\n/balance - Проверить баланс\n/buy - Купить кредиты\n/help - Показать эту справку',
    }
}

def get_message(lang, key, **kwargs):
    msg = MESSAGES[lang].get(key, key)
    return msg.format(**kwargs) if kwargs else msg

# Keyboards
def main_menu_keyboard():
    keyboard = [
        [
            InlineKeyboardButton(text="Купить кредиты", callback_data="buy_credits", icon_custom_emoji_id="5904462880941545555"),
            InlineKeyboardButton(text="Купить подписку", callback_data="buy_subscription", icon_custom_emoji_id="5870633910337015697"),
        ],
        [InlineKeyboardButton(text="Мой баланс", callback_data="balance", icon_custom_emoji_id="5769126056262898415")],
        [InlineKeyboardButton(text="Помощь", callback_data="help", icon_custom_emoji_id="6028435952299413210")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)

def admin_menu_keyboard():
    keyboard = [
        [InlineKeyboardButton(text="📊 Статистика", callback_data="admin_stats", icon_custom_emoji_id="5870921681735781843")],
        [InlineKeyboardButton(text="📢 Рассылка", callback_data="admin_broadcast", icon_custom_emoji_id="6039422865189638057")],
        [InlineKeyboardButton(text="👥 Пользователи", callback_data="admin_users", icon_custom_emoji_id="5870772616305839506")],
        [InlineKeyboardButton(text="Назад", callback_data="main_menu", icon_custom_emoji_id="5893057118545646106")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)

def credit_packages_keyboard():
    keyboard = []
    for pkg in CREDIT_PACKAGES:
        total = pkg['credits'] + pkg['bonus']
        text = f"{total} кредитов - ${pkg['price']}"
        keyboard.append([InlineKeyboardButton(text=text, callback_data=f"credits_{pkg['credits']}", icon_custom_emoji_id="5904462880941545555")])
    keyboard.append([InlineKeyboardButton(text="Назад", callback_data="main_menu", icon_custom_emoji_id="5893057118545646106")])
    return InlineKeyboardMarkup(inline_keyboard=keyboard)

def currency_keyboard(purchase_type):
    keyboard = [
        [InlineKeyboardButton(text="TON", callback_data=f"currency_{purchase_type}_TON", icon_custom_emoji_id="5260752406890711732")],
        [InlineKeyboardButton(text="USDT", callback_data=f"currency_{purchase_type}_USDT", icon_custom_emoji_id="5904462880941545555")],
        [InlineKeyboardButton(text="BTC", callback_data=f"currency_{purchase_type}_BTC", icon_custom_emoji_id="5904462880941545555")],
        [InlineKeyboardButton(text="ETH", callback_data=f"currency_{purchase_type}_ETH", icon_custom_emoji_id="5904462880941545555")],
        [InlineKeyboardButton(text="Назад", callback_data="buy_menu", icon_custom_emoji_id="5893057118545646106")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)

def payment_keyboard(pay_url):
    keyboard = [
        [InlineKeyboardButton(text="Оплатить", url=pay_url, icon_custom_emoji_id="5890848474563352982")],
        [InlineKeyboardButton(text="Главное меню", callback_data="main_menu", icon_custom_emoji_id="5873147866364514353")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)

# CryptoBot API
def create_invoice(amount, currency, description, payload):
    url = "https://pay.crypt.bot/api/createInvoice"
    headers = {"Crypto-Pay-API-Token": CRYPTOBOT_API_TOKEN}
    data = {
        "asset": currency,
        "amount": str(amount),
        "description": description,
        "payload": payload,
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Firebase operations
def get_or_create_user(telegram_id, first_name, username):
    user_ref = db.collection('telegram_users').document(str(telegram_id))
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        user_ref.set({
            'telegramId': telegram_id,
            'username': username,
            'firstName': first_name,
            'language': 'ru',
            'createdAt': datetime.now(),
            'lastInteraction': datetime.now(),
        })
    else:
        user_ref.update({'lastInteraction': datetime.now()})

def get_user_balance(telegram_id):
    user_ref = db.collection('telegram_users').document(str(telegram_id))
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        return 0
    
    firebase_uid = user_doc.to_dict().get('firebaseUid')
    if not firebase_uid:
        return 0
    
    firebase_user_ref = db.collection('users').document(firebase_uid)
    firebase_user_doc = firebase_user_ref.get()
    
    if not firebase_user_doc.exists:
        return 0
    
    return firebase_user_doc.to_dict().get('credits', 0)

def get_all_users():
    users_ref = db.collection('telegram_users')
    docs = users_ref.stream()
    return [doc.to_dict() for doc in docs]

def get_statistics():
    users = get_all_users()
    total_users = len(users)
    linked_users = sum(1 for u in users if u.get('firebaseUid'))
    
    return {
        'total_users': total_users,
        'linked_users': linked_users,
        'unlinked_users': total_users - linked_users
    }

# Initialize bot and dispatcher
bot = Bot(token=TELEGRAM_BOT_TOKEN)
dp = Dispatcher()

# Command handlers
@dp.message(Command("start"))
async def start_command(message: Message):
    user = message.from_user
    get_or_create_user(user.id, user.first_name, user.username)
    
    # Check if admin
    if user.id in ADMIN_IDS:
        keyboard = [
            [
                InlineKeyboardButton(text="Купить кредиты", callback_data="buy_credits", icon_custom_emoji_id="5904462880941545555"),
                InlineKeyboardButton(text="Купить подписку", callback_data="buy_subscription", icon_custom_emoji_id="5870633910337015697"),
            ],
            [InlineKeyboardButton(text="Мой баланс", callback_data="balance", icon_custom_emoji_id="5769126056262898415")],
            [InlineKeyboardButton(text="⚙️ Админ панель", callback_data="admin_panel", icon_custom_emoji_id="5870982283724328568")],
            [InlineKeyboardButton(text="Помощь", callback_data="help", icon_custom_emoji_id="6028435952299413210")],
        ]
        reply_markup = InlineKeyboardMarkup(inline_keyboard=keyboard)
    else:
        reply_markup = main_menu_keyboard()
    
    await message.answer(
        get_message('ru', 'welcome'),
        parse_mode=ParseMode.HTML,
        reply_markup=reply_markup
    )

@dp.message(Command("balance"))
async def balance_command(message: Message):
    user = message.from_user
    credits = get_user_balance(user.id)
    
    text = get_message('ru', 'balance_title') + '\n\n'
    text += get_message('ru', 'balance_credits', credits=credits)
    
    await message.answer(text, parse_mode=ParseMode.HTML)

@dp.message(Command("buy"))
async def buy_command(message: Message):
    await message.answer(
        get_message('ru', 'buy_menu'),
        parse_mode=ParseMode.HTML,
        reply_markup=main_menu_keyboard()
    )

@dp.message(Command("help"))
async def help_command(message: Message):
    await message.answer(
        get_message('ru', 'help'),
        parse_mode=ParseMode.HTML
    )

@dp.message(Command("admin"))
async def admin_command(message: Message):
    user = message.from_user
    if user.id not in ADMIN_IDS:
        await message.answer("❌ У вас нет доступа к админ панели")
        return
    
    await message.answer(
        "<tg-emoji emoji-id=\"5870982283724328568\">⚙️</tg-emoji> <b>Админ панель</b>\n\nВыберите действие:",
        parse_mode=ParseMode.HTML,
        reply_markup=admin_menu_keyboard()
    )

# Callback query handler
@dp.callback_query()
async def button_callback(callback: CallbackQuery):
    await callback.answer()
    
    data = callback.data
    user = callback.from_user
    
    # Admin panel
    if data == "admin_panel":
        if user.id not in ADMIN_IDS:
            await callback.answer("❌ У вас нет доступа", show_alert=True)
            return
        
        await callback.message.edit_text(
            "<tg-emoji emoji-id=\"5870982283724328568\">⚙️</tg-emoji> <b>Админ панель</b>\n\nВыберите действие:",
            parse_mode=ParseMode.HTML,
            reply_markup=admin_menu_keyboard()
        )
        return
    
    # Admin stats
    elif data == "admin_stats":
        if user.id not in ADMIN_IDS:
            await callback.answer("❌ У вас нет доступа", show_alert=True)
            return
        
        stats = get_statistics()
        text = f"""<tg-emoji emoji-id="5870921681735781843">📊</tg-emoji> <b>Статистика бота</b>

<tg-emoji emoji-id="5870772616305839506">👥</tg-emoji> Всего пользователей: <b>{stats['total_users']}</b>
<tg-emoji emoji-id="5891207662678317861">👤</tg-emoji> С привязанным аккаунтом: <b>{stats['linked_users']}</b>
<tg-emoji emoji-id="5893192487324880883">👤</tg-emoji> Без привязки: <b>{stats['unlinked_users']}</b>"""
        
        await callback.message.edit_text(
            text,
            parse_mode=ParseMode.HTML,
            reply_markup=admin_menu_keyboard()
        )
        return
    
    # Admin users list
    elif data == "admin_users":
        if user.id not in ADMIN_IDS:
            await callback.answer("❌ У вас нет доступа", show_alert=True)
            return
        
        users = get_all_users()
        text = "<tg-emoji emoji-id=\"5870772616305839506\">👥</tg-emoji> <b>Последние пользователи:</b>\n\n"
        
        for u in users[-10:]:  # Last 10 users
            username = f"@{u.get('username')}" if u.get('username') else "без username"
            text += f"• {u.get('firstName')} ({username})\n"
        
        await callback.message.edit_text(
            text,
            parse_mode=ParseMode.HTML,
            reply_markup=admin_menu_keyboard()
        )
        return
    
    if data == "main_menu":
        await callback.message.edit_text(
            get_message('ru', 'welcome'),
            parse_mode=ParseMode.HTML,
            reply_markup=main_menu_keyboard()
        )
    
    elif data == "balance":
        credits = get_user_balance(user.id)
        
        text = get_message('ru', 'balance_title') + '\n\n'
        text += get_message('ru', 'balance_credits', credits=credits)
        
        await callback.message.edit_text(text, parse_mode=ParseMode.HTML, reply_markup=main_menu_keyboard())
    
    elif data == "buy_credits":
        await callback.message.edit_text(
            get_message('ru', 'credits_menu'),
            parse_mode=ParseMode.HTML,
            reply_markup=credit_packages_keyboard()
        )
    
    elif data.startswith("credits_"):
        credits = int(data.replace("credits_", ""))
        await callback.message.edit_text(
            get_message('ru', 'currency_menu'),
            parse_mode=ParseMode.HTML,
            reply_markup=currency_keyboard(f"credits_{credits}")
        )
    
    elif data.startswith("currency_"):
        parts = data.split("_")
        purchase_type = parts[1]
        item = parts[2]
        currency = parts[3]
        
        await callback.message.edit_text(
            get_message('ru', 'payment_creating'),
            parse_mode=ParseMode.HTML
        )
        
        # Get package details
        credits_num = int(item)
        pkg = next((p for p in CREDIT_PACKAGES if p['credits'] == credits_num), None)
        
        if pkg:
            total_credits = pkg['credits'] + pkg['bonus']
            amount = pkg['price']
            description = f"{total_credits} credits"
            payload = f"credits_{total_credits}_{user.id}"
            
            # Create invoice
            result = create_invoice(amount, currency, description, payload)
            
            if result.get('ok'):
                invoice = result['result']
                text = get_message('ru', 'payment_created', 
                                 amount=invoice['amount'], 
                                 currency=invoice['asset'],
                                 description=description)
                
                await callback.message.edit_text(
                    text,
                    parse_mode=ParseMode.HTML,
                    reply_markup=payment_keyboard(invoice['bot_invoice_url'])
                )
    
    elif data == "help":
        await callback.message.edit_text(
            get_message('ru', 'help'),
            parse_mode=ParseMode.HTML,
            reply_markup=main_menu_keyboard()
        )

async def main():
    logger.info("Bot started!")
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())
