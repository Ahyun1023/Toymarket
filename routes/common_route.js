const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();

const check_session = (req, res)=>{
    let result = '';
    if(fnc_check_session(req, result) == 'logined'){
        res.send({result: 'logined'});
    } else{
        res.send({result: 'not_login'});
    }
}

const check_session_count = (req, res)=>{
    let result = '';
    let count = req.body.count;
    if(fnc_check_session(req, result) == 'logined'){
        if(count <= 0 || count > 5){
            res.send({result: 'logined', count: false});
        } else{
            res.send({result: 'logined', count: true});
        }
    } else{
        res.send({result: 'not_login', count: false});
    }
}

const auto_main = (req, res)=>{
    let result = '';
    let products = [];
    connection.query('SELECT * FROM product WHERE id IN (21, 23, 24, 25, 28, 29, 30, 32, 33, 66);',(err, results)=>{
        if(err){
            console.log(err);
        } else{
            products = results;

            fnc_check_session(req, result);
            if(fnc_check_session(req, result) == 'logined'){
                res.send({result: 'logined', products});
            } else{
                res.send({result: 'not_login', products});
            }
        }
    }) 
}

const logout = (req, res)=>{
    let result = '';
    if(fnc_check_session(req, result) == 'logined'){
        req.session.destroy(()=>{
            res.send({result: 'logined'});
        })
    } else{
        res.send({result: 'not_login'});
    }
}

const fnc_check_session = (req, result)=>{
    if(req && req.session && req.session.logined){
        result = 'logined';
    } else{
        result = 'not_login';
    }
    return result;
}

module.exports.auto_main = auto_main;
module.exports.check_session = check_session;
module.exports.check_session_count = check_session_count;
module.exports.logout = logout;
module.exports.fnc_check_session = fnc_check_session;