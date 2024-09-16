const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { name, email, password, userType,secretKey} = req.body;
    console.log('Received data:', req.body);
    try {
        if (!name || !email || !password || !userType) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }
    
       if(userType==='Admin' && secretKey===''){
        return res.status(400).json({ msg: 'Please provide all required fields' });
       }
       if(userType==='Admin' && secretKey!=process.env.SECRETKEY){
        return res.status(400).json({ msg: 'Invalid Secret Key' });

       }
        if (!email || email === "null") {
            return res.status(400).json({ msg: 'Invalid email address' });
        }
        let user = await User.findOne({ email }); 
        if (user) {
            return res.status(400).json({msg:"Email Already Exist" });
        }

        const salt = await bcrypt.genSalt(10);
        if (!salt) {
            console.log('Failed to generate salt');
            return res.status(500).json({ msg: 'Server error' });
        }

        const hashPassword = await bcrypt.hash(password, salt); 
        if (!hashPassword) {
            console.log('Failed to hash password');
            return res.status(500).json({ msg: 'Server error' });
        }
        console.log("Email before saving:", email);
       let  user1 = new User({
        id:1,
            name, 
            email, 
            password: hashPassword,
            userType, 
        });
        
        console.log("User before saving:", user1);
        await user1.save(); 
        console.log("Email After saving:", email);
        const payload = { userId: user1._id,userType: user1.userType };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token,userType: user1.userType  });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Error during signup');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { userId: user._id , userType: user.userType};
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userType: user.userType });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
