import createError from "http-errors";
export const isAuth = (req, res, next)=>{
    if(req.user)
    {
      return  next()
    }
    return next(createError(401, "Login  to continue"))
}