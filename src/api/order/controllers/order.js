'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    // 1. ดึงข้อมูลดิบที่ถูกส่งมาแบบ FormData
    const { data, files } = ctx.request.body;

    // 2. ตรวจสอบและแปลงข้อมูล JSON string
    let parsedData;
    try {
      // ถ้าไม่มี data ส่งมา ให้ใช้ object ว่างๆ แทน
      parsedData = data ? JSON.parse(data) : {};
    } catch (e) {
      return ctx.badRequest('Invalid JSON data format.');
    }

    // 3. กำหนดค่าเริ่มต้นที่สำคัญที่ฝั่ง Backend เท่านั้น
    parsedData.publishedAt = new Date(); // สั่งให้ "เผยแพร่" ทันที

    // 4. ประกอบร่างข้อมูลกลับเข้าไปใน context
    ctx.request.body = { data: parsedData, files };

    // 5. เรียกใช้ฟังก์ชัน create ดั้งเดิมของ Strapi เพื่อบันทึกทุกอย่าง
    const response = await super.create(ctx);
    return response;
  },
}));