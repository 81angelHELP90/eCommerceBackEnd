import { productService } from "../services/productsService.js";

export const handleRol = (roles) => {
    let _roles = roles;
    
    return (req, res, next) => {
        let roles = _roles.map(rol => rol.toUpperCase());

        if(!req.user?.rol)
            return  res.status(401).render("error", { error: "No existen usuarios logeados."});

        if(!roles.includes(req.user.rol.toUpperCase()))
            return  res.status(401).render("error", { error: "No tiene permisos suficientes."});

        return next();
    }
};

export const handleCrudProdByRol = () => {
    return async (req, res, next) => {
        try {
            const productId = parseInt(req.params.pid);
            const rolUser = req.user.rol;
            const email = req.user.email;
    
            if(rolUser === "premium"){
                let product = await productService.getProductById(productId);
    
                if(product[0]?.owner === email)
                    return next();
                else
                    return  res.status(401).render("error", { error: "No tiene premisos suficientes para la acción requerida."});
            }
            
            return next(); 
        } catch (error) {
            return  res.status(401).render("error", { error: "Error al ejecutar la acción requerida."});
        }
    }
};
  