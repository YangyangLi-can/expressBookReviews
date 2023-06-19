const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({ message: "Unauthorized access."});
    }
    try{
        const decoded = jwt.verify(token, "secret_key");
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({ message: "Invalid token"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
