//auth,isStudent, isAdmin
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth = (req, res, next) => {
  try {
    const token =
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
exports.isStudent = (req,res,next) =>{
    try{
        if(req.user.role !== "Student" ){
            return res.status(401).json({
                success:false,
                message:"role entered is incorrect"
            })
        }
        next();
    }
    catch(err){
        return res.status(403).json({
            success:false,
            message:"cannot fetch the role"
        });
    };
};

exports.isAdmin = (req,res,next) =>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"Entered role is incorrect"
            });
        };
        next();
    }
    catch(err){
        return res.status(403).json({
            success:false,
            message:"cannot fetch the role"
        });
    };
};
exports.test = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Test middleware failed",
    });
  }
};
