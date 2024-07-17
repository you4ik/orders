const axios = require('axios');

// Your JSONBin.io credentials
const BIN_ID = '66978ffdacd3cb34a867556e';  // Replace with your bin ID
const SECRET_KEY = '$2a$10$XHj0.DGTDEqhbEY4RFKZau7LXkRq5jM15dAsXJnK4eU3P9hkaXpGi';  // Replace with your secret key

// Function to get the existing data from the bin
const getOrders = async () => {
  try {
    const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': SECRET_KEY
      }
    });
    return response.data.record;
  } catch (error) {
    console.error('Error fetching data from JSONBin:', error);
    return {};
  }
};

// Function to update the bin with new orders
const updateOrders = async (data) => {
  try {
    await axios.put(`https://api.jsonbin.io/v3/b/${BIN_ID}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': SECRET_KEY
      }
    });
    console.log('Orders updated successfully!');
  } catch (error) {
    console.error('Error updating data in JSONBin:', error);
  }
};

// Function to add orders
const addOrders = async (date, orders) => {
  const orderData = await getOrders();

  if (!orderData[date]) {
    orderData[date] = [];
  }

  orders.forEach(order => {
    const [kol, sum, stop = 300] = order;
    orderData[date].push({ kol, sum, stop, desc: "" });
  });

  await updateOrders(orderData);

  // Display updated orders for the given date
  console.log(`Orders for ${date}:`);
  console.log(orderData[date]);
};

// Function to list all orders
const listOrders = async () => {
  const orderData = await getOrders();
  console.log('All Orders:');
  console.log(orderData);
};

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === 'add') {
  const date = args[1];
  const orders = [];

  for (let i = 2; i < args.length; i += 2) {
    const kol = parseInt(args[i]);
    const sum = parseInt(args[i + 1]);
    orders.push([kol, sum]);
  }

  addOrders(date, orders);
} else if (command === 'list') {
  listOrders();
} else {
  console.log('Invalid command. Use "add" to add orders or "list" to list all orders.');
}
