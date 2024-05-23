import express from "express";
export const router = express.Router();
import UserManagerdb from "../usuarioManagerDBHelper.js";
const userManager = new UserManagerdb();
import { generaHash } from '../utils.js';
import passport from 'passport';

//Registro 
router.post('/registro', passport.authenticate("registro", {failureRedirect:"/api/sessions/error"}), async (req,res) => {
    res.setHeader('Content-Type','application/json');
    res.status(201).json({ status: "success", message: "Usuario creado correctamente!" });
    /*
    let { nombre, apellido, edad, email, password } = req.body;

    if(!apellido || !email || !password){
        res.setHeader('Content-Type','application/json');
        res.status(401).json({ status: "error", message: "Campos requeridos" });
    }

    try {
        let existingUser = await userManager.getUserById({email});

        if(existingUser){
            res.setHeader('Content-Type','application/json');
            res.status(401).json({ status: "error", message: `El correo ${email} ya esta registrado` });
        }

        password = generaHash(password);

        let newCart = await cartManager.insertCart();
        let newUsuario = await userManager.createUser({nombre, apellido, edad, email, password, rol: "user", cart: newCart.payload._id});
        delete newUsuario.password;

        res.setHeader('Content-Type','application/json');
        res.status(201).json({ status: "success", message: newUsuario });
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        res.status(401).json({ status: "error", message: "Error al intentar registro" });
    }
    */
})
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

//Autenticación de terceros:
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
    //res.status(500).json({error:`Error inesperado!`});
    
    let title = "Error";
    let error = "No existen usuarios registrados"
    //let usuario = req.session.usuario;
    res.status(200).render("error", { title, error });
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