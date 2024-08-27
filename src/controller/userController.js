
import { CustomError } from "../handleErrors/customError.js";
import { TIPOS_ERROR } from "../handleErrors/EErrors.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { sendMail, generaHash } from "../utils.js"
import UserManagerdb from "../usuarioManagerDBHelper.js";
import { UsuariosDTO as userDTO } from "../dto/usuariosDTO.js";
import { helper } from "../helpers/helpers.js";

const userManager = new UserManagerdb();

export const recoveryPass = async (req, res) => {
    let email = req.body.mail;

    try {
        if(!email){
            CustomError.createError("Faltan datos", {email}, checkArgumentos(req.body), TIPOS_ERROR.ARGUMENTOS_INVALIDOS);
            
            res.setHeader('Content-Type','application/json');
            res.status(401).json({error: "No ingreso correo"});
        }

        let usuario = await userManager.getUserById({email});

        if(!usuario){ 
            req.logger.error("Error: El usuario no existe");
            CustomError.createError("Error: El usuario no existe", {usuario}, checkUser(req.body), TIPOS_ERROR.AUTENTICACION);
            res.setHeader('Content-Type','application/json');
            res.status(400).json({error:  "El usuario no existe"});
        } else {
            usuario = {...usuario};
            
            //DTO
            let _usuario = new userDTO(usuario);
            let userData = {user: _usuario.email, nombre: _usuario.nombre, rol: _usuario.rol}
            let token = jwt.sign(userData, config.secretJwt, {expiresIn: "1h"});
            
            res.cookie("Recovery_Cookie", token, {httpOnly: true});

            sendMail(_usuario.email);
        
            res.setHeader('Content-Type','application/json');
            res.status(201).json({Success: "Correo enviado" });
        }
    } catch (e) {
        req.logger.error(`Recovery pass: ${e}`);
        res.setHeader('Content-Type','application/json');
        res.status(401).json({error: "El usuario no existe"});
    }
}

export const _setNewUserPass = async (req, res) => {
    jwt.verify(req.cookies.Recovery_Cookie, config.secretJwt, async (error, decoded) => {
        let jwtExpired = error?.message === "jwt expired";
        let title = error?.message !== "jwt expired" ? "Restablecer contraseña" :  "Ingreso";
        let changePass = error?.message !== "jwt expired";
        
        res.status(201).render("login", { title, changePass, jwtExpired });
    })
}

export const _changeUserPass = async (req, res) => {
    try {
        let newPass = req.body.newPass;
        let email = req.body.email;

        if(!newPass || !email)
            res.status(501).render("error", { error: "faltan datos" });
    
        let existingUser = await userManager.getUserById({email});
        
        if(existingUser) {
            let passChange = {password: generaHash(newPass)}   
            
            if(existingUser.password !== passChange.password) {
                let modifiedPass = await userManager.upDatePassword(email, passChange);  

                if(modifiedPass.modifiedCount > 0)
                    res.status(201).json({success: "Contraseña actalizada correctamente."});
                else
                    res.status(501).json({error: "Error al restablecer contraseña."});
            }else
                res.status(501).json({error: "Utilice una contraseña distinta a la anterior."});
            
        } else 
            res.status(501).json({error: "No se encontro el usuario"});

    } catch (e) {
        let error = "Error al restablecer contraseña";
        req.logger.error(`${error}: ${e}`);
        res.status(401).json({error: error});
    }
}

export const upDateUserRol = async (req, res) => {
    try {
        let uid = req.params.uid;
        let usuario = await userManager.getUserById({_id: uid});
       
        if(usuario.documents.length > 1) 
            if(helper.checkDocumentsToBePremium(usuario.documents)) {
                let rolChange = {rol: "premium"} 
                let modifiedPass = await userManager.upDateRol(usuario.email, rolChange);  

                (modifiedPass.modifiedCount > 0) 
                    ? res.status(201).json({ status: "Success", Message: "Felicitaciones, ahora es un usuario Premium" })
                    : res.status(501).json({ status: "Error", Message: "No se ha terminado de procesar la documentación necesaria" });
            } else 
                res.status(501).json({ status: "Error", Message: "No se ha terminado de procesar la documentación necesaria" });
        else
            res.status(501).json({ status: "Error", Message: "No se ha terminado de procesar la documentación necesaria" });

    } catch (e) {
        let error = "Error al actualiar el rol del usuario";
        req.logger.error(`${error}: ${e}`);
        res.status(401).json({error: error});
    }
}

export const uploadDocuments = async (req, res) => {
    try {
        let status = { status: true };
        let upDateStatus = await userManager.upDateUserInfo(req.user.email, null, status);

        res.status(201).json({success: "uploadDocuments."});
    } catch (e) {
        let error = "Error al guardar documentos";
        req.logger.error(`${error}: ${e}`);
        res.status(401).json({error: error});
    }
}