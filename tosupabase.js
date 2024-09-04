const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Инициализация клиента Supabase
const supabaseUrl = 'https://zvzhxxszcigtjminaihe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2emh4eHN6Y2lndGptaW5haWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NzU5NTksImV4cCI6MjA0MTA1MTk1OX0.Cb4asyM_v2lwX5Ei_z2g2aiEBLu97HOJN0lLYWJMoTQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// Чтение данных из JSON-файла
const data = JSON.parse(fs.readFileSync('./orders.json', 'utf8'));

// Функция для вставки данных в Supabase
const insertOrders = async () => {
  for (const [date, orders] of Object.entries(data)) {
    for (const order of orders) {
      const { kol, sum, stop, adr = "", driver = "Vinzzz", desc = "" } = order;
      const { error } = await supabase
        .from('orders')
        .insert([{ date, kol, sum, stop, adr, driver, desc }]);

      if (error) {
        console.error('Error inserting order:', error);
      } else {
        console.log('Order inserted successfully!');
      }
    }
  }
};

// Вызов функции для вставки данных
insertOrders();