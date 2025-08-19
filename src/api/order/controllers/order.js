'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({


  // --- ★★★ เพิ่มฟังก์ชันใหม่นี้เข้าไปข้างใต้ฟังก์ชัน create ★★★ ---
   async findOneForEmployee(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    console.log(`Employee (User ID: ${user.id}) is requesting Order ID: ${id}`);

    const entry = await strapi.entityService.findOne('api::order.order', id, {
      populate: ['service', 'citizenId'],
    });

    if (!entry) {
      return ctx.notFound('Order not found from custom controller');
    }

    const sanitizedEntry = await this.sanitizeOutput(entry, ctx);
    return this.transformResponse(sanitizedEntry);
  }
}));