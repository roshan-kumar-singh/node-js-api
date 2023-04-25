const router = require('express').Router();
const UserRegistration = require('../MODELS/user')
//Register
router.post('/register', (req, res) => {
    const  {username,email,dob,password,cpassword} = req.body;
    
  
    UserRegistration.findOne({email:email})
    .then((savedUser)=>{
      if(savedUser){
        return res.status(401).json({error:"user already exist with that email"})
      }
  
      const newData = new UserRegistration({ 
        username,email,dob,password,cpassword
      })
      newData.save().then(user=>{
        res.json({message:"saved successfully"})
      })
      .catch(err=>{
        console.log(err)
      })
    })


})

//get all data

router.get('/userdetails',async(req,res) =>{
    try{
        const allData = await UserRegistration.find();
        return res.json(allData);  
       }
       catch(err){
        console.log(err.message);
       }

})
//signin

router.post('/login', async(req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserRegistration.findOne({ $or: [{ email }], password });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email/phone or password' });
      }
      return res.json(user.email);
    } catch(err) {
      console.log(err.message);
    }
  });
 
//change Password
router.post('/changepassword', async(req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserRegistration.findOne({ $or: [{ email }] });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email' });
      }
      user.password = password;
      await user.save();
      return res.json({ message: 'Password changed successfully' });
    } catch(err) {
      console.log(err.message);
    }
  });


//user profile setup (personal or professional)

  

  router.put('/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { accountType } = req.body;
    
    try {
      const user = await UserRegistration.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (accountType === 'personal') {
        const { displayName } = req.body;
        user.displayName = displayName;
       // user.interestName = interestName;
      } else if (accountType === 'professional') {
        const { businessLogo, businessName, businessType } = req.body;
        user.businessLogo = businessLogo;
        user.businessName = businessName;
        user.businessType = businessType;
      } else {
        return res.status(400).json({ message: 'Invalid account type' });
      }
  
      await user.save();
      return res.json({ message: 'Profile updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

//personal account setup



router.post('/personal', async (req, res) => {
  try {
    const { displayName, personalTemplate } = req.body;
    const userId = req.user.id; // assuming you are using some form of authentication middleware to get the logged-in user ID

    // Update the user document with the given display name and personal template
    const updatedUser = await UserRegistration.findByIdAndUpdate(userId, {
      displayName,
      personalTemplate
    }, { new: true });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//intrest list

router.get('/interests', async (req, res) => {
  try {
    const keyword = req.query.search;

    // If a search term is provided, search by interest name
    let interests;
    if (keyword) {
      interests = await UserRegistration.find({
        interestName: { $elemMatch: { $regex: keyword, $options: 'i' } }
      }).select('interestName coverPic');
    } else {
      interests = await UserRegistration.find().select('interestName coverPic');
    }

    res.json(interests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//choose intrest


router.post('/addInterest/:userId', async (req, res) => {
  const { userId } = req.params;
  const { interest } = req.body;
  
  try {
    // Check if user exists
    const user = await UserRegistration.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if interest exists
    let interestObject;
    if (mongoose.Types.ObjectId.isValid(interest)) {
      interestObject = await UserRegistration.findById(interest);
    } else {
      interestObject = await UserRegistration.findOne({ name: interest });
    }
    if (!interestObject) {
      return res.status(404).json({ message: "Interest not found" });
    }
    
    // Check if interest is already added
    if (user.interestName.includes(interestObject._id)) {
      return res.status(400).json({ message: "Interest already added" });
    }
    
    // Add interest to user's profile
    user.interestName.push(interestObject._id);
    await user.save();
    
    return res.status(200).json({ message: "Interest added to user's profile" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router

