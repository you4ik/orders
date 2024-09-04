import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zvzhxxszcigtjminaihe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2emh4eHN6Y2lndGptaW5haWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NzU5NTksImV4cCI6MjA0MTA1MTk1OX0.Cb4asyM_v2lwX5Ei_z2g2aiEBLu97HOJN0lLYWJMoTQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchOrdersByDate() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('date, kol, sum, stop')
      .gte('date', '2024-08-22')
      .lte('date', '2024-09-5')
      .order('date', { ascending: true });

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

    for (const date in groupedOrders) {
      console.log(`
        ** ${date} **`);
    //console.log(`kol @ ${groupedOrders[date].kol}, sum @ ${groupedOrders[date].sum}  --${groupedOrders[date].desc}`);
      groupedOrders[date].orders.forEach(order => {
        order.desc  = order.desc || '';
        console.log(`${order.kol} @ ${order.sum} ${order.desc}`);
      });
    }

    console.log(`\n***** 22.08 - 05.09 *****
BANK TILL 22.08: 50100
TOTALL MIN: ${totalKol}
TOTAL SUM: ${totalSum},
TOTAL SUM STOP: ${totalStop},
**** BALANCE ****
MINITS: 252
SEK: -12300
USDT: 1100(12300)
EUR: 0`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchOrdersByDate();