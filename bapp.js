const fs = require('fs');

// Чтение файла orders.json
const getOrders = JSON.parse(fs.readFileSync('borders.json', 'utf-8'));

// Определение интересующего диапазона дат
const startDate = '11.07';
const endDate = '17.07';

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

// Вычисление общей суммы для заданного fak и имени
function totalSumForFakAndName(orders, fak, name) {
    let total = 0;
    for (const date in orders) {
        orders[date].forEach(order => {
            if (order.fak === fak && order.name === name) {
                total += order.sum;
            }
        });
    }
    return total;
}

// Форматирование заказов для вывода
function formatOrders(orders) {
    let formatted = "";
    for (const date in orders) {
        if (Array.isArray(orders[date])) {
            formatted += `**${date} orders:**\n`;
            orders[date].forEach(order => {
                formatted += `- ${order.name}: ${order.kol} @ ${order.sum}, FAK: ${order.fak}, DOLG:\n`;
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
            total += order.stop || 0;
        });
    }
    return total;
}

// Сбор уникальных имен и вычисление их суммы при fak=1
function uniqueNamesTotalSum(orders) {
    let nameTotals = {};
    for (const date in orders) {
        orders[date].forEach(order => {
            if (order.fak === 1) {
                if (!nameTotals[order.name]) {
                    nameTotals[order.name] = 0;
                }
                nameTotals[order.name] += order.sum;
            }
        });
    }
    return nameTotals;
}

// Вычисление общего KOL для заданного fak и имени
function totalKolForFakAndName(orders, fak, name) {
    let total = 0;
    for (const date in orders) {
        orders[date].forEach(order => {
            if (order.fak === fak && order.name === name) {
                total += order.kol;
            }
        });
    }
    return total;
}

// Сбор уникальных имен и вычисление их общего KOL
function uniqueNamesTotalKol(orders) {
    let nameTotals = {};
    for (const date in orders) {
        orders[date].forEach(order => {
            if (!nameTotals[order.name]) {
                nameTotals[order.name] = 0;
            }
            nameTotals[order.name] += order.kol;
        });
    }
    return nameTotals;
}

// Форматирование сумм для каждого имени
function formatNameTotals(nameTotals) {
    let formatted = "";
    for (const name in nameTotals) {
        formatted += `- ${name}: ${nameTotals[name]}\n`;
    }
    return formatted.trim();
}

const nameTotals = uniqueNamesTotalSum(orders);
const nameKols = uniqueNamesTotalKol(orders);

// Собираем сообщение
const message = `
APPLE (48.2 Gram)
${formatOrders(orders)}


**TOTAL:**
- AMOUNT: ${totalItems(orders)}
- SUMMA: ${totalSum(orders)},
- STOP: ${totalStop(orders)},


**SUMS FOR FAK=1:**
${formatNameTotals(nameTotals)}


**TOTAL KOL BY NAME:**
${formatNameTotals(nameKols)}
`;

// Выводим сообщение
console.log(message);
// Записываем сообщение в файл message.txt
fs.writeFileSync('borders.txt', message);
