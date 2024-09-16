const express = require("express");
const User = require('../Models/User');
const verifyToken =require('../Middleware/VerifyTokan');
const router = express.Router();
const VerifyTokan =require('../Middleware/VerifyTokan')
router.get('/getUser', verifyToken, async (req, res) => {
    try {
      if (req.user.userType !== 'Admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }
      const UserData = await User.find({ userType: { $ne: 'Admin' } });
  
      res.status(200).json({ UserData, userType: req.user.userType });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  router.delete('/users/:id',verifyToken, async (req, res) => {
    try {
        if (req.user.userType !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/AdminUsertype', VerifyTokan, (req, res) => {
  try {
    res.status(200).json({ userType: req.user.userType });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
module.exports=router;