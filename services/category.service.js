const { Category } = require("../models");

const categoriesByUser = async (userId) => {
    try {
        let categories = await Category.findAll({
            where: { created_by: userId },
            raw: true,
        });
        return categories;
    } catch (error) {
        throw new Error(error);
    }
};

const categoryById = async (categoryId) => {
    try {
        let category = await Category.findByPk(categoryId);
        return category;
    } catch (error) {
        throw new Error(error);
    }
};

const createCategory = async ({ name, userId }) => {
    try {
        let category = await Category.create({ name, created_by: userId });
        return category;
    } catch (error) {
        throw new Error(error);
    }
};

const updateCategory = async ({ name, categoryId }) => {
    try {
        let category = await Category.update(
            { name },
            { where: { id: categoryId } }
        );
        return category;
    } catch (error) {
        throw new Error(error);
    }
};

const deleteCategory = async (categoryId) => {
    try {
        let results = await Category.destroy({
            where: { id: categoryId },
        });
        return results;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    categoryById,
    categoriesByUser,
    createCategory,
    updateCategory,
    deleteCategory,
};
