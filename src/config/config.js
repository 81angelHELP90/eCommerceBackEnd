import dotenv from "dotenv";
import {Command, Option} from "commander";

let programa = new Command();

programa.addOption(new Option("-m, --mode <modo>", "Mode de ejecución del script").choices(["dev", "prod"]).default("dev"))
programa.parse();

const argumentos = programa.opts();
const mode = argumentos.mode;

dotenv.config(
    {
        path: mode === "prod" ? "./src/.env.production" : "./src/.env.development",
        override: true //Permite leer una variable desde el .env aun si exite en el SO
    }
)

export default {
    mongoUrl: process.env.MONGO_URL,
    dbName: process.env.DB_NAME,
    clientID: process.env.CLIENT_ID_GITHUB,
    clientSecret: process.env.CLIENT_SECRET_GITHUB,
    secretJwt: process.env.SECRETJWT,
    secretHas: process.env.SECRET,
    ecommerceMail: process.env.ECOMMERCEMAIL,
    ecommerceAppPass: process.env.ECOMMERCEAPPPASSWORD,
    environment: process.env.ENVIRONMENT,
}
