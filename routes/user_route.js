const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();

const crypto = require('crypto');

const common_routes = require('./common_route');


const login = (req, res)=>{
    let users = req.body.data;
    users = JSON.parse(users);
    users.password = crypto.createHash('sha256').update(users.password).digest('hex');
    
    connection.query('SELECT * FROM users WHERE id = ? AND password = ?;', [users.id, users.password], (err, results)=>{
        if(err){
            console.log(err);
        } else{
            if(results == 0){
                res.send({result: 'fail_1'});
            } else if(req.session.logined){
                res.send({result: 'fail_2'});
            } else{
                req.session.logined = true;
                req.session.user_id = users.id;
                req.session.name = results[0].name;
                req.session.password = results[0].password;
                req.session.phone_number = results[0].phone_number;
                req.session.email = results[0].email;
                req.session.zonecode = results[0].zonecode;
                req.session.address = results[0].address;
                req.session.detail_address = results[0].detail_address;
                req.session.savings = results[0].savings;
                req.session.grade = results[0].grade;
                req.session.use_money = results[0].use_money;
                req.session.saw_products = new Array;
                req.session.cart_products = Array(Array(), Array(), Array(), Array(), Array());

                res.send({result: 'success'});
            }
        }
    })
}

const signup = (req, res)=>{
    let users = req.body.data;
    users = JSON.parse(users);

    connection.query('SELECT * FROM users WHERE id = ?;', users.id, (err, results)=>{
        if(err){
            console.log(err);
            res.send({error:err});
        } else{
            if(results != 0){
                if(results[0].id){
                    res.send({result:'same id exist'});
                }
            } else{
                users.password = crypto.createHash('sha256').update(users.password).digest('hex');
                connection.query('INSERT INTO users SET ?;', users, (err, results)=>{
                    if(err){
                        console.log(err);
                        res.send({error:err});
                    } else{
                        res.send({result:'success'});
                    }
                })
            }
        }
    });
}

const signout = (req, res)=>{
    let result = '';
    let users = req.body.data;
    users = JSON.parse(users);

    if(common_routes.fnc_check_session(req, result) == 'logined'){
        connection.query('DELETE FROM users WHERE id = ?;', users.id, (err) => {
            if (err) {
                console.log(err);
                res.send({ error: err });
            } else {
                req.session.destroy(() => {
                    res.send({result: true});
                })

            }
        })
    } else{
        res.send({result: false});
    }
}

const change_info = (req, res)=>{
    let result = '';
    let id = req.session.user_id;
    let info = req.body.data;
    info = JSON.parse(info);
    info.password = crypto.createHash('sha256').update(info.password).digest('hex');

    if(common_routes.fnc_check_session(req, result) == 'logined'){
        connection.query('UPDATE users SET password=?, phone_number=?, email=?, zonecode=?, address=?, detail_address=? WHERE id=?', 
        [info.password, info.phone_number, info.email, info.zonecode, info.address, info.detail_address, id], (err, results)=>{
            if(err){
                console.log(err);
                res.send({error:err});
            } else{
                req.session.password = info.password;
                req.session.phone_number = info.phone_number;
                req.session.email = info.email;
                req.session.zonecode = info.zonecode;
                req.session.address = info.address;
                req.session.detail_address = info.detail_address;
                res.send({result: true});
            }
        })
    } else{
        res.send({result: false});
    }


}

module.exports.login = login;
module.exports.signup = signup
module.exports.signout = signout;
module.exports.change_info = change_info;