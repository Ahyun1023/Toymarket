const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();

const crypto = require('crypto');

const login = (req, res)=>{

}

const signup = (req, res)=>{
    let users = req.body.data;
    users = JSON.parse(users);

    users.password = crypto.createHash('sha256').update(users.password).digest('hex');
    connection.query('INSERT INTO users SET ?', users, (err, results)=>{
        if(err){
            console.log(err);
        }
    })
}

module.exports.signup = signup;