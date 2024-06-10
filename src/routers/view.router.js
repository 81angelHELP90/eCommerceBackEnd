import { Router } from "express";
export const router = Router();
//middleware auth para session: import auth from "../middleware/auth.js"
import { passPortCall } from "../utils.js";
import { getProducts, realtimeProducts } from "../controller/productsController.js";

//Vista Home:
router.get("/", (req, res) => {
    let title = "Home";
   
    res.status(200).render("home", { title });
});

//Vista Login
router.get("/login", (req, res) => {
    let title = "Ingreso...";

    res.status(200).render("login", { title });
});
//Vista Registro
router.get("/registro", (req, res) => {
    let title = "Registro";

    res.status(200).render("registro", { title });
});

//Vista Perfil: middleware auth para session | middleware passPortCall para JWT
router.get("/perfil", passPortCall("current"), (req, res) => {
    let title = "Perfil";
    //Para cuando uso session: let usuario = req.session.usuario;
    let usuario = req.user //Para JWT:

    res.status(200).render("perfil", { title, usuario });
});

//Vista Cart:  middleware auth para session | middleware passPortCall para JWT
router.get("/cart/:id", passPortCall("current"), async (req, res) => {
    let title = "Carrito";
    let cartId = req.user.cart;

    res.status(200).render("cart", { title, cartId });
});

/*##### MODELO VISTA CONTROLADOR ##### */
//MVC: Vista Productos: middleware auth para session | middleware passPortCall para JWT
router.get("/Productos", passPortCall("current"), getProducts);

//Cambios en Productos
router.get("/realtimeproducts", passPortCall("current"), realtimeProducts);

//Vista Error
router.get("/error/:error", (req, res) => {
    let error = (req.params.error) ? req.params.error : "Algo salio mal!"
    res.status(401).render("error", { error });
});



