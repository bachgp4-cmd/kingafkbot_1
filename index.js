const http = require('http');
const mineflayer = require('mineflayer');

// Server Web đơn giản giúp Koyeb/Render giữ bot online 24/7
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
  kingSmpSlot: 26, // Vị trí Slot 26 cụm KingSMP trong Rương Đôi
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

  // 1. Tự động gõ /login và Tương tác Chuột phải
  bot.on('spawn', () => {
    console.log('Bot đã kết nối vào server!');
    
    // Đợi 3 giây rồi gõ /login
    setTimeout(() => {
      bot.chat(`/login ${CONFIG.password}`);
      console.log('Đã gửi lệnh đăng nhập.');
    }, 3000);

    // Đợi 6 giây (sau khi đăng nhập xong), thực hiện Chuột Phải để mở GUI Menu
    setTimeout(() => {
      console.log('Đang thực hiện chuột phải để mở GUI Menu...');
      bot.activateItem(); // Thao tác chuột phải dùng item trên tay mở GUI
    }, 6000);
  });

  // 2. Lắng nghe sự kiện khi Bảng Menu (GUI Window) mở ra -> Tự chọn cụm KingSMP tại Slot 26
  bot.on('windowOpen', async (window) => {
    console.log(`Đã mở bảng Menu: "${window.title}"`);
    
    // Đợi 1.5 giây cho GUI tải xong rồi click vào Slot 26
    setTimeout(() => {
      bot.clickWindow(CONFIG.kingSmpSlot, 0, 0);
      console.log(`Đã click vào Slot ${CONFIG.kingSmpSlot} (KingSMP)!`);
    }, 1500);
  });

  // 3. Tự động nhảy mỗi 30 giây để chống Kick AFK
  bot.on('spawn', () => {
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 30000);
  });

  // 4. TỰ ĐỘNG RECONNECT KHI BỊ VĂNG / RESTART SERVER
  bot.on('end', (reason) => {
    console.log(`Bị ngắt kết nối (${reason}). Đang Reconnect sau 10 giây...`);
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => console.log('Lỗi:', err.message));
}

createBot();
