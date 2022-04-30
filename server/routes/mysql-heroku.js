const mysql = require('mysql');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
//const bodyparser = require('body-parser');
//app.use(bodyparser.json());
const router = express.Router();

// const { ensureAuthenticated, forwardAuthenticated } = require('../configs/auth');
// router.use(ensureAuthenticated , function( req, res, next ) {
//   next();
// });


function createConnect(){
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
    });
}

//Get all chungtu
router.get('/chungtu', (req, res) => {
    var query = 'SELECT * FROM ctuktoan' ;
    var mysqlConnection = createConnect();
    mysqlConnection.connect((err) => {
        if (!err){
            mysqlConnection.query(query, (err, rows, fields) => {
                mysqlConnection.destroy()
                if (!err) {
                    res.render('pages/listchtu_sql', {
                        chungtus: rows // Mảng cả table
                    });
                    // res.send(rows);
                }else {
                    req.flash('error_msg','You are Read Chứng từ ERROR...');
                    //res.render('pages/dashboard');
                    res.send(err.sqlMessage);
                    console.log(err);
                }
            });
        } else {
            console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
        }

    });

});

//Get an chungtu ID
router.get('/chungtu/:id', (req, res) => {
    var query = 'SELECT * FROM ctuktoan  WHERE id = '+ req.params.id ;
    var mysqlConnection = createConnect();
    mysqlConnection.connect((err) => {
        if (!err){
            mysqlConnection.query(query, (err, rows, fields) => {
                mysqlConnection.destroy()
                if(req.params.id =="0"){  // Insert new
                    rows.ngay = new Date();
                    res.render("pages/addchtu_sql", {
                        chungtu: rows,
                        btndisabled: 'disabled'
                    });
            
                } else {   // update old
                 // res.send(rows)
                  res.render("pages/addchtu_sql", {
                        chungtu: rows[0],
                        btndisabled: ''
                      })
                }

            });
        } else {
            console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
        }

    });

});

//Delete an chungtu
router.delete('/chungtu/:id', (req, res) => {
    var mysqlConnection = createConnect();
    mysqlConnection.query('DELETE FROM ctuktoan WHERE id = ?', [req.params.id], (err, rows, fields) => {
        mysqlConnection.destroy()
        if (!err) {
            req.flash('success_msg','You are Detele Chứng từ successfully...');
            res.redirect('/mysql/chungtu')
        }
        if (err) req.flash('error_msg','You are Delete Chứng từ ERROR...');

    })
});

//Insert an chungtu
router.post('/chungtu', (req, res) => {
    var mysqlConnection = createConnect();
    mysqlConnection.connect((err) => {
        if (!err){
            if("addnew" in req.body ){  // Insert new - 'addnew': is name  of  button submit
                var ctid = (Date.parse(new Date())/1000).toString().substring(2, 10);
                var query= 'INSERT INTO ctuktoan (soct, ngay, diengiai, tkno, tkco, sotien,ngaytt,ngaytra,loaitien,ngoaite,userid,matkno,matkco,hopdong,nhom,ghichu,khac,sodk,mamauhd,ctid)  VALUES ("'+req.body.soct+'","'+req.body.ngay +'","'+req.body.diengiai +'","'+req.body.tkno +'","'+req.body.tkco +'", '+req.body.sotien +',"0001-01-01","0001-01-01","001",0,0,"","","","","","","","","'+ctid+'")';
                //res.send(query);
                mysqlConnection.query(query, (err, rows, fields) => {
                    mysqlConnection.destroy()
                    if (!err) {
                        delete req.body.addnew ;
                        req.body.id = rows.insertId ;
                        //console.log(req.body)
                        req.flash('success_msg','You are Add New Chứng từ successfully...');
                        res.redirect('/mysql/chungtu/0')
                    }
                    if (err) req.flash('error_msg','You are Add New Chứng từ ERROR...');
                });
        
            } else {   // update old
                var query= 'UPDATE ctuktoan SET soct = "'+ req.body.soct+'", ngay = "'+ req.body.ngay +'", diengiai = "'+ req.body.diengiai +'", tkno = "'+ req.body.tkno +'", tkco = "'+ req.body.tkco +'", sotien = '+ req.body.sotien +' WHERE id='+req.body.id ;
                 //res.send(query);
                mysqlConnection.query(query, (err, rows, fields) => {
                    mysqlConnection.destroy()
                    if (!err) {
                        req.flash('success_msg','You are Update Chứng từ successfully...');
                        res.redirect('/mysql/chungtu')
                    }
                    if (err) req.flash('error_msg','You are Update Chứng từ ERROR...');
                });

            }
        } else {
            console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
        }
    });
});

//==============================================


//Get all customer
router.get('/customer', (req, res) => {
    var query = 'SELECT * FROM customer' ;
    var mysqlConnection = createConnect();
    mysqlConnection.connect((err) => {
        if (!err){
            mysqlConnection.query(query, (err, rows, fields) => {
                mysqlConnection.destroy()
                if (!err) {
                    res.render('pages/listcust_sql', {
                        customers: rows // Mảng cả table
                    });
                    // res.send(rows);
                }else {
                    req.flash('error_msg','You are Read Customer ERROR...');
                    //res.render('pages/dashboard');
                    res.send(err.sqlMessage);
                    console.log(err);
                }
            });
        } else {
            console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
        }

    });

});

//Get an customer
router.get('/customer/:id', (req, res) => {
    var query = 'SELECT * FROM customer  WHERE id = '+ req.params.id ;
    var mysqlConnection = createConnect();
    mysqlConnection.connect((err) => {
        if (!err){
            mysqlConnection.query(query, (err, rows, fields) => {
                mysqlConnection.destroy()
                if(req.params.id =="0"){  // Insert new
                    res.render("pages/addcust_sql", {
                        customer: rows,
                        btndisabled: 'disabled'
                    });
            
                } else {   // update old
                // res.send(rows)
                  res.render("pages/addcust_sql", {
                        customer: rows[0],
                        btndisabled: ''
                      })
                }

            });
        } else {
            console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
        }

    });

});

//Delete an customer
router.delete('/customer/:id', (req, res) => {
    var mysqlConnection = createConnect();
    mysqlConnection.query('DELETE FROM customer WHERE id = ?', [req.params.id], (err, rows, fields) => {
        mysqlConnection.destroy()
        if (!err) {
            req.flash('success_msg','You are Detele Customer successfully...');
            res.redirect('/mysql/customer')
        }
        if (err) req.flash('error_msg','You are Delete Customer ERROR...');

    })
});

//Insert an customer
router.post('/customer', (req, res) => {
    var mysqlConnection = createConnect();
    mysqlConnection.connect((err) => {
        if (!err){


            // (`id`, `fullname`, `name`, `company`, `address`, `email`, `phone1`, `phone2`, `fax1`, `ghichu`, `group_id`, `maso`, `account`, `bank`, `citibank`, `makhach`) 

            if("addnew" in req.body ){  // Insert new - 'addnew': is name  of  button submit
                var query= 'INSERT INTO customer (`id`, `fullname`, `name`, `company`, `address`, `email`, `phone1`, `phone2`, `fax1`, `ghichu`, `group_id`, `maso`, `account`, `bank`, `citibank`, `makhach`) '+
                'VALUES (null,"","","'+req.body.company+'","'+req.body.address+'","","","","","'+req.body.ghichu+'","","'+req.body.maso+'","","","",""'+')';
                // res.send(query);
                mysqlConnection.query(query, (err, rows, fields) => {
                    mysqlConnection.destroy()
                    if (!err) {
                        delete req.body.addnew ;
                        req.body.id = rows.insertId ;
                        //console.log(req.body)
                        req.flash('success_msg','You are Add New Customer successfully...');
                        res.redirect('/mysql/customer/0')
                    }
                    if (err) req.flash('error_msg','You are Add New Customer ERROR...');
                });
        
            } else {   // update old
                var query= 'UPDATE customer SET company = "'+ req.body.company+'", address = "'+ req.body.address +'", maso = "'+ req.body.maso +'", ghichu = "'+ req.body.ghichu +'" WHERE id='+req.body.id ;
                
                // res.send(query);

                mysqlConnection.query(query, (err, rows, fields) => {
                    mysqlConnection.destroy()
                    if (!err) {
                        req.flash('success_msg','You are Update Customer successfully...');
                        res.redirect('/mysql/customer')
                    }
                    if (err) req.flash('error_msg','You are Update Customer ERROR...');
                });

            }
        } else {
            console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
        }
    });
});

//Update an customer
router.put('/customer', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL customerAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});




module.exports = router;