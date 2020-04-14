const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const static = require('serve-static');

const multer = require('multer');

//const session = require('express-session');
//const filestore = require('session-file-store')(session);

const user_routes = require('./routes/user_route');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views, views');

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/photo', static(path.join(__dirname, 'photo')));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const storage = multer.diskStorage({
    destination : function(req, file, callback){
        callback(null, 'photo')
    },
    filename : function(req, file, callback){
        callback(null, file.originalname);
    }
});

const upload = multer({
    storage : storage,
    limits: {
        files : 10,
        fileSize : 1024 * 1024 * 1024
    }
});

/*app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new filestore()
}));*/

router = express.Router();

router.route('/signup').post(user_routes.signup);

app.use('/', router);

http.createServer(app).listen(app.get('port'), ()=>{
    console.log('서버 시작, 포트넘버: %d', app.get('port'));
})