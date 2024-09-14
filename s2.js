const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://zvzhxxszcigtjminaihe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2emh4eHN6Y2lndGptaW5haWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NzU5NTksImV4cCI6MjA0MTA1MTk1OX0.Cb4asyM_v2lwX5Ei_z2g2aiEBLu97HOJN0lLYWJMoTQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchOrdersByDate() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('date, kol, sum, stop, desc')
      .gte('date', '2024-08-22')
      .lte('date', '2024-09-06')
      .order('date', { ascending: true});

    if (error) {
      throw new Error(`Error executing query: ${error.message}`);
    }

    let totalKol = 0;
    let totalSum = 0;
    let totalStop = 0;

    const groupedOrders = {};

    data.forEach(order => {
      const date = new Date(order.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
      if (!groupedOrders[date]) {
        groupedOrders[date] = { kol: 0, sum: 0, orders: [] };
      }
      groupedOrders[date].kol += order.kol || 0;
      groupedOrders[date].sum += order.sum || 0;
      groupedOrders[date].orders.push(order);
    
      totalKol += order.kol || 0;
      totalSum += order.sum || 0;
      totalStop += order.stop || 0;
    });
    
    let output = `
    MIN : 163+99 = 262
    SELL: ${totalKol+15}
    MIN LEFT: ${163+99 - totalKol-15 }(262 - ${totalKol+15})
   TOTAL SUM: 22800
  \n`;

    const sortedDates = Object.keys(groupedOrders).sort((a, b) => new Date(b) - new Date(a));

    sortedDates.forEach(date => {
     output += `\n*** ${date} ***\n`;
      groupedOrders[date].orders.forEach(order => {
        order.desc = order.desc || '';
       output += `${order.kol} @ ${order.sum} ${order.desc}\n`;
      });
    });

    return output;

  } catch (error) {
    console.error('Error:', error.message);
    return '';
  }
}

async function main() {
  const result = await fetchOrdersByDate();
  console.log(result); // Вывод результата в терминал
  fs.writeFileSync('messagenew.txt', result); // Запись результата в файл
}

main();