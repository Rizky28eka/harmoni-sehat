const midtransClient = require('midtrans-client');
const knex = require('knex')(require('../../../knexfile').development);

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const createTransaction = async (transactionData) => {
  const { orderId, amount, items, customer } = transactionData;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    item_details: items,
    customer_details: customer,
  };

  const transaction = await snap.createTransaction(parameter);
  
  // Save transaction to your database
  await knex('transactions').insert({
    order_id: orderId,
    amount: amount,
    status: 'pending',
    payment_token: transaction.token,
  });

  return transaction;
};

const handleNotification = async (notification) => {
    const { order_id, transaction_status, fraud_status } = notification;

    let status = 'pending';
    if (transaction_status == 'capture') {
        if (fraud_status == 'accept') {
            status = 'success';
        }
    } else if (transaction_status == 'settlement') {
        status = 'success';
    } else if (transaction_status == 'cancel' || transaction_status == 'deny' || transaction_status == 'expire') {
        status = 'failed';
    }

    await knex('transactions').where({ order_id }).update({ status });

    return { status: 'ok' };
};

module.exports = {
  createTransaction,
  handleNotification,
};
