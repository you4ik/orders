const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const path = './orders.json';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/orders', (req, res) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            res.status(500).send('Error reading orders.json');
            return;
        }
        res.send(data);
    });
});

app.post('/orders', (req, res) => {
    const { date, kol, sum, stop = 300, desc = "" } = req.body;

    fs.readFile(path, (err, data) => {
        if (err) {
            res.status(500).send('Error reading orders.json');
            return;
        }

        let orderData;
        try {
            orderData = JSON.parse(data);
        } catch (parseErr) {
            res.status(500).send('Error parsing orders.json');
            return;
        }

        if (!orderData[date]) {
            orderData[date] = [];
        }

        orderData[date].push({ kol, sum, stop, desc });

        fs.writeFile(path, JSON.stringify(orderData, null, 2), (writeErr) => {
            if (writeErr) {
                res.status(500).send('Error writing to orders.json');
                return;
            }
            res.send('Order added successfully!');
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
