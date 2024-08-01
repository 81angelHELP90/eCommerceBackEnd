import { productService } from "../services/productsService.js";

export const handleRol = (roles) => {
    let _roles = roles;
    
    return (req, res, next) => {
        let roles = _roles.map(rol => rol.toUpperCase());
        let message = "";
        
        if(!req.user?.rol)
            message = "No existen usuarios logeados.";

        if(!roles.includes(req.user.rol.toUpperCase()))
            message = "No tiene permisos suficientes.";

        if(message)
            if(req.headers.referer && !req.headers.referer.includes("apiDocs"))
                return res.status(401).render("error", { error: message});
            else
                return  res.status(401).json({error: "error", payload: message});
        
        return next();
    }
};

export const handleCrudProdByRol = () => {
    return async (req, res, next) => {
        try {
            const productId = parseInt(req.params.pid);
            const rolUser = req.user.rol;
            const email = req.user.email;
            let web = req.headers.referer && !req.headers.referer.includes("apiDocs")
    
            if(rolUser === "premium"){
                let product = await productService.getProductById(productId);
    
                if(product[0]?.owner === email)
                    return next();
                else
                    return  web ? res.status(401).render("error", { error: "No tiene premisos suficientes para la acción requerida."}) : res.status(401).json({error: "error", payload: "No tiene premisos suficientes para la acción requerida."});
            }
            
            return next(); 
        } catch (error) {
            return  web ? res.status(401).render("error", { error: "Error al ejecutar la acción requerida."}) : res.status(401).json({error: "error", payload: "Error al ejecutar la acción requerida."});
        }
    }
};
  