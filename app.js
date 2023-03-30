const express = require('express');
const session = require('express-session');
const PORT = 8010;
const app = express();

// MIDDLEWARE
app.use(express.static('assets'));
app.set('view engine', 'pug');
// UUID Unierval
app.use(session({
    secret: '18c1a1b5-0299-48df-a751-9b8849ce20c1',
    saveUninitialized: true,
    resave: true
}))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

function checkSecretPages(request,response,next){
    // Array af alle de sider der er hemmelige.
    let secretPages = '/secret';
    if(secretPages === request.url && !request.session.isLoggedIn){
        console.log("Forsøg på ulovlig indtrængen")
        response.redirect('/');  
    }
    else{
        next();
    }
    
    // For at sikre vi kommer videre.
    

}

app.use(checkSecretPages)

// ENDPOINTS
app.get('/', (req,res) => {
    let isLoggedIn = false;
    if(req.session.isLoggedIn){
        isLoggedIn = true;
    }

    res.render('home',{knownUser: isLoggedIn});
})

app.post('/login', (req,res) => {
    // Modtages fra form Action post i loginform.pug
    const username = req.body.username;
    const password = req.body.password;

    if(checkUser(username, password)){
        req.session.isLoggedIn = true;
    }else{
        // Placer tæller variabel
    }
    res.redirect('/');


})

app.get('/secret', (req,res) => {
    if(!req.session.isLoggedIn){
        res.redirect('/');
    }else{
        res.render('secret', {knownUser: true});
    }

    
})

app.get('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/');
})


// Listening on port 8010
app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
})


// FUnctions

// Simulation af et databaseopslag
function checkUser(usrname, pass){
    let returnvalue = false
    if(usrname === 'Hugo' && pass === '123'){
        returnvalue = true;
    }
    return returnvalue;
}