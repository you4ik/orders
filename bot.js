const TelegramBot = require("node-telegram-bot-api");
const { exec } = require("child_process");
const { addOrder, getFilteredOrders, getOrdersSummary } = require("./orders");

// Flag to prevent multiple restarts
let isRestarting = false;

// Telegram Bot Token
const token = "7446815124:AAH3UirI0n-kFJtaHI4_gndjyB9IkGnODoI";
console.log(`Using bot token: ${token}`);

// Initialize Telegram Bot
const bot = new TelegramBot(token, { polling: true });

// Handle polling errors
bot.on("polling_error", (error) => {
  console.error(`Polling error: ${error.code} - ${error.message}`);
});

// Function to restart the script using pm2
function restartScript() {
  // Use exec to restart the script using pm2
  exec("pm2 restart bot", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error restarting script: ${error.message}`);
    } else {
      console.log("Script restarted successfully!");
      // Exit the current process after the new script starts
      process.exit(0); 
    }
  });
}

// Handle incoming messages
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.trim();
  const [command, ...args] = text.split(" ");

  // Add order command
  if (command.toLowerCase() === "/add" && args.length >= 3) {
    const date = args[0];
    const ordersInput = args.slice(1).join(" ");
    try {
      const response = addOrder(date, ordersInput);
      bot.sendMessage(chatId, response);
    } catch (error) {
      bot.sendMessage(chatId, `Error: ${error.message}`);
    }
  // List orders command
  } else if (command.toLowerCase() === "/list") {
    const startDate = args[0] || "11.07";
    const endDate = args[1] || "28.07";
    const filteredOrders = getFilteredOrders(startDate, endDate);
    const summary = getOrdersSummary(filteredOrders);
    bot.sendMessage(chatId, summary);
  // Restart bot command
  } else if (command.toLowerCase() === "/restart") {
    if (!isRestarting) {
      isRestarting = true;
      bot.sendMessage(chatId, "Restarting bot...");
      restartScript(); // Call the restart function
    } else {
      bot.sendMessage(chatId, "Bot is already restarting.");
    }
  // Default help message
  } else {
    bot.sendMessage(chatId, 'Usage:\n- To add orders: /add <date> <kol> <sum>, <kol> <sum>, ...\nExample: /add 06.07 1 1000, 3 1000\n- To list orders: /list <start_date> <end_date> (defaults to 11.07 28.07)\n- To restart bot: /restart');
  }
});

// Export the start function
module.exports = {
  start: () => bot.startPolling()
};
