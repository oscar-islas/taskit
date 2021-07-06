"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("session", {
            sid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                  model: 'users',
                  key: 'id'
                }
            },
            expires: {
                type: Sequelize.DATE,
            },
            data: {
                type: Sequelize.TEXT,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("session");
    },
};
