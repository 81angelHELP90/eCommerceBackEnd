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

    upDateRol = async (email, valueUpDate) => {
        return await userModel.updateOne({email: email}, {$set: valueUpDate});     
    }
    
    upDateUserInfo = async (email, _id, valueUpDate) => {
        if(email)    
            return await userModel.updateOne({ email: email }, {$set: valueUpDate});  
        else  
            return await userModel.updateOne({ _id: _id }, { $push: { documents: valueUpDate } });

    }
}

export default UserManagerdb;