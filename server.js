const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const jwt = require( 'jsonwebtoken' );
const {expressjwt: expressJwt} = require('express-jwt');
const PORT = 3000;

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Aythorization');
    next();
});

app.use(bodyParser.json());

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});


let users = [
    {
        id: 1,
        username: 'samhith',
        password: 'sam'
    },
    {
        id: 2,
        username: 'dara',
        password: 'sa'
    },
    
]
const secretKey = "My super secret key";
const jwtMW = expressJwt({
    secret: secretKey,
    algorithms: ['HS256']
});


app.post('/api/login', (req,res) => {
    const {username,password} = req.body;
    let userFound = false;

for (const user of users) {
    if (user.username === username && user.password === password) {
        let token = jwt.sign({ ID: user.id, username: user.username }, secretKey, { expiresIn: '1m' });
        console.log("success");

        res.json({
            success: true,
            err: null,
            token: token
        });

        userFound = true;
        break;
    }
}

if (!userFound) {
    console.log("failed");
    res.status(401).json({
        success: false,
        token: null,
        err: 'Username or password is incorrect !!!'
    });
}

    
});

app.get('/api/dashboard', jwtMW , (req,res) => {
    console.log(req);
    res.json({
        success: true,
        myContent:'Secret content that only logged in people can see.'
    });
});

app.get('/api/setting', jwtMW , (req,res) => {
    console.log(req);
    res.json({
        success: true,
        myContent:'Secret content that only logged in people can see.'
    });
});

app.use(function(err, req, res, next) {
    if(err.name ==='UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Access is denied without login'
        });
    }
    else {
        next(err);
    }
});

app.listen(PORT, ()=>{
    console.log(`serving port ${PORT}`);
});