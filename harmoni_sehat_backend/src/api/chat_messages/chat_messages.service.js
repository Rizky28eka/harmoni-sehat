const knex = require('../../config/db');

const getAllChatMessages = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('chat_messages')
    .select('chat_messages.*', 'konsultasi.keluhan_utama', 'sender.email as sender_email', 'reply_to.message_text as reply_to_message')
    .join('konsultasi', 'chat_messages.konsultasi_id', 'konsultasi.konsultasi_id')
    .join('users as sender', 'chat_messages.sender_id', 'sender.user_id')
    .leftJoin('chat_messages as reply_to', 'chat_messages.reply_to_message_id', 'reply_to.message_id');

  if (search) {
    query.where('message_text', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('chat_messages').count('message_id as total').first();

  return { data, total: total.total, page, limit };
};

const getChatMessagesById = async (id) => {
  return knex('chat_messages')
    .select('chat_messages.*', 'konsultasi.keluhan_utama', 'sender.email as sender_email', 'reply_to.message_text as reply_to_message')
    .join('konsultasi', 'chat_messages.konsultasi_id', 'konsultasi.konsultasi_id')
    .join('users as sender', 'chat_messages.sender_id', 'sender.user_id')
    .leftJoin('chat_messages as reply_to', 'chat_messages.reply_to_message_id', 'reply_to.message_id')
    .where('message_id', id)
    .first();
};

const createChatMessages = async (chatMessagesData) => {
  return knex('chat_messages').insert(chatMessagesData).returning('*');
};

const updateChatMessages = async (id, chatMessagesData) => {
  return knex('chat_messages').where('message_id', id).update(chatMessagesData).returning('*');
};

const deleteChatMessages = async (id) => {
  return knex('chat_messages').where('message_id', id).del();
};

module.exports = {
  getAllChatMessages,
  getChatMessagesById,
  createChatMessages,
  updateChatMessages,
  deleteChatMessages,
};
