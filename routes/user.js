const express = require("express");
const router = express.Router();

const User = require("../models/User");
 

const {login, signup} = require("../controllers/Auth");
const {auth, isStudent, isAdmin} = require("../middlewares/auth");

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

router.get("/admin", auth, isAdmin, (req,res) => {
    res.json({
        success:true,
        message:"welcom to protected router for Admin"
    });
});

// router.get("/getEmail", auth, async (req,res) => {
//     try{
//         const id = req.user.id;
//         console.log("ID" , id);
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found',
//             });
//         }

//         res.status(200).json({
//             success: true,
//             email: user.email,
//             message: "Welcome to the email route",
//         });
//     }
//     catch(error){
//         res.status(500).json({
//             success:false,
//             error:error.message,
//             message:"Fatt gya code"
//         })
         
//     }
    
// });

module.exports = router;
