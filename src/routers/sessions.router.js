import express from "express";
export const router = express.Router();
import UserManagerdb from "../usuarioManagerDBHelper.js";
const userManager = new UserManagerdb();
import { generaHash } from "../utils.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

//Registro 
router.post('/registro', passport.authenticate("registro", {failureRedirect:"/api/sessions/error"}), async (req,res) => {
    res.setHeader('Content-Type','application/json');
    res.redirect("/login");
});

//Login 
router.post("/login", async(req, res)=>{
    let {email, password, web} = req.body;

    try {
        if(!email || !password){
            res.setHeader('Content-Type','application/json');
            (web) ? res.redirect(`/login?error=Complete email, y password`) : res.status(401).json({error:`Complete email, y password`})
        }

        let usuario = await userManager.getUserById({email, password: generaHash(password)});

        if(!usuario){ 
            res.setHeader('Content-Type','application/json');
            (web) ? res.redirect("/error/Credenciales invalidas") : res.status(400).json({error:`Credenciales invalidas`});
        } else {
            
            usuario = {...usuario};
            delete usuario.password;
            
            //Cuando uso Sessions:
            //req.session.usuario = usuario;

            //Para JWT:
            let token = jwt.sign(usuario, config.secretJwt, {expiresIn: "1h"});

            //Creamos la cookies desde el back:
            res.cookie("Access_Cookie", token, {httpOnly: true});
            //httpOnly: solo envia la info si se accede desde una petición http - a traves de algun verbo httmp
        
            if(web){
                res.redirect("/productos");
            } else {
                res.setHeader('Content-Type','application/json');
                res.status(201).json({payload:"Login correcto", usuario});
            }
        }
    } catch (error) {
        console.log("login: ", error);
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
    })
    
    res.setHeader('Content-Type','application/json');
    res.redirect("/");
});