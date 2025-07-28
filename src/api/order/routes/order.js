'use strict';

/**
 * order router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// เราจะ "ขยาย" router ที่มีอยู่เดิม
const defaultRouter = createCoreRouter('api::order.order');

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: 'GET',
    path: '/orders/me',
    handler: 'order.me', // <-- เปลี่ยน handler ให้ชี้ไปที่ controller 'order' และ action 'me'
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);