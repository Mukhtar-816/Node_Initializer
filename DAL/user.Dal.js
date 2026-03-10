const User = require("../models/user.model.js");

class userDal {
    constructor() {};


    async createUser (data) {
        const user = await User.create({...data});
        return user;
    };

    async findUserById (id) {
        const user = await User.findById(id).select("-passwordHash");

        return user;
    };

    async findUserByKey (key) {
        const user = await User.findOne(key);
        return user;
    };
};

module.exports = new userDal();