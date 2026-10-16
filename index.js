const express=require('express');
require('dotenv').config();
const jwt=require('jsonwebtoken')
const app=express();
const JWT_SECRET="Iloveyou"
app.use(express.json());
function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let token = "";
    for (let i = 0; i < 32; i++) {
        // use a simple function here
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}
 let users = [];
app.post('/signup', (req, res) => {
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

app.post('/signin', (req, res) => {
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
        )
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
app.get("/me",function(req,res) {
    const token=req.headers.token
    const decodedInformation =jwt.verify(token,JWT_SECRET)
     const username=decodedInformation.username
    let founduser=null;
    for(let i= 0;i<users.length;i++){
        if(users[i].username==username){
          founduser=users[i]
        }
    }
    if(founduser){
    res.json({
        username:founduser.username,
        password:founduser.password
    })
    }
    else{
        res.json({
            message:"token invalid"
        })
    }


});



app.listen(3000);