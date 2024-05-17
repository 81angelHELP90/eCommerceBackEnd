import userModel from "./dao/models/UsuariosModels.js";

class UserManagerdb {
    createUser = async (user) => {
        let newUser = await userModel.create(user);

        return newUser.toJSON();
    }

    getUserById = async (filtro={}) => {
        return await userModel.findOne(filtro).lean();
    }
}

export default UserManagerdb;