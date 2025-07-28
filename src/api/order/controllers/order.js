'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// เราจะ "ขยาย" controller ที่มีอยู่เดิม
module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  
  // นี่คือฟังก์ชัน "me" ของเราที่ถูกเพิ่มเข้ามาอย่างถูกต้อง
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in.');
    }

    try {
      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: {
          customer: {
            id: user.id,
          },
        },
        populate: { order_items: true, completionProof: true },
        sort: { createdAt: 'desc' },
      });

      return this.transformResponse(orders);
    } catch (err) {
      ctx.body = err;
    }
  },

}));