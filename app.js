const fs = require('fs');

// Чтение файла orders.json
const getOrders = JSON.parse(fs.readFileSync('orders.json', 'utf-8'));

// Определение интересующего диапазона дат
const startDate = '06.08';
const endDate = '10.08';

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
        //console.log(`Checking date: ${convertedDate}`);
        if (convertedDate >= convertedStartDate && convertedDate <= convertedEndDate) {
            filteredOrders[date] = orders[date];
           // console.log(`Date ${date} is within range.`);
        } else {
          //  console.log(`Date ${date} is out of range.`);
        }
    }
  // console.log(`Filtered orders: ${JSON.stringify(filteredOrders)}`);
    return filteredOrders;
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


***** TOTAL  *****
 - AMOUNT: ${totalItems(orders)}           
 - SUMMA: ${totalSum(orders)},       
 - STOP: ${totalStop(orders)},         
*****************

**** BALANCE ****
 - SEK: ${totalSum(orders) - totalStop(orders) + 300}          
 - USDT: 80            
 - EUR: 0              
*****************
`;

// Выводим сообщение
console.log(message);
// Записываем сообщение в файл message.txt
fs.writeFileSync('messagenew.txt', message);
