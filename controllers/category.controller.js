const {
    categoryById,
    categoriesByUser,
    deleteCategory,
    createCategory,
    updateCategory
} = require("../services/category.service");

const render = async (req, res, next) => {
    let { id, firstname, lastname } = req.user;

    try {
        let username = `${firstname} ${lastname}`;
        //Obtenemos las categorías del usuario
        let categories = await categoriesByUser(id);
        return res.render("pages/categories", {
            title: "Categorias",
            username,
            categories,
        });
    } catch (error) {
        next(error);
    }
};

const _delete = async (req, res, next) => {
    try {
        //Obtenemos el parametro id
        let categoryId = req.params.id;
        await deleteCategory(categoryId);
        res.redirect("/categorias");
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        //Obtenemos el parametro id
        let { id:userId } = req.user;
        let { name } = req.body;
        await createCategory({name, userId});
        res.redirect("/categorias");
    } catch (error) {
        next(error);
    }
}

const renderEdit = async (req, res, next) => {
    let { firstname, lastname } = req.user;
    let { id:categoryId } = req.params;

    try {
        let username = `${firstname} ${lastname}`;
        let category = await categoryById(categoryId);
        return res.render("pages/edit-category", {
            title: "Editar categorias",
            username,
            id: categoryId,
            name: category.name
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        //Obtenemos el parametro id
        let { id:categoryId } = req.params;
        let { name } = req.body;
        await updateCategory({name, categoryId});
        res.redirect("/categorias");
    } catch (error) {
        next(error);
    }
}

module.exports = {
    render,
    create,
    update,
    renderEdit,
    _delete,
};
