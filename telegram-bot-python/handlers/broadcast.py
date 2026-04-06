"""
Broadcast handlers with FSM
"""
import asyncio
import time
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from aiogram.filters import Command
from aiogram.enums import ParseMode

from states.broadcast import BroadcastStates
from utils.firebase import get_all_users
from utils.messages import get_message
from keyboards.inline import (
    broadcast_preview_keyboard,
    admin_menu_keyboard,
    back_to_main_keyboard
)

router = Router()

ADMIN_IDS = [5887561026]


@router.callback_query(F.data.startswith("broadcast_"))
async def broadcast_audience_selection(callback: CallbackQuery, state: FSMContext):
    """Handle broadcast audience selection"""
    await callback.answer()
    
    user = callback.from_user
    
    if user.id not in ADMIN_IDS:
        await callback.answer(get_message('ru', 'admin_no_access'), show_alert=True)
        return
    
    data = callback.data
    
    if data == "broadcast_all":
        audience = "all"
        audience_name = "Всем пользователям"
    elif data == "broadcast_linked":
        audience = "linked"
        audience_name = "С привязкой аккаунта"
    elif data == "broadcast_unlinked":
        audience = "unlinked"
        audience_name = "Без привязки"
    elif data == "broadcast_cancel":
        await state.clear()
        await callback.message.edit_text(
            get_message('ru', 'broadcast_cancelled'),
            parse_mode=ParseMode.HTML,
            reply_markup=admin_menu_keyboard()
        )
        return
    elif data == "broadcast_edit":
        await state.set_state(BroadcastStates.waiting_for_message)
        await callback.message.edit_text(
            get_message('ru', 'broadcast_enter_message'),
            parse_mode=ParseMode.HTML
        )
        return
    elif data == "broadcast_confirm":
        await send_broadcast(callback.message, state)
        return
    else:
        return
    
    # Save audience and ask for message
    await state.update_data(audience=audience, audience_name=audience_name)
    await state.set_state(BroadcastStates.waiting_for_message)
    
    await callback.message.edit_text(
        get_message('ru', 'broadcast_enter_message'),
        parse_mode=ParseMode.HTML
    )


@router.message(BroadcastStates.waiting_for_message)
async def broadcast_message_received(message: Message, state: FSMContext):
    """Handle broadcast message input"""
    user = message.from_user
    
    if user.id not in ADMIN_IDS:
        return
    
    # Save message
    await state.update_data(message_text=message.text or message.caption)
    
    # Get audience count
    data = await state.get_data()
    audience = data.get('audience', 'all')
    audience_name = data.get('audience_name', 'Всем')
    
    users = get_all_users()
    
    if audience == "linked":
        users = [u for u in users if u.get('firebaseUid')]
    elif audience == "unlinked":
        users = [u for u in users if not u.get('firebaseUid')]
    
    count = len(users)
    
    # Show preview
    preview_text = get_message('ru', 'broadcast_preview',
                              message=message.text or message.caption,
                              audience=audience_name,
                              count=count)
    
    await message.answer(
        preview_text,
        parse_mode=ParseMode.HTML,
        reply_markup=broadcast_preview_keyboard()
    )


@router.message(Command("cancel"))
async def cancel_broadcast(message: Message, state: FSMContext):
    """Cancel broadcast"""
    user = message.from_user
    
    if user.id not in ADMIN_IDS:
        return
    
    await state.clear()
    await message.answer(
        get_message('ru', 'broadcast_cancelled'),
        parse_mode=ParseMode.HTML,
        reply_markup=admin_menu_keyboard()
    )


async def send_broadcast(message: Message, state: FSMContext):
    """Send broadcast to users"""
    data = await state.get_data()
    audience = data.get('audience', 'all')
    message_text = data.get('message_text', '')
    
    users = get_all_users()
    
    if audience == "linked":
        users = [u for u in users if u.get('firebaseUid')]
    elif audience == "unlinked":
        users = [u for u in users if not u.get('firebaseUid')]
    
    total = len(users)
    sent = 0
    errors = 0
    start_time = time.time()
    
    # Show sending status
    status_message = await message.answer(
        get_message('ru', 'broadcast_sending', sent=0, total=total, errors=0),
        parse_mode=ParseMode.HTML
    )
    
    # Send to all users
    for i, user in enumerate(users):
        try:
            await message.bot.send_message(
                chat_id=user['telegramId'],
                text=message_text,
                parse_mode=ParseMode.HTML
            )
            sent += 1
        except Exception as e:
            errors += 1
            print(f"Failed to send to {user['telegramId']}: {e}")
        
        # Update status every 10 messages
        if (i + 1) % 10 == 0:
            try:
                await status_message.edit_text(
                    get_message('ru', 'broadcast_sending', sent=sent, total=total, errors=errors),
                    parse_mode=ParseMode.HTML
                )
            except:
                pass
        
        # Small delay to avoid rate limits
        await asyncio.sleep(0.05)
    
    # Calculate time
    elapsed_time = time.time() - start_time
    minutes = int(elapsed_time // 60)
    seconds = int(elapsed_time % 60)
    time_str = f"{minutes} мин {seconds} сек" if minutes > 0 else f"{seconds} сек"
    
    # Show completion
    await status_message.edit_text(
        get_message('ru', 'broadcast_completed', sent=sent, errors=errors, time=time_str),
        parse_mode=ParseMode.HTML,
        reply_markup=admin_menu_keyboard()
    )
    
    await state.clear()
