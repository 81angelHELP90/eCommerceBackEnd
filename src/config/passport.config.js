import passport from "passport";
import local from "passport-local";
import UserManagerdb from "../usuarioManagerDBHelper.js";
const userManager = new UserManagerdb();
import { generaHash } from "../utils.js"
import CartManagerdb from "../cartsManagerDBHelper.js";
const cartManager = new CartManagerdb();

const initPassport = () => {
    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField:"email", 
                passReqToCallback: true
            },
            async (req, email, password, done) => {
            //async (req, done) => {
                try {
                    //let { email } = req.body;
                    
                    let { nombre, apellido, edad } = req.body;

                    if(!email || !password )
                        return done(null, false);
                
                    let existingUser = await userManager.getUserById({email});
                    
                    if(existingUser)
                        return done(null, false);
                    
                    password = generaHash(password);

                    let newCart = await cartManager.insertCart();
                    let newUsuario = await userManager.createUser({nombre, apellido, edad, email, password, rol: "user", cart: newCart.payload._id});
                    
                    return done(null, newUsuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    )


    // paso 1' (1 bis) - solo si usamos SESSIONS, configuro serializar / deserializer...
    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id);
    })

    passport.deserializeUser( async (id, done) => {
        //let usuario = await usuariosManager.getBy({_id:id});
        let existingUser = await userManager.getUserById({id});

        return done(null, existingUser)
    })

}

export default initPassport;