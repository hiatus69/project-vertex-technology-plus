// File: src/api/order/routes/order.js
'use strict';

/**
 * order router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// เราจะใช้ Core Router ตามปกติ และให้มันไปเรียกใช้ custom controller ของเราเอง
module.exports = createCoreRouter('api::order.order');