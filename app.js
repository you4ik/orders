const fs = require('fs');

// Чтение файла orders.json
const getOrders = JSON.parse(fs.readFileSync('orders.json', 'utf-8'));

// Определение интересующего диапазона дат
const startDate = '22.08';
const endDate = '06.09';
const ordersall = filterOrdersByDateRange(getOrders, '22.08', '06.09');

// Преобразование даты из формата "день.месяц" в "месяц.день" для корректного сравнения
function convertDate(date) {
    const [day, month] = date.split('.');
    return `${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
}

// Функция для фильтрации заказов по диапазону дат
function filterOrdersByDateRange(orders, startDate, endDate) {
    let filteredOrders = {};
    console.log(`Filtering orders from ${startDate} to ${endDate}`);
    const convertedStartDate = convertDate(startDate);
    const convertedEndDate = convertDate(endDate);
    for (let date in orders) {
        const convertedDate = convertDate(date);
        if (convertedDate >= convertedStartDate && convertedDate <= convertedEndDate) {
            filteredOrders[date] = orders[date];
        }
    }

    // Сортировка дат в порядке убывания
    const sortedDates = Object.keys(filteredOrders).sort((a, b) => {
        return convertDate(b).localeCompare(convertDate(a));
    });

    // Создание нового объекта с отсортированными датами
    let sortedFilteredOrders = {};
    sortedDates.forEach(date => {
        sortedFilteredOrders[date] = filteredOrders[date];
    });

    return sortedFilteredOrders;
}

// Получение отфильтрованных заказов
const orders = filterOrdersByDateRange(getOrders, startDate, endDate);

// Форматирование заказов для вывода
function formatOrders(orders) {
    let formatted = "";
    for (const date in orders) {
        if (Array.isArray(orders[date])) {
            formatted += `*** ${date} ***\n`;
            orders[date].forEach(order => {
                formatted += `- ${order.kol} @ ${order.sum} ${order.desc || ''}\n`;
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

${formatOrders(orders)}


***** ${startDate} - ${endDate}  *****
 - AMOUNT: ${totalItems(orders)+8}           
 - SUMMA: ${totalSum(orders)},       
 - STOP: ${totalStop(orders)},         
*****************

**** BALANCE ****
 - MINITS: ${155 + 90 - totalItems(ordersall)} (163+99=362)
 - SEK: ${totalSum(ordersall) - totalStop(ordersall) - 12300}      
 - USDT: 1100(12300)
 - EUR: 0              
*****************
`;

// Выводим сообщение
console.log(message);
// Записываем сообщение в файл message.txt
fs.writeFileSync('messagenew.txt', message);
