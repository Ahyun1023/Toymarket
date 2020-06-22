const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();

const product_routes = require('./cart_route');
const common_routes = require('./common_route');

const order_cart = (req, res)=>{
    let result = '';
    if(common_routes.fnc_check_session(req, result) == 'not_login'){
        res.render('login_check', {check: false});
    } else if(req.session.cart_products[0] == 0){
        product_routes.fnc_cart_Load(req, res);
    } else{
        let em = req.session.email.split('@');
        let user = {
            id: req.session.user_id,
            name: req.session.name,
            phone1: req.session.phone_number.substring(0, 3),
            phone2: req.session.phone_number.substring(3, 7),
            phone3: req.session.phone_number.substring(7, 11),
            email: em[0],
            email_form: em[1],
            address: req.session.address,
            savings: req.session.savings
        }
        let product = req.session.cart_products;
        let products_id = new Array();
        let total = {
            count: 0,
            price: 0,
            shipping_fee: 0,
            saving: 0,
            all_price: 0
        }
        let count = 0;
    
        for(var i = 0; i < product.length; i++){
            if(product[i][0] != undefined){
                products_id[i] = product[i][0];
                count++;
    
                total.count += parseInt(req.session.cart_products[i][1]);
                total.price += parseInt(req.session.cart_products[i][2]);
    
                total.all_price += parseInt(req.session.cart_products[i][2]);

                total.saving += parseInt(req.session.cart_products[i][4]);
    
                if(total.shipping_fee < req.session.cart_products[i][3]){
                    total.shipping_fee = parseInt(req.session.cart_products[i][3]);
                }
            } else{
                break;
            }
        }
    
        var sql = "\n";
            sql += "SELECT *\n";
            sql += "    FROM product\n";
            sql += "    WHERE id IN(";
            sql += products_id.join();
            sql += ") ORDER BY field(id, ";
            sql += products_id.join();
            sql += ");";
    
        connection.query(sql, (err, results)=>{
            if(err){
                console.log(err);
            } else{
                res.render('buy', ({product: product, user: user, products_id: products_id, product_info: results, count: count, total: total}));
            }
        })
    }
}

const order_now = (req, res)=>{
    let product_id = req.query.id;
    let count = req.query.count;

    product_id = JSON.parse(product_id);
    count = JSON.parse(count);

    let products_id = [product_id];

    if(count <= 0 || count > 5){
        return;
    } else{
        let total_price = 0;
        let total_savings = 0;

        count = parseInt(count);
        if(req.session.user_id == undefined){
            res.render('login_check', {check: false});
        } else{
            let em = req.session.email.split('@');

            let user = {
                id: req.session.user_id,
                name: req.session.name,
                phone1: req.session.phone_number.substring(0, 3),
                phone2: req.session.phone_number.substring(3, 7),
                phone3: req.session.phone_number.substring(7, 11),
                email: em[0],
                email_form: em[1],
                address: req.session.address,
                savings: req.session.savings
            }
    
            connection.query('SELECT * FROM product WHERE id = ?;', product_id, (err, results) => {
                if(err) {
                    console.log(err);
                }else {
                    for(var i = 0; i < count; i++) {
                        total_price += results[0].price;
                        total_savings += results[0].saving;
                    }
                    let product = Array(Array());
    
                    product[0][0] = product_id;
                    product[0][1] = count;
                    product[0][2] = total_price;
                    product[0][3] = results[0].shipping_fee;
                    product[0][4] = total_savings;
    
                    let total = {
                        count: count,
                        price: results[0].price,
                        shipping_fee: results[0].shipping_fee,
                        saving: total_savings,
                        all_price: total_price
                    }
                    res.render('buy', ({ product: product, user: user, products_id: products_id, product_info: results, count: 1, total: total }));
                }
            })
        }
    }
}

module.exports.order_cart = order_cart;
module.exports.order_now = order_now;