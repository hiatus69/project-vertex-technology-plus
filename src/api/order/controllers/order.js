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
      // ขั้นตอนที่ 1: สร้าง Order Item (Snapshot) ก่อน
      const newOrderItem = await strapi.entityService.create('api::order-item.order-item', {
        data: {
          packageName: orderItemData.packageName,
          price: orderItemData.price,
          features: orderItemData.features,
          employeeNotes: contactInfo.customerNotes,
          publishedAt: new Date(),
        }
      });

      // ขั้นตอนที่ 2: สร้าง Order หลัก โดยใส่แค่ข้อมูลธรรมดาก่อน
      const newOrder = await strapi.entityService.create('api::order.order', {
        data: {
          Status_order: 'Waiting_in_queue',
          customerNotes: contactInfo.customerNotes,
          contactName: contactInfo.contactName,
          installationAddress: contactInfo.installationAddress,
          contactPhone: contactInfo.contactPhone,
          publishedAt: new Date(),
        }
      });
      
      // ขั้นตอนที่ 3: "อัปเดต" Order ที่เพิ่งสร้าง เพื่อ "เชื่อม" ความสัมพันธ์
      const updatedOrder = await strapi.entityService.update('api::order.order', newOrder.id, {
        data: {
          customer: user.id,              // เชื่อมกับลูกค้าที่ล็อกอินอยู่
          order_items: [newOrderItem.id], // เชื่อมกับ Order Item ที่เพิ่งสร้าง
        },
        populate: { order_items: true, customer: true } // สั่งให้ดึงข้อมูลที่เชื่อมแล้วกลับมาด้วย
      });

      return this.transformResponse(updatedOrder);

    } catch (err) {
      // ถ้าเกิดข้อผิดพลาด ให้ส่ง Error กลับไป
      console.error("Error in custom order create controller:", err);
      return ctx.badRequest('An error occurred while creating the order.', { details: err.message });
    }
  },

  // --- 2. ฟังก์ชัน "me" สำหรับดูออเดอร์ของตัวเอง (ของเดิม) ---
  async me(ctx) {
    // ... โค้ดส่วนนี้เหมือนเดิม ...
  },
}));
