const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const app = express();

// Your JSONBin.io credentials
const BIN_ID = '66978ffdacd3cb34a867556e';  // Replace with your bin ID
const SECRET_KEY = '$2a$10$XHj0.DGTDEqhbEY4RFKZau7LXkRq5jM15dAsXJnK4eU3P9hkaXpGi';  // Replace with your secret key

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

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
  } catch (error) {
    console.error('Error updating data in JSONBin:', error);
  }
};

// Home route to display the form and list
app.get('/', async (req, res) => {
  const orderData = await getOrders();
  res.render('index', { orderData });
});

// Route to handle form submission
app.post('/add', async (req, res) => {
  const { date, kol, sum } = req.body;
  const orderData = await getOrders();

  if (!orderData[date]) {
    orderData[date] = [];
  }

  orderData[date].push({ kol: parseInt(kol), sum: parseInt(sum), stop: 300, desc: "" });

  await updateOrders(orderData);
  res.redirect('/');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});