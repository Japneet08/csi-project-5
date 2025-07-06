require('dotenv').config()
const express= require('express')
const app=express()
const userModel=require("./models/user.model")
const postModel=require('./models/post.model')
const path=require('path')
const cookieParser=require('cookie-parser')
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")

//set view engine
app.set("view engine","ejs")
// set up parsers 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// set up file path
app.use(express.static(path.join(__dirname,"public")))
// call cookie parser
app.use(cookieParser())
//home
app.get("/",(req,res)=>{
  res.render("index")
})

// creation user 
app.post("/register",async (req,res)=>{
 let {name,username,email,password,age}=req.body

// checking if user exists already 
let user = await userModel.findOne({ email: email });

if(!user){
   bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
      const user=await userModel.create({
        name:name,
        username:username,
        email:email,
        password:hash,
        age:age

      })
      let token=jwt.sign({email:email,userid:user._id},"secretkey")
      res.cookie("token",token)
      console.log(token)
      res.redirect('/profile')

  });
  
});
}

else return res.status(500).send("user already registered please login")
})

// 
app.get("/login",(req,res)=>{
  res.render("login")
})
//login
app.post("/login",async(req,res)=>{
  let {email,password}=req.body
  let user= await userModel.findOne({email:email})
  if(!user){
    return res.status(500).send("Something went wrong")
  }
  bcrypt.compare(password, user.password, function(err, result) {
    if(result){
      let token=jwt.sign({email:email,userid:user._id},"secretkey")
      res.cookie("token",token)
      res.redirect("/profile")

    }
    else{
      return res.status(401).redirect("/login")
    }
});

  // logout
})
// logout
app.get("/logout",(req,res)=>{
  res.cookie("token","")
  res.redirect("/login")
})

// profile
// app.get("/profile",isLoggedIn,async (req,res)=>{
//   let user=await userModel.findOne({email:req.user.email}).populate("posts")
//   user.name=user.name.charAt(0).toUpperCase()+user.name.slice(1)
//   res.render("Profile",{user:user})

// })
app.get("/profile", isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    if (!user) {
      return res.redirect("/login");
    }
    user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
    
    res.render("profile", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


// app.post("/profile",(req,res)=>{
//   res.send(req.body)
// })
 
app.post("/abc",isLoggedIn,async (req,res)=>{
  let user=await userModel.findOne({email:req.user.email})
  
  let{postdata}=req.body

  let post=await postModel.create({
    user:user._id,
    content:postdata
  })

  user.posts.push(post._id)
  await user.save()
  res.redirect("/profile")

})
app.get("/like/:id",isLoggedIn,async (req,res)=>{
  let post= await postModel.findOne({_id:req.params.id}).populate("user")
  if(post.likes.indexOf(req.user.userid)===-1){post.likes.push(req.user.userid)}
  else{
    post.likes.splice(post.likes.indexOf(req.user.userid),1)
  }
  
  await post.save()
  res.redirect("/profile")
})
// protected routes 
function isLoggedIn(req,res,next){
  //  console.log( req.cookies)
  if(req.cookies.token===""){res.redirect("/login")}
  
  else{
    let data = jwt.verify(req.cookies.token,"secretkey")
    req.user=data
    next()
  }
  }
app.get("/edit/:id",isLoggedIn,async(req,res)=>{
  let post= await postModel.findOne({_id:req.params.id}).populate("user")
  console.log(post.content)
  res.render("edit",
    {post:post})
  

})


app.post("/edit/:id",async (req,res)=>{
  let {postdata}=req.body
  // console.log(postdata)
 let post= await postModel.findOneAndUpdate({_id:req.params.id},{content:postdata},{new:true})
 res.redirect("/profile")
})

app.get("/delete/:id",isLoggedIn, async(req,res)=>{
  await postModel.findOneAndDelete({_id:req.params.id})
  res.redirect("/profile")
})
app.listen(3000,()=>{
  console.log("server running at port 3000 ")
})