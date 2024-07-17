const fs = require('fs');
const path = './orders.json';

// Function to add orders
const addOrders = (date, orders) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.error('Error reading order.json:', err);
      return;
    }

    let orderData;
    try {
      orderData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing order.json:', parseErr);
      return;
    }

    if (!orderData[date]) {
      orderData[date] = [];
    }

    orders.forEach(order => {
      const [kol, sum, stop = 300] = order;
      orderData[date].push({ kol, sum, stop, desc: "" });
    });

    fs.writeFile(path, JSON.stringify(orderData, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing to order.json:', writeErr);
        return;
      }
      console.log('Orders added successfully!');
    });
  });
};

// Parse command line arguments
const args = process.argv.slice(2);
const date = args[0];
const orders = [];

for (let i = 1; i < args.length; i += 2) {
  const kol = parseInt(args[i]);
  const sum = parseInt(args[i + 1]);
  orders.push([kol, sum]);
}

addOrders(date, orders);
