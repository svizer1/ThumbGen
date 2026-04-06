"""
Admin panel handlers
"""
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import Command
from aiogram.enums import ParseMode

from utils.firebase import get_statistics, get_all_users
from utils.messages import get_message
from keyboards.inline import admin_menu_keyboard, broadcast_audience_keyboard, back_to_main_keyboard

router = Router()

ADMIN_IDS = [5887561026]


@router.message(Command("admin"))
async def admin_command(message: Message):
    """Handle /admin command"""
    user = message.from_user
    
    if user.id not in ADMIN_IDS:
        await message.answer(get_message('ru', 'admin_no_access'))
        return
    
    await message.answer(
        get_message('ru', 'admin_menu'),
        parse_mode=ParseMode.HTML,
        reply_markup=admin_menu_keyboard()
    )


@router.callback_query(F.data == "admin_panel")
async def admin_panel_callback(callback: CallbackQuery):
    """Handle admin panel callback"""
    await callback.answer()
    
    user = callback.from_user
    
    if user.id not in ADMIN_IDS:
        await callback.answer(get_message('ru', 'admin_no_access'), show_alert=True)
        return
    
    await callback.message.edit_text(
        get_message('ru', 'admin_menu'),
        parse_mode=ParseMode.HTML,
        reply_markup=admin_menu_keyboard()
    )


@router.callback_query(F.data == "admin_stats")
async def admin_stats_callback(callback: CallbackQuery):
    """Handle admin stats callback"""
    await callback.answer()
    
    user = callback.from_user
    
    if user.id not in ADMIN_IDS:
        await callback.answer(get_message('ru', 'admin_no_access'), show_alert=True)
        return
    
    stats = get_statistics()
    text = get_message('ru', 'admin_stats',
                      total_users=stats['total_users'],
                      linked_users=stats['linked_users'],
                      unlinked_users=stats['unlinked_users'])
    
    await callback.message.edit_text(
        text,
        parse_mode=ParseMode.HTML,
        reply_markup=admin_menu_keyboard()
    )


@router.callback_query(F.data == "admin_users")
async def admin_users_callback(callback: CallbackQuery):
    """Handle admin users callback"""
    await callback.answer()
    
    user = callback.from_user
    
    if user.id not in ADMIN_IDS:
        await callback.answer(get_message('ru', 'admin_no_access'), show_alert=True)
        return
    
    users = get_all_users()
    
    # Show last 10 users
    users_list = ""
    for u in users[-10:]:
        username = f"@{u.get('username')}" if u.get('username') else "без username"
        first_name = u.get('firstName', 'Unknown')
        linked = "✅" if u.get('firebaseUid') else "❌"
        users_list += f"{linked} {first_name} ({username})\n"
    
    text = get_message('ru', 'admin_users', users_list=users_list)
    
    await callback.message.edit_text(
        text,
        parse_mode=ParseMode.HTML,
        reply_markup=admin_menu_keyboard()
    )


@router.callback_query(F.data == "admin_broadcast")
async def admin_broadcast_callback(callback: CallbackQuery):
    """Handle admin broadcast callback"""
    await callback.answer()
    
    user = callback.from_user
    
    if user.id not in ADMIN_IDS:
        await callback.answer(get_message('ru', 'admin_no_access'), show_alert=True)
        return
    
    await callback.message.edit_text(
        get_message('ru', 'broadcast_select_audience'),
        parse_mode=ParseMode.HTML,
        reply_markup=broadcast_audience_keyboard()
    )
