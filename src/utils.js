import path from 'path';
import { fileURLToPath } from 'url';
import crypto from "crypto";
import passport from "passport";
import config from "./config/config.js"
import { faker } from '@faker-js/faker';

import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const userConnectWebSocket = [];
export const messageWebSocket = [];

export default __dirname;

//const SECRET = config.secretHas//"Hash#Hash123";
//export const SECRETJWT = "JWT&SECRET#";

export const generaHash = password => crypto.createHmac("sha256", config.secretHas).update(password).digest("hex");


export const passPortCall = (strategy) => {
    return function (req, res, next) {
        //  Middleware passport custom
        passport.authenticate(strategy, function (err, user, info, status) {

            if (err)
                return next(err)

            if (!user) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({ error: (info.message) ? info.message : info.toString() })
            }

            req.user = user;

            return next();

        })(req, res, next);
    }
}

//faker 
export const generateProducs = async () => {
    let products = [];

    for (let i = 1; i < 100; i++) {
        products.push({
            title: `PRODUCTO ${i}`,
            description: `producto ${i} de la tienda`,
            price: 34 + i + Math.random().toFixed(2),
            thumbnail: [`img/fgfgfgf_${i}.jpg`],
            code: 110 + i,
            id: 778 + i,
            stock: 9 + i,
            status: (i % 2 === 0),
            category: (i % 2 === 0) ? "Shoes" : "Clothes"
        });
    }

    return products
}

//Send Mails:
export const sendMail = async (email) => {
    //objeto Transporter: realiza la conexión con el servidor de correo
    const trasporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: config.ecommerceMail, //'vangel338@gmail.com',
            pass: config.ecommerceAppPass,//'aapfrbdbdsltjsso',
        },
        tls: { rejectUnauthorized: false }
    });
//upDatePass
    trasporter.sendMail({
        from: "Ecommers web..",
        to: email,
        subject: "RECUPERAR CONTRASEÑA",
        html: `
            <div class="row my-4">
                <h4 class="my-4">Utilice el boton para recuperar la contrasela.</h4>
                <h4 class="my-4">El acceso al cambio de contraseña estará habilitado durante 60 minutos. Luego de ese tiempo deberá generar uno nuevo.</h4>
                <button type="button" style="width: 135px;" class="btn btn-primary"><a class="nav-link" href="http://localhost:8080/setNewUserPass">Recuperar</a></button>
            </div>
        `
    })
    .then( respuesta => console.log("Correo enviado: ", respuesta.response))
    .catch( e => console.log("Error al enviar correo: ", e))
}
