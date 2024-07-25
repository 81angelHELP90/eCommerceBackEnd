import passport from "passport";
import local from "passport-local";
import gitHub from "passport-github2";
import passPortJwt from "passport-jwt"
import UserManagerdb from "../usuarioManagerDBHelper.js";
const userManager = new UserManagerdb();
import { generaHash } from "../utils.js"
import { cartService } from "../services/cartsService.js";
import config from "./config.js";

const buscaToken=(req)=>{
    let token=null

    if(req.cookies["Access_Cookie"]){
        token=req.cookies["Access_Cookie"]
    }

    return token
}

const initPassport = () => {
    //Registro
    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField:"email", 
                passReqToCallback: true
            },
            async (req, email, password, done) => {
                try {

                    let { nombre, apellido, edad } = req.body;

                    if(!email || !password )
                        return done(null, false);
                
                    let existingUser = await userManager.getUserById({email});
                    
                    if(existingUser)
                        return done(null, false);
                    
                    password = generaHash(password);

                    //let newCart = await cartManager.insertCart(); 
                    let newCart = await cartService.insertCart();
                    let newUsuario = await userManager.createUser({nombre, apellido, edad, email, password, rol: "user", cart: newCart.payload._id});
                    
                    return done(null, newUsuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    )

    //Login: Autenticación por terceros: github : Paso 1
    passport.use(
        "github",
        new gitHub.Strategy(
            { 
                clientID: config.clientID,  
                clientSecret: config.clientSecret,  
                callbackURL: "http://localhost:8080/api/sessions/callBackGitHubE666"
            },
            async (tokenAcceso, tokenRefresh, profile, done) => {
                try {
                    let nombre = profile._json.name;
                    let email = profile._json.email;
                    
                    if(!email)
                        return done(null, false);

                    let existingUser = await userManager.getUserById({email});
                
                    if(existingUser)
                        return done(null, existingUser);

                    //let newCart = await cartManager.insertCart();
                    let newCart = await cartService.insertCart();
                    let newUsuario = await userManager.createUser({nombre, email, profile, rol: "user", cart: newCart.payload._id});
                    
                    return done(null, newUsuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    )

    //Login: Autenticación por terceros JWT:
    passport.use(
        "current", 
        new passPortJwt.Strategy(
            {
                secretOrKey: config.secretJwt, 
                jwtFromRequest: new passPortJwt.ExtractJwt.fromExtractors([buscaToken])
            },
            async(token, done) => { 
                try {
                    return done(null, token);
                } catch (error) {
                    console.log("Autenticación por terceros JWT: ", error)
                    return done(error);
                }
            }
        )
    )
    
    /*paso 1' (1 bis) - solo si usamos SESSIONS, configuro serializar / deserializer...*/
    
    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id);
    });

    passport.deserializeUser( async (id, done) => {
        let existingUser = await userManager.getUserById({id});

        return done(null, existingUser)
    });
}

export default initPassport;