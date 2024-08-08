import express from "express";
export const router = express.Router();
import UserManagerdb from "../usuarioManagerDBHelper.js";
const userManager = new UserManagerdb();
import { generaHash } from "../utils.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { UsuariosDTO as userDTO } from "../dto/usuariosDTO.js";

import { CustomError } from "../handleErrors/customError.js";
import { TIPOS_ERROR } from "../handleErrors/EErrors.js";
import { checkArgumentos, checkUser } from "../handleErrors/userError.js";

//import io from "../app.js";

//Registro 
router.post('/registro', passport.authenticate("registro", {failureRedirect:"/api/sessions/error"}), async (req,res) => {
    res.setHeader('Content-Type','application/json');
    res.redirect("/login");
});

//Login 
router.post("/login", async(req, res) => {
    let {email, password, web} = req.body;

    try {
        if(!email || !password){
            CustomError.createError("Faltan datos", {email, password}, checkArgumentos(req.body), TIPOS_ERROR.ARGUMENTOS_INVALIDOS);
            res.setHeader('Content-Type','application/json');
            (web) ? res.redirect(`/login?error=Complete email, y password`) : res.status(401).json({error:`Complete email, y password`})
        }

        let usuario = await userManager.getUserById({email, password: generaHash(password)});

        if(!usuario){ 
            req.logger.error("Error de autenticación");
            CustomError.createError("Error de autenticación", {usuario}, checkUser(req.body), TIPOS_ERROR.AUTENTICACION);
            res.setHeader('Content-Type','application/json');
            (web) ? res.redirect("/error/Credenciales invalidas") : res.status(400).json({error:`Credenciales invalidas`});
        } else {
            usuario = {...usuario};
           
            //Cuando uso Sessions:
            //req.session.usuario = usuario;

            //Para JWT: --aca habra que ver si el token expiro y si es asi volver a generarlo?
            let token = jwt.sign(usuario, config.secretJwt, {expiresIn: "2h"});

            //DTO
            let _usuario = new userDTO(usuario);    

            //Creamos la cookies desde el back:
            res.cookie("Access_Cookie", token, {httpOnly: true});
            //httpOnly: solo envia la info si se accede desde una petición http - a traves de algun verbo http
          
            if(web)
                (_usuario.rol === "user") ? res.redirect("/productos") : res.redirect("/productos/admin");
            else {
                res.setHeader('Content-Type','application/json');
                res.status(201).json({payload:"Login correcto", _usuario });
            }
        }
    } catch (error) {
        req.logger.error("login: ", error);
        res.setHeader('Content-Type','application/json');
        res.status(401).json({error:`Credenciales invalidas`})
    }
});

//Login: Autenticación de terceros:
router.get("/github", passport.authenticate("github", {}), async (req,res) => {});

router.get("/callBackGitHubE666", passport.authenticate("github", {failureRedirect:"/api/sessions/error"}), async (req,res) => {

    let usuario = req.user;
    usuario = {...usuario};
    delete usuario.password;
    
    //PROFEreq.session.usuario = usuario;

    res.redirect("/productos");
});

router.get("/logout", (req, res)=>{
    req.session.destroy(e=>{
        if(e){
            console.log(error);
            res.setHeader('Content-Type','application/json');
            res.status(501).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${error.message}`
                }
            )
            
        }
    });
    
    res.clearCookie("Access_Cookie", "", {expires: new Date(1)});
    res.setHeader('Content-Type','application/json');
    res.redirect("/login");
});