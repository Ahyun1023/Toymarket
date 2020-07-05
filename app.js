const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const static = require('serve-static');

const session = require('express-session');
const filestore = require('session-file-store')(session);

const expressErrorHandler = require('express-error-handler');

const user_routes = require('./routes/user_route');
const common_routes = require('./routes/common_route');
const cart_routes = require('./routes/cart_route');
const search_routes = require('./routes/search_route');
const product_routes = require('./routes/product_route');
const page_routes = require('./routes/page_route');
const order_routes = require('./routes/order_route');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views, views');

app.use('/public', static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new filestore()
}));

router = express.Router();

router.route('/auto_main').post(common_routes.auto_main);
router.route('/check_session').post(common_routes.check_session);
router.route('/check_session_count').post(common_routes.check_session_count);
router.route('/auto_change_info').post(page_routes.auto_change_info);
router.route('/list-load').get(page_routes.list_load);
router.route('/load/success-data').get(page_routes.success_data);

router.route('/users/signup').post(user_routes.signup);
router.route('/users/login').post(user_routes.login);
router.route('/users/logout').post(common_routes.logout);
router.route('/users/signout').post(user_routes.signout);
router.route('/users/change_info').post(user_routes.change_info);

router.route('/product').get(product_routes.show_product);

router.route('/search/name').get(search_routes.search_name);
router.route('/search/id').get(search_routes.search_id);
router.route('/search/des').get(search_routes.search_des);

router.route('/go_mypage').post(page_routes.go_mypage);
router.route('/go_cart').post(cart_routes.go_cart);

router.route('/cart/add-cart').post(cart_routes.add_to_cart);
router.route('/cart/update-count').post(cart_routes.update_count);
router.route('/cart/delete-cart').post(cart_routes.delete_cart);

router.route('/order/cart').get(order_routes.order_cart);
router.route('/order/now').get(order_routes.order_now);

router.route('/buy-products').post(product_routes.order_products);

app.use('/', router);

let errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(app.get('port'), ()=>{
    console.log('서버 시작, 포트넘버: %d', app.get('port'));
})