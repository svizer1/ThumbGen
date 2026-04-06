// Telegram Bot API Types

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  entities?: TelegramMessageEntity[];
}

export interface TelegramMessageEntity {
  type: string;
  offset: number;
  length: number;
  url?: string;
  user?: TelegramUser;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  chat_instance: string;
  data?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface TelegramInlineKeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
  icon_custom_emoji_id?: string;
}

export interface TelegramInlineKeyboardMarkup {
  inline_keyboard: TelegramInlineKeyboardButton[][];
}

export interface TelegramSendMessageOptions {
  chat_id: number;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  reply_markup?: TelegramInlineKeyboardMarkup;
  disable_web_page_preview?: boolean;
}

export interface TelegramAnswerCallbackQueryOptions {
  callback_query_id: string;
  text?: string;
  show_alert?: boolean;
}

export interface TelegramEditMessageTextOptions {
  chat_id: number;
  message_id: number;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  reply_markup?: TelegramInlineKeyboardMarkup;
}
