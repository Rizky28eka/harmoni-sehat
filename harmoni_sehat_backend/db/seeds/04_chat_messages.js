const { faker, NUM_CHAT_MESSAGES, randomDate } = require('../seed_utils');

exports.seed = async function(knex) {
  // Retrieve IDs from previous seed files
  const { konsultasiIds, userIds } = global;

  if (!konsultasiIds || konsultasiIds.length === 0 || !userIds || userIds.length === 0) {
    console.warn('Skipping 04_chat_messages.js: Missing required IDs. Ensure previous seed files ran successfully.');
    return;
  }

  // 31. chat_messages
  console.log('Seeding chat_messages...');
  const chatMessagesData = [];
  const messageTypeOptions = ['text', 'image', 'file', 'voice', 'video'];
  for (let i = 0; i < NUM_CHAT_MESSAGES; i++) {
    const konsultasiId = faker.helpers.arrayElement(konsultasiIds);
    const senderId = faker.helpers.arrayElement(userIds);
    const messageType = faker.helpers.arrayElement(messageTypeOptions);
    chatMessagesData.push({
      konsultasi_id: konsultasiId,
      sender_id: senderId,
      message_text: messageType === 'text' ? faker.lorem.sentence() : null,
      message_type: messageType,
      file_path: messageType !== 'text' ? faker.internet.url() : null,
      file_size: messageType !== 'text' ? faker.number.int({ min: 100, max: 5000000 }) : null,
      timestamp: randomDate(new Date(2024, 0, 1), new Date()),
      is_read: faker.datatype.boolean(),
      is_edited: faker.datatype.boolean(),
      // reply_to_message_id: faker.datatype.boolean() && chatMessageIds.length > 0 ? faker.helpers.arrayElement(chatMessageIds) : null, // This creates a circular dependency in seeding
    });
  }
  await knex.batchInsert('chat_messages', chatMessagesData, 1000);
  const chatMessageIds = (await knex.select('message_id').from('chat_messages')).map(row => row.message_id);
  console.log(`Seeded ${chatMessageIds.length} chat_messages.`);

  // Export IDs for subsequent seed files (if any)
  global.chatMessageIds = chatMessageIds;
};
