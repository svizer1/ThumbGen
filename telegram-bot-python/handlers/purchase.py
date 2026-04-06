"""
Purchase handlers (credits and subscriptions)
"""
from aiogram import Router, F
from aiogram.types import CallbackQuery
from aiogram.enums import ParseMode

from utils.firebase import is_account_linked
from utils.messages import get_message
from utils.cryptobot import create_invoice
from keyboards.inline import (
    credit_packages_keyboard,
    currency_keyboard,
    payment_keyboard,
    link_account_keyboard,
    back_to_main_keyboard
)

router = Router()

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


@router.callback_query(F.data == "buy_credits")
async def buy_credits_callback(callback: CallbackQuery):
    """Handle buy credits callback"""
    await callback.answer()
    
    user = callback.from_user
    
    # Check if account is linked
    if not is_account_linked(user.id):
        await callback.message.edit_text(
            get_message('ru', 'link_required'),
            parse_mode=ParseMode.HTML,
            reply_markup=link_account_keyboard()
        )
        return
    
    await callback.message.edit_text(
        get_message('ru', 'credits_menu'),
        parse_mode=ParseMode.HTML,
        reply_markup=credit_packages_keyboard()
    )


@router.callback_query(F.data.startswith("credits_"))
async def select_credits_package(callback: CallbackQuery):
    """Handle credits package selection"""
    await callback.answer()
    
    credits = int(callback.data.replace("credits_", ""))
    
    await callback.message.edit_text(
        get_message('ru', 'currency_menu'),
        parse_mode=ParseMode.HTML,
        reply_markup=currency_keyboard(f"credits_{credits}")
    )


@router.callback_query(F.data.startswith("sub_"))
async def select_subscription_package(callback: CallbackQuery):
    """Handle subscription package selection"""
    await callback.answer()
    
    user = callback.from_user
    
    # Check if account is linked
    if not is_account_linked(user.id):
        await callback.message.edit_text(
            get_message('ru', 'link_required'),
            parse_mode=ParseMode.HTML,
            reply_markup=link_account_keyboard()
        )
        return
    
    plan_id = callback.data.replace("sub_", "")
    
    await callback.message.edit_text(
        get_message('ru', 'currency_menu'),
        parse_mode=ParseMode.HTML,
        reply_markup=currency_keyboard(f"sub_{plan_id}")
    )


@router.callback_query(F.data.startswith("currency_"))
async def select_currency(callback: CallbackQuery):
    """Handle currency selection and create invoice"""
    await callback.answer()
    
    user = callback.from_user
    parts = callback.data.split("_")
    
    # Parse callback data: currency_TYPE_ITEM_CURRENCY
    # Example: currency_credits_150_TON or currency_sub_pro_USDT
    purchase_type = parts[1]  # "credits" or "sub"
    item = parts[2]  # credits amount or subscription plan
    currency = parts[3]  # TON, USDT, BTC, ETH
    
    await callback.message.edit_text(
        get_message('ru', 'payment_creating'),
        parse_mode=ParseMode.HTML
    )
    
    # Prepare invoice data
    if purchase_type == "credits":
        credits_num = int(item)
        pkg = next((p for p in CREDIT_PACKAGES if p['credits'] == credits_num), None)
        
        if pkg:
            total_credits = pkg['credits'] + pkg['bonus']
            amount = pkg['price']
            bonus_text = f" (+{pkg['bonus']} бонус)" if pkg['bonus'] > 0 else ""
            description = f"{total_credits} кредитов{bonus_text}"
            payload = f"credits_{total_credits}_{user.id}"
    
    elif purchase_type == "sub":
        plan_id = item
        pkg = next((p for p in SUBSCRIPTION_PACKAGES if p['id'] == plan_id), None)
        
        if pkg:
            amount = pkg['price']
            credits_text = "Безлимит" if pkg['credits'] == -1 else f"{pkg['credits']} кредитов/мес"
            description = f"Подписка {pkg['name']} ({credits_text})"
            payload = f"subscription_{plan_id}_{user.id}"
    
    else:
        await callback.message.edit_text(
            "❌ Ошибка при создании счета",
            parse_mode=ParseMode.HTML,
            reply_markup=back_to_main_keyboard()
        )
        return
    
    # Create invoice
    result = create_invoice(amount, currency, description, payload)
    
    if result and result.get('ok'):
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
    else:
        await callback.message.edit_text(
            "❌ Ошибка при создании счета. Попробуйте позже.",
            parse_mode=ParseMode.HTML,
            reply_markup=back_to_main_keyboard()
        )
