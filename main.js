const bot = require('./bot');
const { initOrders } = require('./orders');

// Инициализация заказов
initOrders();

// Запуск бота
console.log("Bot is running...");
