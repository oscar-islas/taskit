const { Users, SocialNetwork } = require("../models");

const newUser = async ({ firstname, lastname, email, password }) => {
    try {
        let user = await Users.create({ firstname, lastname, email, password });
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

const checkUserExist = async (email) => {
    try {
        let user = await Users.findOne({ where: { email }, raw: true });
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

const linkUserProvider = async (providerId, userId, provider) => {
    try {
        let results = await SocialNetwork.findOrCreate({
            where: { id: providerId },
            defaults: { id: providerId, user_id: userId, provider },
        });
        return results;
    } catch (error) {
        throw new Error(error);
    }
};

const randPasswd = () => {
    return "12345";
};

module.exports = {
    newUser,
    randPasswd,
    checkUserExist,
    linkUserProvider,
};
