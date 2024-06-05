import express from "express";
export const router = express.Router();
import UserManagerdb from "../usuarioManagerDBHelper.js";
const userManager = new UserManagerdb();
//import { generaHash } from "../utils.js";
import passport from "passport";
import { passPortCall, SECRETJWT } from "../utils.js";
import jwt from "jsonwebtoken";

//Registro 
router.post('/registro', passport.authenticate("registro", {failureRedirect:"/api/sessions/error"}), async (req,res) => {
    res.setHeader('Content-Type','application/json');


    //Ahora
    //let token = jwt.sign(req.user, SECRETJWT, {expiresIn: "1h"});
    //res.cookie("Access_Cookie", token, {httpOnly: true});
    //Fin ahora
    
    res.redirect("/login");
})
//Login Con JWT: validar token
router.post("/login", passPortCall("login"), async(req, res)=>{

    //Ahora
    //if(!req.cookies["Access_Cookie"]){
    let token = jwt.sign(req.user, SECRETJWT, {expiresIn: "1h"});

    //Creamos la cookies desde el back:
    res.cookie("Access_Cookie", token, {httpOnly: true});//httpOnly: solo envia la info si se accede desde una petición http - a traves de algun verbo httmp
    //Ahora}

    res.setHeader('Content-Type','application/json');
    res.status(201).json({ status: "success", user: req.user });
});


//Login Con sessions
/*
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
            (web) ? res.redirect(`/login?error=Credenciales invalidas`) : res.status(400).json({error:`Credenciales invalidas`});
        }
            
        usuario = {...usuario};
        delete usuario.password;
        req.session.usuario = usuario;
    
        if(web){
            res.redirect("/productos");
        } else {
            res.setHeader('Content-Type','application/json');
            res.status(201).json({payload:"Login correcto", usuario});
        }
    
    } catch (error) {
        console.log("login: ", error);
        res.setHeader('Content-Type','application/json');
        res.status(401).json({error:`Credenciales invalidas`})
    }
});
*/

//Login: Autenticación de terceros:
router.get("/github", passport.authenticate("github", {}), async (req,res) => {});
router.get("/callBackGitHubE666", passport.authenticate("github", {failureRedirect:"/api/sessions/error"}), async (req,res) => {

    let usuario = req.user;
    usuario = {...usuario};
    delete usuario.password;
    req.session.usuario = usuario;

    res.redirect("/productos");
});
router.get("/error", (req,res) => {
    res.setHeader('Content-Type','application/json');
    res.redirect("/error");
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