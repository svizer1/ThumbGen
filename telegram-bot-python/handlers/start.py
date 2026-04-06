"""
Start command and main menu handlers
"""
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import Command, CommandObject
from aiogram.enums import ParseMode

from utils.firebase import get_or_create_user, link_account, is_account_linked
from utils.messages import get_message
from keyboards.inline import main_menu_keyboard, link_account_keyboard, back_to_main_keyboard

router = Router()

ADMIN_IDS = [5887561026]


@router.message(Command("start"))
async def start_command(message: Message, command: CommandObject):
    """Handle /start command with optional link token"""
    user = message.from_user
    get_or_create_user(user.id, user.first_name, user.username)
    
    # Check if there's a link token in the command
    args = command.args
    if args and args.startswith("LINK_"):
        # Try to link account
        success = link_account(user.id, args)
        
        if success:
            await message.answer(
                get_message('ru', 'link_success'),
                parse_mode=ParseMode.HTML,
                reply_markup=main_menu_keyboard(user.id in ADMIN_IDS)
            )
        else:
            await message.answer(
                get_message('ru', 'link_invalid_token'),
                parse_mode=ParseMode.HTML,
                reply_markup=link_account_keyboard()
            )
        return
    
    # Normal start message
    is_admin = user.id in ADMIN_IDS
    await message.answer(
        get_message('ru', 'welcome'),
        parse_mode=ParseMode.HTML,
        reply_markup=main_menu_keyboard(is_admin)
    )


@router.callback_query(F.data == "main_menu")
async def main_menu_callback(callback: CallbackQuery):
    """Handle main menu callback"""
    await callback.answer()
    
    user = callback.from_user
    is_admin = user.id in ADMIN_IDS
    
    await callback.message.edit_text(
        get_message('ru', 'welcome'),
        parse_mode=ParseMode.HTML,
        reply_markup=main_menu_keyboard(is_admin)
    )


@router.callback_query(F.data == "link_account")
async def link_account_callback(callback: CallbackQuery):
    """Handle link account callback"""
    await callback.answer()
    
    user = callback.from_user
    
    # Check if already linked
    if is_account_linked(user.id):
        await callback.message.edit_text(
            get_message('ru', 'link_already_linked'),
            parse_mode=ParseMode.HTML,
            reply_markup=back_to_main_keyboard()
        )
        return
    
    # Show instructions
    await callback.message.edit_text(
        get_message('ru', 'link_not_linked'),
        parse_mode=ParseMode.HTML,
        reply_markup=link_account_keyboard()
    )


@router.callback_query(F.data == "link_help")
async def link_help_callback(callback: CallbackQuery):
    """Handle link help callback"""
    await callback.answer()
    
    await callback.message.edit_text(
        get_message('ru', 'link_not_linked'),
        parse_mode=ParseMode.HTML,
        reply_markup=link_account_keyboard()
    )


@router.message(Command("help"))
async def help_command(message: Message):
    """Handle /help command"""
    await message.answer(
        get_message('ru', 'help'),
        parse_mode=ParseMode.HTML,
        reply_markup=back_to_main_keyboard()
    )


@router.callback_query(F.data == "help")
async def help_callback(callback: CallbackQuery):
    """Handle help callback"""
    await callback.answer()
    
    await callback.message.edit_text(
        get_message('ru', 'help'),
        parse_mode=ParseMode.HTML,
        reply_markup=back_to_main_keyboard()
    )
