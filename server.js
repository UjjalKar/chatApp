const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');

const container = require('./container');

// last did 26

container.resolve(function(users, _) {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/MyChatApppp', {
        useNewUrlParser: true,
        useCreateIndex: true
    });

    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        server.listen(3001, function() {
            console.log('Listeninng on port 3000');
        });

        ConfigureExpress(app);

        // Setup router
        const router = require('express-promise-router')();
        users.SetRouting(router);

        app.use(router);
    }

    function ConfigureExpress(app) {
        require('./passport/passport.local');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }))

        app.use(validator());
        app.use(session({
            secret: 'this is my secret',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({ mongooseConnection: mongoose.connection })
        }));
        app.use(flash());
        
        app.use(passport.initialize());
        app.use(passport.session());

        // Setting _ to global varible 
        // This is how we set global
        // Variables in express
        app.locals._ = _;
    }

});