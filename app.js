const fs = require('fs');

// Чтение файла orders.json
const getOrders = JSON.parse(fs.readFileSync('orders.json', 'utf-8'));

// Определение интересующего диапазона дат
const startDate = '11.07';
const endDate = '18.07';

// Функция для фильтрации заказов по диапазону дат
function filterOrdersByDateRange(orders, startDate, endDate) {
    let filteredOrders = {};
    for (let date in orders) {
        if (date >= startDate && date <= endDate) {
            filteredOrders[date] = orders[date];
        }
    }
    return filteredOrders;
}

// Получение отфильтрованных заказов
const orders = filterOrdersByDateRange(getOrders, startDate, endDate);

// Форматирование заказов для вывода
function formatOrders(orders) {
    let formatted = "";
    for (const date in orders) {
        if (Array.isArray(orders[date])) {
            formatted += `**${date} orders:**\n`;
            orders[date].forEach(order => {
                formatted += `- ${order.kol} @ ${order.sum}, STOP: ${order.stop}, ${order.desc || ''}\n`;
            });
            formatted += "\n"; // Добавляем пустую строку между датами
        } else {
            console.error(`Orders for ${date} is not an array:`, orders[date]);
        }
    }
    return formatted.trim();
}


// Вычисление общего количества позиций (AMOUNT)
function totalItems(orders) {
    let total = 0;
    for (const date in orders) {
        orders[date].forEach(order => {
            total += order.kol;
        });
    }
    return total;
}

// Вычисление общей суммы (SUMMA) всех транзакций
function totalSum(orders) {
    let total = 0;
    for (const date in orders) {
        orders[date].forEach(order => {
            total += order.sum;
        });
    }
    return total;
}

// Вычисление общей суммы стопов (STOP)
function totalStop(orders) {
    let total = 0;
    for (const date in orders) {
        orders[date].forEach(order => {
            total += order.stop;
        });
    }
    return total;
}

// Собираем сообщение
const message = `
APPLE (49.5 Gram)
${formatOrders(orders)}


**TOTAL:**
- AMOUNT: ${totalItems(orders)+2}
- SUMMA: ${totalSum(orders)},
- STOP: ${totalStop(orders)},
- KASSA BALANCE: **${totalSum(orders) - totalStop(orders)+500}SEK + 350 EUR + 80 USDT**
`;

// Выводим сообщение
console.log(message);
// Записываем сообщение в файл message.txt
fs.writeFileSync('message.txt', message);