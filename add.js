const fs = require('fs');
const path = './orders.json';

// Function to add orders
const addOrders = (date, orders) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.error('Error reading orders.json:', err);
      return;
    }

    let orderData;
    try {
      orderData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing orders.json:', parseErr);
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
        console.error('Error writing to orders.json:', writeErr);
        return;
      }
      console.log('Orders added successfully!');
    });
  });
};

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 3 || args.length % 2 === 0) {
  console.error('Usage: node add.js <date> <kol1> <sum1> [<kol2> <sum2> ...]');
  process.exit(1);
}

const date = args[0];
const orders = [];

for (let i = 1; i < args.length; i += 2) {
  const kol = parseInt(args[i]);
  const sum = parseInt(args[i + 1]);
  if (isNaN(kol) || isNaN(sum)) {
    console.error('Error: kol and sum must be numbers');
    process.exit(1);
  }
  orders.push([kol, sum]);
}

addOrders(date, orders);
