const express = require("express");
const router = express.Router();
const{login,signup} = require("../Controller/Auth");
const {auth, isStudent, isAdmin} = require("../middlewares/Auth");
const cookieParser = require("cookie-parser");

router.post("/login",login);
router.post("/signup",signup);
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:"Testing route",
        user:req.user,
    });
});
//protected routes
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"welcome to protected route for student"
    });
});
router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"welcome to protected route for admin"
    });
});
module.exports = router;