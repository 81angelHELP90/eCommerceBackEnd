import dotenv from "dotenv";

dotenv.config();

export default {
    mongoUrl: process.env.MONGO_URL,
    dbName: process.env.DB_NAME,
    clientID: process.env.CLIENT_ID_GITHUB,
    clientSecret: process.env.CLIENT_SECRET_GITHUB,
    secretJwt: process.env.SECRETJWT,
    secretHas: process.env.SECRET,

}
