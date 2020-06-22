const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();

const common_routes = require('./common_route');

const show_product = (req, res)=>{
    let id = req.query.id;
    let saving = 0;
    let check = true;

    connection.query('SELECT * FROM product WHERE id = ?;', id, (err, results1)=>{
        if(err){
            console.log(err);
        } else{
            if(results1.length == 0){
                res.render('wrong_access', {check: false});
            } else{
                connection.query('SELECT * FROM product WHERE big_division = ? AND small_division = ? NOT IN(id=?) ORDER BY RAND() LIMIT 4;', [results1[0].big_division, results1[0].small_division, id], (err, results2)=>{
                    if(err){
                        console.log(err);
                    } else if(req.session.logined == true){
                        for(var i = 0; i < req.session.saw_products.length; i++){
                            if(id == req.session.saw_products[i]){
                                check = false;
                                break;
                            }
                        }
                        if(check == true){
                            if(req.session.saw_products.length == 10){
                                req.session.saw_products.shift();
                            }
                            req.session.saw_products.push(id);
                        }
                        res.render('product', {result: results1, saving: saving, related: results2});
                    } else{
                        res.render('product', {result: results1, saving: saving, related: results2});
                    }
                })
            }
        }
    })
}

const order_products = (req, res)=>{
    let result = '';
    let all_data = req.body.all_data;
    let total_savings = req.body.total_savings;
    let user_id = req.session.user_id;

    let change_grade = 5;

    all_data = JSON.parse(all_data);
    total_savings = JSON.parse(total_savings);

    all_data.user_id = req.session.user_id;

    if(common_routes.fnc_check_session(req, result) == 'not_login'){
        res.send({result: false});
    } else{
        connection.query('INSERT INTO ordered_product SET ?;', all_data, (err)=>{
            if(err){
                console.log(err);
            } else{
                connection.query('SELECT use_money FROM users WHERE id = ?', user_id, (err, results)=>{
                    if(err){
                        console.log(err);
                    } else{
                        if(results[0].use_money >= 100000){
                            change_grade = 4;
                        } if(results[0].use_money >= 300000){
                            change_grade = 3;
                        } if(results[0].use_money >= 500000){
                            change_grade = 2
                        } if(results[0].use_money >= 700000){
                            change_grade = 1
                        }
    
                        connection.query('UPDATE users SET use_money = use_money + ?, savings = savings + (?), grade = ? WHERE id = ?;', [all_data.all_price, total_savings, change_grade, user_id], (err)=>{
                            if(err){
                                console.log(err);
                            } else{
                                req.session.savings += total_savings;
                                req.session.use_money += all_data.all_price;
                                req.session.grade = change_grade;
                                req.session.cart_products = Array(Array(), Array(), Array(), Array(), Array());
                                res.send({result: true});
                            }
                        })
                    }
                })
            }
        })
    }
}

module.exports.show_product = show_product;
module.exports.order_products = order_products;