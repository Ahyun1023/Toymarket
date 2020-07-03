const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();

const search_name = (req, res)=>{
    let search = req.query.search_word;
    let count = 0;
    connection.query('SELECT * FROM product WHERE name LIKE ?;', ['%' + search + '%'], (err, results)=>{
        if(err){
            console.log(err);
        } else{
            count = results.length;
            res.render('search', {result: results, count: count});
        }
    })
}

const search_id = (req, res)=>{
    let bigDivision = req.query.Bid;
    let smallDivision = req.query.Sid;
    let count = 0;
    if(smallDivision == undefined){
        connection.query('SELECT * FROM product WHERE big_division = ?;', bigDivision, (err, results)=>{
            if(err){
                console.log(err);
            } else{
                count = results.length;
                res.render('search', {result: results, count: count});
            }
        })
    } else{
        connection.query('SELECT * FROM product WHERE big_division = ? AND small_division = ?;', [bigDivision, smallDivision], (err, results)=>{
            if(err){
                console.log(err);
            } else{
                count = results.length;
                res.render('search', {result: results, count: count});
            }
        })
    }
}

const search_des = (req, res)=>{
    let bigDivision = req.query.Bid;
    let smallDivision = req.query.Sid;
    console.log(bigDivision);
    console.log(smallDivision);
}

module.exports.search_name = search_name;
module.exports.search_id = search_id;
module.exports.search_des = search_des;