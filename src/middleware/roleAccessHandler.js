const handleRol = (roles) => {
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

export default handleRol;