const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');

const container = require('./container');
const users = require('./controllers/users');

container.resolve(function (users) {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/MychatApp', {useNewUrlParser: true});

    const app = setUpExpress();

    function setUpExpress() {
        const app = express();
        // const server = http.createServer(app);
        
        ConfigureExpress(app);
        // Setup router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        app.use(router);
        // server.listen(5000, function() {
        //     console.log(`server is running on port 5000`);
        // });
        app.listen(5000, () => {
            console.log('Server is rnning on port 5000');
        })
    }
    // differnt way to create router coz we are using promises async
    

    function ConfigureExpress(app) {
        app.use(express.static('public'));
        app.use(cookieParser);
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(validator());
        app.use(session({
            secret: 'thisissecretkey',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({ mongooseConnection: mongoose.connection })
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
    }
});

// const express = require('express');
// const app = express();
// const router = express.Router();
// app.set('view engine', 'ejs');
// app.use(router);

// router.get('/', (req, res) => {
//     res.render('signup');
// })


// app.listen(5000, () => {
//     console.log('running...........................');
    
// });