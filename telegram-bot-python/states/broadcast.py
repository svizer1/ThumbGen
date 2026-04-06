"""
FSM States for broadcast functionality
"""
from aiogram.fsm.state import State, StatesGroup


class BroadcastStates(StatesGroup):
    """States for broadcast flow"""
    waiting_for_audience = State()
    waiting_for_message = State()
    waiting_for_media = State()
    preview = State()
    sending = State()
