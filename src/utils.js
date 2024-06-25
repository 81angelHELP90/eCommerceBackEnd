import path from 'path';
import { fileURLToPath } from 'url';
import crypto from "crypto";
import passport from "passport";
import config from "./config/config.js"

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

