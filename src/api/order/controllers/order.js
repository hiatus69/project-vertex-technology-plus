// File: src/api/order/controllers/order.js
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  // ฟังก์ชัน create ที่เราทำไว้
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) { return ctx.unauthorized('You must be logged in.'); }
    const { orderItemData, contactInfo } = ctx.request.body.data;
    try {
      const newOrder = await strapi.entityService.create('api::order.order', {
        data: {
          Status_order: 'Waiting in queue',
          customerNotes: contactInfo.customerNotes,
          contactName: contactInfo.contactName,
          installationAddress: contactInfo.installationAddress,
          contactPhone: contactInfo.contactPhone,
          publishedAt: new Date(),
          customer: user.id,
        }
      });
      await strapi.entityService.create('api::order-item.order-item', {
        data: {
          packageName: orderItemData.packageName,
          price: orderItemData.price,
          features: orderItemData.features,
          employeeNotes: contactInfo.customerNotes,
          publishedAt: new Date(),
          order: newOrder.id,
        }
      });
      const finalOrder = await strapi.entityService.findOne('api::order.order', newOrder.id, {
          populate: { order_item: true, customer: true }
      });
      return this.transformResponse(finalOrder);
    } catch (err) {
      console.error("--- FATAL ERROR in create controller ---", err);
      return ctx.badRequest('An error occurred while creating the order.', { details: err.message });
    }
  },

  // ฟังก์ชัน me ที่เราต้องการ
  async me(ctx) {
    const user = ctx.state.user;
    if (!user) { return ctx.unauthorized('You must be logged in.'); }
    
    const orders = await strapi.entityService.findMany('api::order.order', {
        filters: { customer: { id: user.id } },
        sort: { createdAt: 'desc' },
        populate: { order_item: true }
    });
    return this.transformResponse(orders);
  },
}));