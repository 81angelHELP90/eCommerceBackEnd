import { Router } from "express";
export const router = Router();
//middleware auth para session: import auth from "../middleware/auth.js"
import { passPortCall, userConnectWebSocket, messageWebSocket } from "../utils.js";
import { getProductsAdmin, getProducts, realtimeProducts } from "../controller/productsController.js";
import { getCartById, finallyPurchase, setTicket } from "../controller/cartsController.js";
import { recoveryPass, _setNewUserPass, _changeUserPass } from "../controller/userController.js";
import { UsuariosDTO as userDTO } from "../dto/usuariosDTO.js";
import { handleRol } from "../middleware/roleAccessHandler.js";

import io from "../app.js";

//Home:
router.get("/", (req, res) => {
    let title = "Home";
   
    res.status(201).render("home", { title });
});

//Login
router.get("/login", (req, res) => {
    let title = "Ingreso";
    let changePass = false;
    let jwtExpired = false;

    res.status(201).render("login", { title, changePass, jwtExpired });
});
//Registro
router.get("/registro", (req, res) => {
    let title = "Registro";

    res.status(200).render("registro", { title });
});

//Perfil: middleware auth para session | middleware passPortCall para JWT
router.get("/perfil", passPortCall("current"), (req, res) => {
    let title = "Perfil";
    //Para cuando uso session: let usuario = req.session.usuario;
    let _usuario = req.user //Para JWT:

    //DTO
    let usuario = new userDTO(_usuario);

    res.status(200).render("perfil", { title, usuario });
});

/*##### MODELO VISTA CONTROLADOR ##### */
//Cart:  middleware auth para session | middleware passPortCall para JWT
router.get("/cart/:id", passPortCall("current"), handleRol(["user"]), getCartById);

//Finalizar compra:  middleware auth para session | middleware passPortCall para JWT
router.get("/cart/:id/purchase", passPortCall("current"), handleRol(["user"]), finallyPurchase);

router.post("/cart/purchase", passPortCall("current"), handleRol(["user"]), setTicket);

//Productos: middleware auth para session | middleware passPortCall para JWT
router.get("/productos", passPortCall("current"), handleRol(["user"]), getProducts);

//router.get("/AdminProductos", passPortCall("current"), handleRol(["admin"]), getProducts);

//Lista de productos disponibles - Admin
router.get("/productos/admin", passPortCall("current"), handleRol(["admin", "premium"]), getProductsAdmin);

//Cambios en Productos
router.get("/realtimeproducts", passPortCall("current"), realtimeProducts);

//router.get("/adminProducts", passPortCall("current"), handleRol(["admin"]), adminProducts);

//Chat:
router.get("/chat", passPortCall("current"), handleRol(["user"]), (req, res) => {
    try { 
        io.on("connection", socket => {
            let userName = req.user?.nombre;
            let email = req.user?.email;
            let newUser = userConnectWebSocket.findIndex(user => user.correo === email);
            
            //Nuevo user conectado:
            if(newUser === -1){
                userConnectWebSocket.push({id: socket.id, name: userName, correo: email});
                socket.broadcast.emit("nuevoUsuario", userName);
            }

            //Recibo
            socket.on("mensaje", (message, id) => {
                let userEmisor = userConnectWebSocket.filter(user => user.id === id);
               
                if(userEmisor.length > 0) {
                    //historial de mensaje en memoria:
                    messageWebSocket.push({text: message, sendBy: userEmisor[0].name, date: new Date()});

                    //Envio el nuevo mensajes a todos los usuarios conectados:
                    io.emit("nuevoMensaje", message, userEmisor[0].name);
                }
            });

            //Desconexion:
            socket.on("disconnect", () => {
                let user = userConnectWebSocket.filter(user => user.correo === email);
                
                if(user)
                    io.emit("userDisconnect", user[0].name);
            });
        })

        res.status(200).render("chat");
    } catch (error) {
        console.log(`Chat error: ${error}`);
        res.status(500).json({ status: "error", message: "Error al intentar enviar comunicación" });
    }
});

//Error
router.get("/error/:error", (req, res) => {
    let error = (req.params.error) ? req.params.error : "Algo salio mal!"
    res.status(401).render("error", { error });
});

//Test-log:
router.get("/loggerTest", (req, res) => {
    req.logger.error("Prueba level ERROR");
    req.logger.info("Prueba level INFO");

    res.setHeader('Content-Type','application/json')
    res.status(201).json({ status: "success", message: "Test loggers" });
});

//Restablecer Cuenta:  
router.post("/recoveryPass", recoveryPass);

router.get("/setNewUserPass", _setNewUserPass);

router.post("/changeUserPass", _changeUserPass);


