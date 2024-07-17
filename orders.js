const axios = require('axios');

const BIN_ID = '66978ffdacd3cb34a867556e';
const SECRET_KEY = '$2a$10$XHj0.DGTDEqhbEY4RFKZau7LXkRq5jM15dAsXJnK4eU3P9hkaXpGi';
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function getOrders() {
  try {
    const response = await axios.get(BIN_URL, {
      headers: {
        'X-Master-Key': SECRET_KEY,
      },
    });
    return response.data.record.orders || [];
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    return [];
  }
}

async function saveOrders(orders) {
  try {
    await axios.put(BIN_URL, { orders }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': SECRET_KEY,
      },
    });
  } catch (error) {
    console.error('Error saving orders:', error.message);
  }
}

function addOrder(date, ordersInput) {
  const orders = ordersInput.split(',').map(order => {
    const [kol, sum] = order.trim().split(' ');
    return { date, kol: parseInt(kol), sum: parseFloat(sum) };
  });

  return getOrders().then(existingOrders => {
    const updatedOrders = [...existingOrders, ...orders];
    return saveOrders(updatedOrders).then(() => `Orders for ${date} added successfully.`);
  });
}

function getFilteredOrders(startDate, endDate) {
  return getOrders().then(orders => {
    return orders.filter(order => {
      const orderDate = new Date(order.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return orderDate >= start && orderDate <= end;
    });
  });
}

function getOrdersSummary(orders) {
  let summary = 'Orders Summary:\n';
  orders.forEach(order => {
    summary += `${order.date}: ${order.kol} items, total ${order.sum} \n`;
  });
  return summary;
}

module.exports = { addOrder, getFilteredOrders, getOrdersSummary };
