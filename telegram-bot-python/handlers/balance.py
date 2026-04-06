"""
Balance and subscription handlers
"""
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import Command
from aiogram.enums import ParseMode
from datetime import datetime

from utils.firebase import get_user_balance, get_user_subscription, is_account_linked, get_user_info
from utils.messages import get_message, format_subscription_plan
from keyboards.inline import balance_keyboard, subscription_packages_keyboard, back_to_main_keyboard

router = Router()


@router.message(Command("balance"))
async def balance_command(message: Message):
    """Handle /balance command"""
    user = message.from_user
    await show_balance(message, user.id)


@router.callback_query(F.data == "balance")
async def balance_callback(callback: CallbackQuery):
    """Handle balance callback"""
    await callback.answer()
    user = callback.from_user
    await show_balance(callback.message, user.id, edit=True)


async def show_balance(message: Message, telegram_id: int, edit: bool = False):
    """Show user balance"""
    is_linked = is_account_linked(telegram_id)
    credits = get_user_balance(telegram_id)
    subscription = get_user_subscription(telegram_id)
    user_info = get_user_info(telegram_id)
    
    # Build message
    text = get_message('ru', 'balance_title') + '\n\n'
    text += get_message('ru', 'balance_credits', credits=credits) + '\n'
    
    # Subscription info
    if subscription and subscription.get('status') == 'active':
        plan = format_subscription_plan(subscription.get('plan', 'free'))
        text += get_message('ru', 'balance_subscription', plan=plan) + '\n'
        
        if subscription.get('currentPeriodEnd'):
            end_date = subscription['currentPeriodEnd']
            if hasattr(end_date, 'strftime'):
                date_str = end_date.strftime('%d.%m.%Y')
            else:
                date_str = str(end_date)
            text += get_message('ru', 'balance_subscription_until', date=date_str) + '\n'
    
    text += '\n'
    
    # Link status
    if is_linked:
        text += get_message('ru', 'balance_linked') + '\n'
        if user_info and user_info.get('username'):
            text += f"   @{user_info['username']}\n"
    else:
        text += get_message('ru', 'balance_not_linked') + '\n'
    
    # Statistics
    if user_info and user_info.get('totalGenerations'):
        text += get_message('ru', 'balance_stats', generations=user_info['totalGenerations'])
    
    keyboard = balance_keyboard(is_linked)
    
    if edit:
        await message.edit_text(text, parse_mode=ParseMode.HTML, reply_markup=keyboard)
    else:
        await message.answer(text, parse_mode=ParseMode.HTML, reply_markup=keyboard)


@router.message(Command("subscription"))
async def subscription_command(message: Message):
    """Handle /subscription command"""
    user = message.from_user
    await show_subscription(message, user.id)


@router.callback_query(F.data == "subscription")
async def subscription_callback(callback: CallbackQuery):
    """Handle subscription callback"""
    await callback.answer()
    user = callback.from_user
    await show_subscription(callback.message, user.id, edit=True)


async def show_subscription(message: Message, telegram_id: int, edit: bool = False):
    """Show subscription menu"""
    subscription = get_user_subscription(telegram_id)
    credits = get_user_balance(telegram_id)
    
    text = get_message('ru', 'subscription_menu')
    
    # Current subscription info
    if subscription and subscription.get('status') == 'active':
        plan = subscription.get('plan', 'free')
        plan_name = format_subscription_plan(plan)
        
        end_date = subscription.get('currentPeriodEnd')
        if end_date:
            if hasattr(end_date, 'strftime'):
                date_str = end_date.strftime('%d.%m.%Y')
            else:
                date_str = str(end_date)
        else:
            date_str = 'Не указано'
        
        text += get_message('ru', 'subscription_current', plan=plan_name, date=date_str, credits=credits)
        current_plan = plan
    else:
        text += get_message('ru', 'subscription_free')
        current_plan = 'free'
    
    keyboard = subscription_packages_keyboard(current_plan)
    
    if edit:
        await message.edit_text(text, parse_mode=ParseMode.HTML, reply_markup=keyboard)
    else:
        await message.answer(text, parse_mode=ParseMode.HTML, reply_markup=keyboard)
