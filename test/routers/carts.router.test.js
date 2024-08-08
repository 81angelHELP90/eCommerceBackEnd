import config from "../../src/config/config.js";
import UserManagerdb from "../../src/usuarioManagerDBHelper.js";
import mongooseConnect from "mongoose";
import { expect } from "chai";
import { afterEach, before, describe, it } from "mocha";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

const dbConector = async () => {
    try {
        await mongooseConnect.connect(
            config.mongoUrl,
            {
                dbName: config.dbName
            }
        )
        console.log("DB Conection OK");
    } catch (error) {
        console.log("Conector db error: ", error);
    }
};

dbConector();

//Test Carts:
describe("##### Test: Router Carts #######", function () {
    this.timeout(10000); 

    before(async function () {
        this.userManager = new UserManagerdb();
    });

    after(async function () {
        //hago esto acá para "matar" la terminal cuando termina el entorno de test porque el flag --test me tira el error: unknown option '--exit'
        process.exit();
    });

    //6678a95b6f6e1f1146ce4d03
    it("La ruta: /cart/:id y/o /cart/:id/purchase, método get, valida que un usuario tenga un carrito asociado a su cuenta", async function(){
        let { headers } = await requester.post("/api/sessions/login").send({"email": "test_34@gmail.com", "password": "angel123"});
        let { status } = await requester.get("/cart/6663731502a2685507e0e2ff").set("Cookie", headers["set-cookie"][0]);
        //let { status } = await requester.get("/cart/6663731502a2685507e0e2ff/purchase").set("Cookie", headers["set-cookie"][0]);
       
        //Afirmaciones: 
        expect(status).to.exist.and.to.be.equal(201);
    });

    //{"email": "admin@gmail.com", "password": "angel123"} | {"email": "test_34@gmail.com", "password": "angel123"}
    it("La ruta: /api/carts/addProduct, método post, valida que solo el rol user puede agregar productos a un carrito", async function(){
        let { headers } = await requester.post("/api/sessions/login").send({"email": "admin@gmail.com", "password": "angel123"});
        let { status } = await requester.post("/api/carts/addProduct")
                                        .set("Cookie", headers["set-cookie"][0])
                                        .send({
                                            cartId: "6678a95b6f6e1f1146ce4d03",
                                            category: 'Shoes',
                                            description: 'producto 8 de la tienda',
                                            idProd: '247',
                                            price: '78.11',
                                            title: 'producto 8',
                                        });
       
        //Afirmaciones: 
        expect(status).to.exist.and.to.be.equal(201);
    });
})
