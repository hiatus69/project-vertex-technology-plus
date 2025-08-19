'use strict';

module.exports = {
  routes: [
    {
      // นี่คือเส้นทางพิเศษที่เราสร้างขึ้น
      method: 'GET',
      path: '/orders/employee/:id', // URL จะเป็นแบบนี้
      handler: 'order.findOneForEmployee', // ให้ไปเรียกใช้ฟังก์ชันที่เราเพิ่งสร้าง
    },
    {
      // Route สำหรับ find (หน้า dashboard) ให้ยังทำงานเหมือนเดิม
      method: 'GET',
      path: '/orders',
      handler: 'order.find',
    },
    {
      // Route สำหรับ create (หน้า add-order) ให้ยังทำงานเหมือนเดิม
      method: 'POST',
      path: '/orders',
      handler: 'order.create',
    // เราไม่ได้ใส่ findOne, update, delete ตัวปกติเข้ามา เพื่อป้องกันการสับสน

    },
    {
      method: 'POST',
      path: '/orders',
      handler: 'api::order.order.create', // Route นี้บังคับให้ใช้ Core Controller ดั้งเดิม
    },
    {
      method: 'GET',
      path: '/orders',
      handler: 'api::order.order.find', // Route นี้ก็ให้ใช้ Core Controller ดั้งเดิม
    }
  ]
};