import userModel from "./dao/models/UsuariosModels.js";

class UserManagerdb {
    createUser = async (user) => {
        let newUser = await userModel.create(user);

        return newUser.toJSON();
    }

    getUserById = async (filtro={}) => {
        return await userModel.findOne(filtro).lean();
    }

    upDatePassword = async (email, valueUpDate) => {
        return await userModel.updateOne({email: email}, {$set: valueUpDate});     
    }
}

export default UserManagerdb;