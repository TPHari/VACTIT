export const createBroadcastNotification = async (
  prisma: any,
  data: any
) => {
  try {
    console.log('5. [DEBUG] Service nhận data:', data); // Log 5

    // Kiểm tra xem prisma.notification có tồn tại không
    if (!prisma.notification) {
       throw new Error("Prisma Notification model is undefined! Did you run 'npx prisma generate'?");
    }

    const result = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        link: data.link,
        user_id: null,
      },
    });
    console.log('6. [DEBUG] Đã INSERT vào DB thành công:', result); // Log 6
  } catch (error) {
    console.error('❌ [ERROR] Lỗi tạo thông báo:', error); // Log Lỗi
  }
};