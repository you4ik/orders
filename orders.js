const fs = require("fs");

let orders = {};

function initOrders() {
  orders = JSON.parse(fs.readFileSync("orders.json", "utf-8"));
}

function getFilteredOrders(startDate, endDate) {
  return Object.fromEntries(
    Object.entries(orders).filter(([date]) => date >= startDate && date <= endDate)
  );
}

function formatOrders(orders) {
  return Object.entries(orders)
    .map(([date, orderList]) => {
      const formattedOrders = orderList.map(order => `- ${order.kol} @ ${order.sum}, STOP: ${order.stop}, ${order.desc || ""}`).join("\n");
      return `**${date} orders:**\n${formattedOrders}`;
    })
    .join("\n\n")
    .trim();
}

function totalItems(orders) {
  return Object.values(orders).flat().reduce((total, order) => total + order.kol, 0);
}

function totalSum(orders) {
  return Object.values(orders).flat().reduce((total, order) => total + order.sum, 0);
}

function totalStop(orders) {
  return Object.values(orders).flat().reduce((total, order) => total + order.stop, 0);
}

function addOrder(date, ordersInput) {
  const newOrders = parseOrdersInput(ordersInput);
  if (!orders[date]) {
    orders[date] = [];
  }
  orders[date].push(...newOrders);
  fs.writeFileSync("orders.json", JSON.stringify(orders, null, 4));
  return `Orders added successfully for ${date}: ${JSON.stringify(newOrders)}`;
}

function parseOrdersInput(input) {
  return input.split(",").map(orderStr => {
    const [kol, sum] = orderStr.split(" ").map(Number);
    return { kol, sum, stop: 300, desc: "" };
  });
}

function getOrdersSummary(filteredOrders) {
  const formattedOrders = formatOrders(filteredOrders);
  const total = totalItems(filteredOrders);
  const sum = totalSum(filteredOrders);
  const stop = totalStop(filteredOrders);
  const balance = sum - stop + 500;

  return `
APPLE (49.5 Gram)
${formattedOrders}

**TOTAL:**
- AMOUNT: ${total}
- SUMMA: ${sum}
- STOP: ${stop}
- KASSA BALANCE: **${balance} SEK + 350 EUR + 80 USDT**
  `.trim();
}

module.exports = {
  initOrders,
  addOrder,
  getFilteredOrders,
  getOrdersSummary
};
