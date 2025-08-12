// File: src/api/order/routes/order.js
'use strict';

module.exports = {
  routes: [
    {
  method: 'GET',
  path: '/orders/me',
  handler: 'order.me',
  config: {
    policies: [], // <--- เช็กให้แน่ใจว่าเป็น array ว่างๆ แบบนี้
  },
},
    // เราต้องนิยาม Route พื้นฐานใหม่ด้วย เพราะเรากำลังจะใช้ไฟล์นี้แทนที่ไฟล์อัตโนมัติ
    {
      method: 'GET',
      path: '/orders',
      handler: 'order.find',
    },
    {
      method: 'GET',
      path: '/orders/:id',
      handler: 'order.findOne',
    },
    {
      method: 'POST',
      path: '/orders',
      handler: 'order.create', // บอกให้วิ่งไปที่ฟังก์ชัน create ที่เราเขียนเอง
    },
    {
      method: 'PUT',
      path: '/orders/:id',
      handler: 'order.update',
    },
    {
      method: 'DELETE',
      path: '/orders/:id',
      handler: 'order.delete',
    },
  ],
};