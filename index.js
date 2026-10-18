const express=require('express');
require('dotenv').config();
const jwt=require('jsonwebtoken')
const app=express();
const JWT_SECRET=process.env.JWT_SECRET;
app.use(express.json());
function logger(req,res,next){
    console.log(req.method+"request come")
    next()
}

 let users = [];
 app.get("/",function(req,res) {
    res.sendFile(__dirname +"/public/index.html");
 });
app.post('/signup',logger, (req, res) => {
   const username=req.body.username;
   const password=req.body.password;
    users.push({
        username:username,
        password:password
    })
    console.log(users);
    res.json(
        {message:'you are singned up successfully'}
    )
  
});

app.post('/signin',logger, (req, res) => {
    const username=req.body.username;
    const password=req.body.password;
    let founduser=null;
    for(let i=0;i<users.length;i++){
     if(users[i].username===username && users[i].password===password){
        founduser=users[i]
     }
    }
    if(founduser){
        const token=jwt.sign(
            {username:username},JWT_SECRET
        );
        res.header("jwt",token);
        // founduser.token=token;
        res.json(
            {token:token}
        )
    }
    else{
        res.status(403).send({
            message:'Invalid username and password'
        })
    }
  console.log(users);
});
function auth(req,res,next){
    const token=req.headers.token;
    const decodeData=jwt.verify(token,JWT_SECRET);
    if(decodeData.username){
        req.username=decodeData.username;
        next()
    }
    else{
        res.json({
            message:"you are not logged in"
        })
    }
}
app.get("/me",logger,auth,function(req,res) {
    
    
    let founduser=null;
    for(let i= 0;i<users.length;i++){
        if(users[i].username==req.username){
          founduser=users[i];
        }
    }
    
    if (!founduser) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    // Return user information
    res.json({
        username: founduser.username,
        password: founduser.password
        
    });
    }
  

);


app.listen(3000);