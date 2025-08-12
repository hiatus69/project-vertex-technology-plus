'use strict';

module.exports = (plugin) => {
  // เราจะมาแก้ไข "กฎ" ของ auth controller โดยตรง
  plugin.controllers.auth.register = async (ctx) => {
    const { email, username, password, firstname, lastname, address, phone_number } = ctx.request.body;

    // 1. ตรวจสอบข้อมูลพื้นฐาน
    if (!email || !username || !password) {
      return ctx.badRequest('Missing required fields: email, username, password');
    }

    try {
      // ---- จุดที่แก้ไขสำคัญ ----
      // 2. ค้นหา ID ของ Role "Authenticated" ก่อนเสมอ
      const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'authenticated' } });
      if (!role) {
        throw new Error('Could not find the authenticated role.');
      }
      // --- จบจุดที่แก้ไขสำคัญ ---

      // 3. เรียกใช้ service เพื่อสร้าง user ใหม่ โดยใช้ ID ของ Role ที่หาเจอ
      const user = await strapi.plugins['users-permissions'].services.user.add({
        username,
        email,
        password,
        provider: 'local',
        confirmed: true,
        blocked: false,
        role: role.id, // <-- ใช้ ID ที่ค้นหามา ไม่ใช่เลข 1 อีกต่อไป
      });

      // 4. อัปเดต user ที่เพิ่งสร้างด้วยข้อมูลเพิ่มเติม
      if (user) {
        await strapi.entityService.update('plugin::users-permissions.user', user.id, {
          data: {
            firstname,
            lastname,
            address,
            phone_number,
          },
        });
      }

      // 5. ส่งข้อมูล user ที่สมบูรณ์กลับไป
      const sanitizedUser = await strapi.plugins['users-permissions'].services.user.sanitizeUser(user);

      return ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id }),
        user: sanitizedUser,
      });
      
    } catch (error) {
      // จัดการกับ Error ที่อาจเกิดขึ้น
      if (error.message.includes('Email or Username are already taken')) {
        return ctx.badRequest('Email or Username are already taken.');
      }
      return ctx.badRequest(error.message);
    }
  };

  return plugin;
};