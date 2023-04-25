// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const Story = require('./model/add_story');
// const UserRegistration = require('./model/registration');
// const Interest = require('./model/intrest');
// const post = require('./model/add_post');
// const app = express();




// mongoose.connect('mongodb+srv://roshankumarsinghbhumca21:ROSHAN@cluster0.jug58hc.mongodb.net/?retryWrites=true&w=majority').then(
//     //mongodb+srv://venu:VENU@cluster0.dt57vkn.mongodb.net/?retryWrites=true&w=majority
//     ()=>console.log('db is connected..')
// ).catch(err=>console.log(err))

// app.use(express.json());
// // app.post('/signup',async(req,res)=>{
// //     try{
// //    const  {username,email,phone,dob,password,cpassword} = req.body;
// //    const newData = new UserRegistration({username,email,phone,dob,password,cpassword})
// //    await newData.save();
// //       return res.json(await UserRegistration.find())
// //     }
// //     catch(err){
// //      console.log(err.message)
// //     }
// // })
// app.post('/signup',async(req,res)=>{

//   const  {username,email,phone,dob,password,cpassword} = req.body;
//   if(!username || !email || !password || !cpassword || !phone || !dob){
//     return res.status(401).json({error:"please add all the fields"})
//   }

//   UserRegistration.findOne({email:email})
//   .then((savedUser)=>{
//     if(savedUser){
//       return res.status(401).json({error:"user already exist with that email"})
//     }

//     const newData = new UserRegistration({
//       username,email,phone,dob,password,cpassword
//     })
//     newData.save().then(user=>{
//       res.json({message:"saved successfully"})
//     })
//     .catch(err=>{
//       consol.log(err)
//     })
//   })
// })



// app.get('/userdetails',async(req,res) =>{
//     try{
//         const allData = await UserRegistration.find();
//         return res.json(allData);  
//        }
//        catch(err){
//         console.log(err.message);
//        }

// })

// app.post('/login', async(req, res) => {
//     try {
//       const { email, password } = req.body;
//       const user = await UserRegistration.findOne({ $or: [{ email }], password });
//       if (!user) {
//         return res.status(401).json({ message: 'Invalid email/phone or password' });
//       }
//       return res.json(user.email);
//     } catch(err) {
//       console.log(err.message);
//     }
//   });

//   app.post('/changepassword', async(req, res) => {
//     try {
//       const { email, password } = req.body;
//       const user = await UserRegistration.findOne({ $or: [{ email }] });
//       if (!user) {
//         return res.status(401).json({ message: 'Invalid email' });
//       }
//       user.password = password;
//       await user.save();
//       return res.json({ message: 'Password changed successfully' });
//     } catch(err) {
//       console.log(err.message);
//     }
//   });
  
//   // app.get('/interests', async (req, res) => {
//   //   try {
//   //     // Extract the search key from the request query params
//   //     const { searchKey } = req.query;
  
//   //     // Use a regular expression to search for interests that match the search key
//   //     const interests = await Interest.find({
//   //       name: { $regex: searchKey, $options: 'i' }
//   //     });
  
//   //     // Return the list of interests as a JSON response
//   //     return res.json(interests);
//   //   } catch (err) {
//   //     console.log(err.message);
//   //     return res.status(500).json({ error: 'details are not found' });
//   //   }
//   // });


//   app.post('/interests', async (req, res) => {
//     try {

//       const  {name,coverPic} = req.body;
//    const data = new Interest({name,coverPic})
//    await data.save();
//     return res.json(await Interest.find())
//       // Extract the search key from the request query params
//       // const { searchKey } = req.query;
  
//       // // Use a regular expression to search for interests that match the search key
//       // const interests = await data.find({
//       //   name: { $regex: searchKey, $options: 'i' }
//       // });
  
//       // // Return the list of interests as a JSON response
//       // return res.json(interests);
//     } catch (err) {
//       console.log(err.message);
//       return res.status(500).json({ error: 'details are not found' });
//     }
//   });
  

//   app.get('/interests/search',async(req, res)=>{
//     try{
//       const { searchKey } = req.query;
//    //   console.log(searchKey);
//       const interests = await Interest.find({
//           //  name: { $regex: searchKey, $options: 'i' }
//          // name: 'searchKey'
//          fieldToSearch: searchKey
//       });
//         // if(interests.contains(searchKey))
//          return res.json(interests);
//     }catch(err){
//       console.log(err.message);
//       return res.status(500).json({ error: 'details are not found' });
//     }
//   });


//   app.get('/interests/id',async(req, res)=>{
//     try{
//       const intrest= await Interest.find();
//       return res.json(intrest);

//     }catch(err){
//       console.log(err.message);
//       return res.status(500).json({ error: 'details are not found' });
//     }
//   })


// // add story

//   app.post('/addstory', async (req, res) => {
//     try {
//       const story = new Story({
//         user: req.body.user,
//         type: req.body.type,
//         file: req.file.path
//       });
//       const savedStory = await story.save();
//       res.json(savedStory);
//     } catch (error) {
//       console.error('Error saving story:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
  
//   // Route for retrieving all stories
//   app.get('/stories', async (req, res) => {
//     try {
//       const stories = await Story.find();
//       res.json(stories);
//     } catch (error) {
//       console.error('Error retrieving stories:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
 
  
// // get story list of following user

//   app.get('/stories/:userId', async (req, res) => {
//     try {
//       // Get the user's following list
//       const user = await User.findById(req.params.userId);
//       const following = user.following;
  
//       // Get the stories of the following users
//       const stories = await Story.find({ user: { $in: following } });
  
//       // Calculate the counts for each story
//       const storyCounts = stories.map(story => {
//         const likesCount = story.likes.length;
//         const commentsCount = story.comments.length;
//         const sharesCount = story.shares.length;
//         return {
//           _id: story._id,
//           user: story.user,
//           type: story.type,
//           file: story.file,
//           likesCount,
//           commentsCount,
//           sharesCount
//         };
//       });
  
//       res.json(storyCounts);
//     } catch (error) {
//       console.error('Error retrieving following stories:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
  


//   app.post('/stories/:storyId/likes', async (req, res) => {
//     try {
//       // Get the user who is liking the story
//       const user = await User.findById(req.body.userId);
  
//       // Get the story that is being liked
//       const story = await Story.findById(req.params.storyId);
  
//       // Check if the user has already liked the story
//       if (story.likes.includes(user._id)) {
//         return res.status(400).json({ message: 'You have already liked this story' });
//       }
  
//       // Add the user's ID to the likes array of the story
//       story.likes.push(user._id);
  
//       // Save the story
//       await story.save();
  
//       res.json(story);
//     } catch (error) {
//       console.error('Error liking story:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });



//   app.use(express.json());

// // Create a new post endpoint
// app.post('/posts', async (req, res) => {
//   try {
//     const { userId, text, image, video, tags, pollEnabled, pollDuration, caption, privacy, hideLikesFrom, hideViewsFrom } = req.body;

//     const post = new Post({
//       userId,
//       text,
//       image,
//       video,
//       tags,
//       pollEnabled,
//       pollDuration,
//       caption,
//       privacy,
//       hideLikesFrom,
//       hideViewsFrom,
//     });

//     await post.save();

//     res.json(post);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // Get all posts endpoint
// app.get('/posts', async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ createdAt: -1 });

//     res.json(posts);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });




// app.use(express.json());

// // Get posts of following users endpoint
// app.get('/posts/following', async (req, res) => {
//   try {
//     const { userId } = req.query;

//     const user = await User.findById(userId);

//     const following = user.following;

//     const posts = await Post.find({ userId: { $in: following } }).populate('userId', 'username').sort({ createdAt: -1 });

//     res.json(posts);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });



// app.use(express.json());

// // Like a post endpoint
// app.post('/posts/:postId/like', async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const { postId } = req.params;

//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({ msg: 'Post not found' });
//     }

//     if (post.likes.includes(userId)) {
//       return res.status(400).json({ msg: 'Post already liked' });
//     }

//     post.likes.push(userId);
//     await post.save();

//     res.json(post);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// app.use(express.json());

// // Comment on a post endpoint
// // app.post('/posts/:postId/comments', async (req, res) => {
// //   try {
// //     const { userId, comment } = req.body;
// //     const { postId } = req.params;

// //     const post = await Post.findById(postId);

// //     if (!post) {
// //       return res.status(404).json({ msg: 'Post not found' });
// //     }

// //     const newComment = { userId, comment };
// //     post.comments.unshift(newComment);
// //     await post.save();

// //     res.json(post);
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send('Server Error');
// //   }
// // });





// app.listen(3000,()=>console.log('server is running!!'))

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const conversationRoute = require('./routes/conversation');
const messageRoute = require('./routes/messages')
const chat_settingRoute = require('./routes/chat_setting');
const storyRoute = require('./routes/story');

mongoose.connect('mongodb+srv://roshankumarsinghbhumca21:ROSHAN@cluster0.jug58hc.mongodb.net/?retryWrites=true&w=majority').then(
  ()=>console.log('db is connected..')
).catch(err=>console.log(err))



// middlewarre

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));



app.use("/api/auth",authRouter);
app.use("/api/post",postRouter);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/chat_setting", chat_settingRoute);
app.use("/api/story", storyRoute);









app.listen(3000,()=>{
    console.log("server is running on port 3000")
});