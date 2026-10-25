const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'kingmc.vn', // Địa chỉ IP server Minecraft
    username: '_caubemocoi_', // Tên nhân vật Minecraft
    version: false // Tự động dò phiên bản server
  });

  bot.on('spawn', () => {
    console.log('Bot đã kết nối vào server! Chờ 5 giây để ổn định...');
    
    // Trễ 5 giây sau khi spawn mới gửi lệnh /login
    setTimeout(() => {
      console.log('Đã gửi lệnh đăng nhập.');
      bot.chat('/login phong123@');

      // Trễ tiếp 8 giây rồi mới thực hiện chuột phải dùng item mở GUI
      setTimeout(() => {
        console.log('Đang thực hiện chuột phải để mở GUI Menu...');
        bot.activateItem();
      }, 8000);

    }, 5000);
  });

  // Xử lý khi GUI Chest được mở thành công
  bot.on('windowOpen', async (window) => {
    console.log('Đã mở GUI Menu thành công!');
    setTimeout(async () => {
      try {
        await bot.clickWindow(26, 0, 0);
        console.log('Đã click Slot 26 để chuyển sang cụm KingSMP!');
      } catch (err) {
        console.log('Lỗi khi click slot:', err);
      }
    }, 2000);
  });

  // Tự động nhảy chống AFK ngẫu nhiên mỗi 40 giây
  setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 500);
    }
  }, 40000);

  // Tự động kết nối lại (Reconnect) nếu bị ngắt kết nối
  bot.on('end', () => {
    console.log('Bị ngắt kết nối. Đang ngắt và Reconnect sau 10 giây...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('Lỗi bot:', err.message);
  });
}

// Khởi chạy bot
createBot();
