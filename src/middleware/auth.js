const auth = (req, res, next) => {
    if(!req.session.usuario){
        res.setHeader('Content-Type','application/json');

        return res.redirect("/error");
    }

    next();
};

export default auth;