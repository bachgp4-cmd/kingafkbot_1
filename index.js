const mineflayer = require('mineflayer');
const http = require('http');

// 1. Tạo HTTP Web Server nhẹ để Render nhận dạng Port (giữ dịch vụ sống 24/7)
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot AFK KingMC status: ONLINE');
}).listen(PORT, () => {
  console.log(`Web Server đang chạy trên port ${PORT}`);
});

// 2. Cấu hình Bot AFK
function createBot() {
  const bot = mineflayer.createBot({
    host: 'kingmc.vn',
    username: '_caubemocoi_',
    version: false // Tự động nhận diện phiên bản Minecraft của server
  });

  // Khi bot vào server thành công
  bot.on('spawn', () => {
    console.log('Bot đã vào server! Chờ 5 giây để ổn định...');
    
    // Đợi 5 giây sau khi spawn mới gõ lệnh đăng nhập
    setTimeout(() => {
      console.log('Đã gửi lệnh đăng nhập.');
      bot.chat('/login phong123@');

      // Đợi tiếp 6 giây rồi mới gửi lệnh /menu
      setTimeout(() => {
        console.log('Đang gửi lệnh /menu để mở giao diện...');
        bot.chat('/menu');
      }, 6000);

    }, 5000);
  });

  // Khi giao diện GUI Menu hiện lên, tự động click vào Slot 24
  bot.on('windowOpen', async (window) => {
    console.log('Đã mở Menu thành công! Đang chờ 2 giây để click Slot 24...');
    setTimeout(async () => {
      try {
        await bot.clickWindow(24, 0, 0);
        console.log('Đã click thành công vào Slot 24 (KingSMP)!');
      } catch (err) {
        console.log('Lỗi khi click slot:', err.message);
      }
    }, 2000);
  });

  // Tự động nhảy ngẫu nhiên mỗi 40 giây để chống bị kick AFK
  setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 500);
    }
  }, 40000);

  // Tự động Reconnect (kết nối lại) sau 10 giây nếu bị out/ngắt kết nối
  bot.on('end', () => {
    console.log('Bị ngắt kết nối khỏi server. Đang thử Reconnect lại sau 10 giây...');
    setTimeout(createBot, 10000);
  });

  // Xử lý báo lỗi
  bot.on('error', (err) => {
    console.log('Lỗi bot:', err.message);
  });
}

// Khởi chạy bot
createBot();
