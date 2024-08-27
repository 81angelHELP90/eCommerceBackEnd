import { Router } from "express";
export const router = Router();
import { passPortCall, userConnectWebSocket, messageWebSocket } from "../utils.js";
import { getProductsAdmin, getProducts, realtimeProducts } from "../controller/productsController.js";
import { getCartById, finallyPurchase, setTicket } from "../controller/cartsController.js";
import { recoveryPass, _setNewUserPass, _changeUserPass } from "../controller/userController.js";
import { UsuariosDTO as userDTO } from "../dto/usuariosDTO.js";
import { handleRol } from "../middleware/roleAccessHandler.js";

import io from "../app.js";

router.get("/", (req, res) => {
    let title = "Home";
   
    res.status(201).render("home", { title });
});

router.get("/login", (req, res) => {
    let title = "Ingreso";
    let changePass = false;
    let jwtExpired = false;

    res.status(201).render("login", { title, changePass, jwtExpired });
});

router.get("/registro", (req, res) => {
    let title = "Registro";

    res.status(200).render("registro", { title });
});

router.get("/perfil", passPortCall("current"), (req, res) => {
    let title = "Perfil";
    //Para cuando uso session: let usuario = req.session.usuario;
    let _usuario = req.user //Para JWT:

    //DTO
    let usuario = new userDTO(_usuario);

    res.status(200).render("perfil", { title, usuario });
});

router.get("/cart/:id", passPortCall("current"), handleRol(["user"]), getCartById);

router.get("/cart/:id/purchase", passPortCall("current"), handleRol(["user"]), finallyPurchase);

router.post("/cart/purchase", passPortCall("current"), handleRol(["user"]), setTicket);

router.get("/productos", passPortCall("current"), handleRol(["user"]), getProducts);

router.get("/productos/admin", passPortCall("current"), handleRol(["admin", "premium"]), getProductsAdmin);

router.get("/realtimeproducts", passPortCall("current"), realtimeProducts);

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

            socket.on("mensaje", (message, id) => {
                let userEmisor = userConnectWebSocket.filter(user => user.id === id);
               
                if(userEmisor.length > 0) {
                    messageWebSocket.push({text: message, sendBy: userEmisor[0].name, date: new Date()});

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


