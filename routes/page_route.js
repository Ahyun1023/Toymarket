const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();

const common_routes = require('./common_route');

const auto_change_info = (req, res)=>{
    let result = '';
    if(common_routes.fnc_check_session(req, result) == 'not_login'){
        res.send({result: false});
    } else{
        let users = {
            phone_number: req.session.phone_number,
            email: req.session.email,
            zonecode: req.session.zonecode,
            address: req.session.address,
            detail_address: req.session.detail_address
        }
        users = JSON.stringify(users);
        res.send({result: users});
    }
}

const go_mypage = (req, res)=>{
    let users = {
        id: req.session.user_id,
        name: req.session.name,
        grade: req.session.grade,
        savings: req.session.savings
    }
    let result = '';

    let bought_productId = new Array();
    let productId_check = new Array();
    let bought_check = new Array();

    if(common_routes.fnc_check_session(req, result) == 'not_login'){
        res.render('login_check', {check: false});
    } else{
        connection.query('SELECT product_id FROM ordered_product WHERE user_id = ?;', req.session.user_id, (err, results) => {
            if(err) {
                console.log(err);
            }else {
                for(var i = results.length-1; i >= 0; i--){
                    if(results[i].product_id.indexOf(', ') != -1){
                        productId_check = results[i].product_id.split(', ');
                        for(var j = productId_check.length-1; j >= 0; j--){
                            bought_check.push(productId_check[j]);
                        }
                    } else{
                        bought_check.push(results[i].product_id);
                    }
                }
                if(bought_check.length != 0){
                    bought_productId.push(bought_check[0]);
                }
    
                for(var i = 0; i < 100000; i++){
                    if(bought_productId[i] != bought_check[i]){
                        bought_productId.push(bought_check[i]);
                        if(bought_productId.length == 11){
                            break;
                        } else{
                            continue;
                        }
                    } else{
                        continue;
                    }
                }
    
                if(bought_productId.length != 0){
                    var sql = "\n";
                    sql += "SELECT *\n";
                    sql += "    FROM product\n";
                    sql += "    WHERE id IN(";
                    sql += bought_productId.join();
                    sql += ") ORDER BY field(id, ";
                    sql += bought_productId.join();
                    sql += ");";
                } else{
                    var sql = "\n";
                    sql += "SELECT *\n";
                    sql += "    FROM product\n";
                    sql += "    WHERE id IN(";
                    sql += 0
                    sql += ");";
                }
            }
    
            connection.query(sql, (err, results2) => {
                if (err) {
                    console.log(err);
                } else {
                    if (req.session.saw_products == 0) {
                        if (results.length == 0) {
                            res.render('mypage', { user: users, saw: null, bought: null });
                        } else {
                            res.render('mypage', { user: users, saw: null, bought: results2 });
                        }
    
                    } else {
                        for (var i in req.session.saw_products) {
                            req.session.saw_products[i] = JSON.stringify(req.session.saw_products[i]);
                        }
                        var sql = "\n";
                        sql += "SELECT *\n";
                        sql += "    FROM product\n";
                        sql += "    WHERE id IN(";
                        sql += req.session.saw_products.join();
                        sql += ") ORDER BY field(id, ";
                        sql += req.session.saw_products.join();
                        sql += ");";
    
                        connection.query(sql, (err, results3) => {
                            if (err) {
                                console.log(err);
                            } else {
                                for (var i in req.session.saw_products) {
                                    req.session.saw_products[i] = JSON.parse(req.session.saw_products[i]);
                                }
                                if (results.length == 0) {
                                    res.render('mypage', { user: users, saw: results3, bought: null });
                                } else {
                                    res.render('mypage', { user: users, saw: results3, bought: results2 });
                                }
                            }
                        });
                    }
                }
            });
        })
    }
}

const list_load = (req, res)=>{
    let products_name = new Array();
    connection.query('SELECT * FROM ordered_product WHERE user_id = ?;', req.session.user_id, (err, results)=>{
        if(err){
            console.log(err);
        } else{
            for(var i = 0; i < results.length; i++){
                products_name.push(results[i].product_id.split(', '));
            }

            var sql = "\n";
            sql += "SELECT id, name\n";
            sql += "    FROM product\n";
            sql += "    WHERE id IN(";
            sql += products_name.join();
            sql += ") ORDER BY field(id, ";
            sql += products_name.join();
            sql += ");";

            connection.query(sql, (err, results2)=>{
                if(err){
                    console.log(err);
                } else{
                    for(var i = 0; i < products_name.length; i++){
                        for(var j = 0; j < products_name[i].length; j++){
                            for(var k = 0; k < results2.length; k++){
                                if(products_name[i][j] == results2[k].id){
                                    products_name[i][j] = results2[k].name;
                                    break;
                                }
                            }
                        }
                    }
                    results = JSON.stringify(results);
                    products_name = JSON.stringify(products_name);
                    res.send({result: results, products_name: products_name});
                }
            })
        }
    })
}

const success_data = (req, res)=>{
    let products_id = new Array();
    connection.query('SELECT * FROM ordered_product WHERE user_id = ? ORDER BY id DESC LIMIT 1;', req.session.user_id, (err, results1)=>{
        if(err){
            console.log(err);
        } else{
            products_id.push(results1[0].product_id.split(', '));
            
            var sql = "\n";
            sql += "SELECT name\n";
            sql += "    FROM product\n";
            sql += "    WHERE id IN(";
            sql += products_id.join();
            sql += ") ORDER BY field(id, ";
            sql += products_id.join();
            sql += ");";

            connection.query(sql, (err, result)=>{
                if(err){
                    console.log(err);
                } else{
                    connection.query('SELECT * FROM product ORDER BY RAND() LIMIT 4;', (err, results2) => {
                        if (err) {
                            console.log(err);
                        } else {
                            results1 = JSON.stringify(results1);
                            results2 = JSON.stringify(results2);
                            result = JSON.stringify(result);
                            res.send({ orderedList: results1, products_name: result, recommend: results2 });
                        }
                    })
                }
            })
        }
    })
}

module.exports.go_mypage = go_mypage;
module.exports.auto_change_info = auto_change_info;
module.exports.list_load = list_load;
module.exports.success_data = success_data;