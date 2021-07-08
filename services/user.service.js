const {Users, Category, Task} = require('../models');

const getUsers = async() => {
    try{
        let users = await Users.findAll({include: [{model: Category}, {model: Task}]});
        return users;
    }catch(error){
        throw new Error(error);
    }
}

module.exports = {
    getUsers
}