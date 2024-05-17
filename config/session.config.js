const session = require('express-session');


const sessionConfig = (app) => {
    app.use(session({
        secret: 'session-repair-computer-secret',
        resave: false,
        saveUninitialized: true,
        cookie: { 
            secure: false,
        },
    }));
}


module.exports = sessionConfig;
