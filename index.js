bot.on('spawn', () => {
  console.log('Bot đã vào server, chờ 5 giây để ổn định...');
  
  // Chờ 5 giây sau khi spawn mới gửi lệnh đăng nhập
  setTimeout(() => {
    console.log('Đã gửi lệnh đăng nhập.');
    bot.chat('/login phong123@');

    // Chờ tiếp 8 giây sau khi login rồi mới dùng vật phẩm mở GUI Menu
    setTimeout(() => {
      console.log('Đang thực hiện chuột phải để mở GUI Menu...');
      bot.activateItem();
    }, 8000);

  }, 5000);
});

// Xử lý khi mở GUI Chest thành công
bot.on('windowOpen', async (window) => {
  console.log('Đã mở GUI Menu thành công!');
  setTimeout(async () => {
    try {
      await bot.clickWindow(26, 0, 0);
      console.log('Đã click Slot 26 để vào cụm KingSMP!');
    } catch (err) {
      console.log('Lỗi khi click slot:', err);
    }
  }, 2000);
});
