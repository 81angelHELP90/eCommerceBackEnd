import path from 'path';
import { fileURLToPath } from 'url';
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

export default __dirname;

const SECRET="Hash#Hash123"
export const generaHash = password => crypto.createHmac("sha256", SECRET).update(password).digest("hex");