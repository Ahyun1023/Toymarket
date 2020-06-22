const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();

const common_routes = require('./common_route');

const add_to_cart = (req, res)=>{
    let products = req.body.data;
    let overlap_check = false;
    let full_check = false;
    products = JSON.parse(products);

    if(req.session.logined == true){
        for(var i = 0; i < 5; i++) {
            if(req.session.cart_products[i][0] == products.id) {
                overlap_check = true;
                break;
            }
        }

        if(req.session.cart_products[4][0] !== undefined){
            full_check = true;
        }

        if(overlap_check == true) {
            res.send({result: 'overlap'});
        }else if(full_check == true){
            res.send({result: 'full_cart'});
        } else{
            for(var i = 0; i < 5; i++) {
                if(req.session.cart_products[i][0] != null) {
                    continue;
                } else{
                    break;
                }
            }
            req.session.cart_products[i].push(products.id);
            req.session.cart_products[i].push(products.count);
            req.session.cart_products[i].push(products.total_price);
            req.session.cart_products[i].push(products.shipping_fee);
            req.session.cart_products[i].push(products.savings);
            res.send({ result: true });
        }
    } else{
        res.send({result: false});
    }
}

const go_cart = (req, res)=>{
    fnc_cart_Load(req, res);
}

const update_count = (req, res)=>{
    let result = '';
    let count = req.body.count;
    let id = req.body.id;
    let price = 0;
    let saving = 0;
    let num;
    if(common_routes.fnc_check_session(req, result) == 'not_login'){
        res.send({result: false});
    } else{
        for(var i = 0; i<5; i++){
            if(req.session.cart_products[i][0] == id){
                num = i;
                break;
            }
        }
        connection.query('SELECT sale_price, saving FROM product WHERE id = ?;', id, (err, results)=>{
            if(err){
                console.log(err);
            } else{
                if(count < req.session.cart_products[num][1]){
                    var minnum = parseInt(req.session.cart_products[num][1]) - count;
                    price = parseInt(req.session.cart_products[num][2]);
                    saving = parseInt(req.session.cart_products[num][4]);
                
                    for(var i = 0; i < minnum; i++){
                        price -= results[0].sale_price;
                        saving -= results[0].saving;
                    }
                } else{
                    for(var i = 0; i < count; i++){
                        price += results[0].sale_price;
                        saving += results[0].saving;
                    }
                }
                req.session.cart_products[num].splice(1, 1, count);
                req.session.cart_products[num].splice(2, 1, price);
                req.session.cart_products[num].splice(4, 1, saving);
    
                fnc_cart_Load(req, res);
            }
        })   
    }
}

const delete_cart = (req, res)=>{
    let result = '';
    if(common_routes.fnc_check_session(req, result) == 'not_login'){
        res.send({result: false});
    } else{
        let delete_id = req.body.data;
        req.session.cart_products.splice(delete_id, 1);
        req.session.cart_products.push(new Array);
        res.send({result: true});
    }
}

const fnc_cart_Load = (req, res)=>{
    let result = '';
    let products_id = [0];
    let total = {
        count: 0,
        price: 0,
        shipping_fee: 0,
        saving: 0,
        all_price: 0
    }
    if(common_routes.fnc_check_session(req,result) == 'not_login'){
        res.render('login_check', {check: false});
    } else{
        for (var i = 0; i < 5; i++) {
            if (req.session.cart_products[i][0] != undefined) {
                products_id.push(req.session.cart_products[i][0]);
                total.count += parseInt(req.session.cart_products[i][1]);
                total.price += parseInt(req.session.cart_products[i][2]);

                total.all_price += parseInt(req.session.cart_products[i][2]);

                total.saving += parseInt(req.session.cart_products[i][4]);

                if (total.shipping_fee < req.session.cart_products[i][3]) {
                    total.shipping_fee = parseInt(req.session.cart_products[i][3]);
                }
            } else {
                break;
            }
        }
        total.all_price += parseInt(total.shipping_fee);

        var sql = "\n";
        sql += "SELECT *\n";
        sql += "    FROM product\n";
        sql += "    WHERE id IN(";
        sql += products_id.join();
        sql += ") ORDER BY field(id, ";
        sql += products_id.join();
        sql += ");";

        connection.query(sql, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                res.render('cart', { product: req.session.cart_products, product_info: results, count: results.length, total: total });
            }
        })
    }
}

module.exports.add_to_cart = add_to_cart;
module.exports.go_cart = go_cart;
module.exports.update_count = update_count;
module.exports.delete_cart = delete_cart;
module.exports.fnc_cart_Load = fnc_cart_Load;