'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({

  // --- 1. เขียนทับฟังก์ชัน "create" (สร้างออเดอร์) ทั้งหมด ---
  async create(ctx) {
    const user = ctx.state.user; // ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่

    if (!user) {
      return ctx.unauthorized('You must be logged in.');
    }

    // ดึงข้อมูลดิบที่หน้าบ้านส่งมา
    const { orderItemData, contactInfo } = ctx.request.body.data;

    try {
      // 1. สร้าง Order Item (Snapshot) ก่อน
      const newOrderItem = await strapi.entityService.create('api::order-item.order-item', {
        data: {
          packageName: orderItemData.packageName,
          price: orderItemData.price,
          features: orderItemData.features,
          publishedAt: new Date(), // ตั้งค่าให้ publish ทันที
        }
      });

      // 2. สร้าง Order หลัก และ "เชื่อมต่อ" ความสัมพันธ์ทั้งหมดที่หลังบ้าน
      const newOrder = await strapi.entityService.create('api::order.order', {
        data: {
          Status_order: 'Waiting_in_queue',
          customerNotes: contactInfo.customerNotes,
          contactName: contactInfo.contactName,
          installationAddress: contactInfo.installationAddress,
          contactPhone: contactInfo.contactPhone,
          customer: user.id, // เชื่อมกับลูกค้าที่ล็อกอินอยู่
          order_items: [newOrderItem.id], // เชื่อมกับ Order Item ที่เพิ่งสร้าง
          publishedAt: new Date(),
        }
      });

      return this.transformResponse(newOrder);

    } catch (err) {
      ctx.body = err;
    }
  },

  // --- 2. ฟังก์ชัน "me" สำหรับดูออเดอร์ของตัวเอง (ของเดิม) ---
  async me(ctx) {
    // ... โค้ดส่วนนี้เหมือนเดิม ...
  },
}));