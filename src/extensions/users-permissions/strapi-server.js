'use strict';

module.exports = (plugin) => {
  plugin.controllers.auth.register = async (ctx) => {
    const { email, username, password, firstname, lastname, address, phone_number } = ctx.request.body;

    if (!email || !username || !password) {
      return ctx.badRequest('Missing required fields');
    }

    try {
        const user = await strapi.plugins['users-permissions'].services.user.add({
            username, email, password, provider: 'local', confirmed: true, role: 1,
        });

        if (user) {
            await strapi.entityService.update('plugin::users-permissions.user', user.id, {
                data: { firstname, lastname, address, phone_number },
            });
        }

        const sanitizedUser = await strapi.plugins['users-permissions'].services.user.sanitizeUser(user);

        return ctx.send({
            jwt: strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id }),
            user: sanitizedUser,
        });

    } catch (error) {
        if (error.message.includes('Email or Username are already taken')) {
            return ctx.badRequest('Email or Username are already taken.');
        }
        return ctx.badRequest(error.message);
    }
  };

  return plugin;
};