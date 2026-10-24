const http = require('http');
const mineflayer = require('mineflayer');

// Server Web đơn giản giúp Koyeb giữ bot online 24/7
http.createServer((req, res) => {
  res.write("Bot Minecraft đang hoạt động!");
  res.end();
}).listen(process.env.PORT || 8080);

// === THÔNG TIN SERVER & TÀI KHOẢN CỦA BẠN ===
const CONFIG = {
  host: 'kingmc.vn',
  port: 25565,
  username: '_caubemocoi_',
  password: 'phong123@',
  version: false
};

function createBot() {
  console.log('Đang kết nối tới server Minecraft...');
  
  const bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version
  });

  // Tự động gõ /login sau 3 giây khi vừa kết nối
  bot.on('spawn', () => {
    console.log('Bot đã kết nối thành công!');
    setTimeout(() => {
      bot.chat(`/login ${CONFIG.password}`);
    }, 3000);
  });

  // Tự động nhảy mỗi 30 giây để chống Kick AFK
  bot.on('spawn', () => {
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 30000);
  });

  // TỰ ĐỘNG RECONNECT KHI BỊ VĂNG
  bot.on('end', (reason) => {
    console.log(`Bị ngắt kết nối (${reason}). Đang Reconnect sau 10 giây...`);
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => console.log('Lỗi:', err.message));
}

createBot();
