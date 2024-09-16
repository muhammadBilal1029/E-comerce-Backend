const express = require("express");
const User = require('../Models/User');
const verifyToken =require('../Middleware/VerifyTokan');
const router = express.Router();
router.get('/getUser', verifyToken, async (req, res) => {
    try {
      if (req.user.userType !== 'Admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }
      const UserData = await User.find();
  
      res.status(200).json({ UserData, userType: req.user.userType });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
module.exports=router;