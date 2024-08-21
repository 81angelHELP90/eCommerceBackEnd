import express from "express";
export const router = express.Router();
import { upDateUserRol, uploadDocuments } from "../controller/userController.js";
import { passPortCall, upload } from "../utils.js";
import { handleRol } from "../middleware/roleAccessHandler.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

router.post("/premium/:uid", passPortCall("current"), handleRol(["user"]), upDateUserRol);
router.post("/premium/:uid/documents", upload.array("uploaded_file", 10), passPortCall("current"), handleRol(["user"]), uploadDocuments);
router.get("/upLoadDocuments", passPortCall("current"), handleRol(["user"]), (req, res) => {
    let title = "Subir documentos";
    let uid = "";

    jwt.verify(req.cookies["Access_Cookie"], config.secretJwt, function(err, decored){
        uid = decored._id;
    });
    
    res.status(201).render("upLoadDocuments", { title, uid });
});

