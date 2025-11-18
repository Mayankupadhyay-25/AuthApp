const express = require("express");
const router = express.Router();
 

const {login, signup} = require("../controllers/Auth");
const {auth, isStudent, isAdmin} =require("../middlewars/auth");

router.post("/login", login);
router.post("/signup", signup);


//testing protected route for single middkeware 
router.get("/test", auth, isStudent, (req,res) => {
    res.json({
        success:true,
        message:"welcom to protected router for Test"
    });
});

//protected route
router.get("/student", auth, isStudent, (req,res) => {
    res.json({
        success:true,
        message:"welcom to protected router for Student"
    });
});

router.get("/admin", auth, isStudent, (req,res) => {
    res.json({
        success:true,
        message:"welcom to protected router for Admin"
    });
});

module.exports = router;
