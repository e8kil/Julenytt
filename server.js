const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const cors = require('cors');
const multer = require('multer')
const sizeOf = require('image-size');
const fs = require('fs')
const path = require('path');
const Clipper = require('image-clipper');

const port = 3000;

// define application
const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

Clipper.configure({
    canvas: require('canvas')
});

//start mysql connection
var connection = mysql.createConnection({
    host: 'localhost', //mysql database host name
    user: 'root', //mysql database user name
    password: '', //mysql database password
    database: 'julenytt' //mysql database name
});

app.post('/login', function (req, res) {
    console.log(req.body.username)
    connection.query(`SELECT COUNT(*) AS count FROM login where user='${req.body.username}' AND password='${req.body.password}'`, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

app.get('/getPhotos', function (req, res) {
    connection.query('SELECT * FROM images', function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

app.post('/updatePhotoTitle/', function (req, res) {
    connection.query(`UPDATE images set title='${req.body.title}' WHERE id='${req.body.id}'`, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

app.post('/deletePhoto', function (req, res) {
    fs.unlink('src/Images/uploads/' + req.body.id, (err) => {
        if (err) throw err;
        connection.query(`DELETE FROM images WHERE id='${req.body.id}'`, function (error, results, fields) {
            if (error) throw error;
            res.send(results);
        });
    })
});

app.post('/deleteAllPhotos', function (req, res) {
    var directory = 'src/Images/uploads/'
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            console.log(file)
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
                connection.query(`DELETE FROM images WHERE id='${file}'`, function (error, results, fields) {
                    if (error) throw error;
                });                
            });
        }
    });  
    
    res.send("200");
});

const InsertimagesToDatabase = (file, imagePosition) => {
    return new Promise(function(resolve, reject) {
            connection.query(`INSERT INTO images (id, imgPosition, title) VALUES ('${file.filename}', ${imagePosition}, '')`, function (error, results, fields) {
                if (error) {
                    reject()
                    throw error;
                }
                
                sizeOf('src/Images/uploads/' + file.filename, function (err, dimensions) {
                    try {
                        if (dimensions.width > dimensions.height) {
                            Clipper('src/Images/uploads/' + file.filename, function () {
                                this.resize(1000)
                                .toFile('src/Images/uploads/' + file.filename, (res) => {
                                    resolve()
                                })
                            })
                        } else {
                            Clipper('src/Images/uploads/' + file.filename, function () {
                                this.resize(null, 1000)
                                .toFile('src/Images/uploads/' + file.filename, (res) => {
                                    resolve()
                                })
                            });
                        }
                    } catch (e) {
                        try{
                            Clipper('src/Images/uploads/' + file.filename, function () {
                                this.resize(null, 700)
                                .toFile('src/Images/uploads/' + file.filename, (res) => {
                                    resolve()
                                })
                            });
                        } catch(e) {
                            reject()
                        }
                    }
                })
            });
        // })
    })
}

var uploadStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/Images/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({ storage: uploadStorage }).array('file') 
app.post('/uploadPhoto/:number', function (req, res) {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        return new Promise((resolve, reject) => {
            let promiseList = res.req.files.map((file, index) => {
                return InsertimagesToDatabase(file, req.params.number)
            })

            Promise.all(promiseList).then((result) => {console.log("done"); res.send(result)})
        })
    })
});


app.get('/getTexts', function (req, res) {
    connection.query('SELECT * FROM text', function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

app.post('/updatetext/', function (req, res) {
    var postData = req.body;
    console.log("body", postData)
    connection.query(`UPDATE text set txt='${req.body.txt}' WHERE id='${req.body.id}'`, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

app.get('/getPdfs', function (req, res) {
    connection.query('SELECT * FROM pdf', function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

var pdfStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/PdfFiles/')
    },
    filename: function (req, file, cb) {
        console.log(req.params.year)
        cb(null, req.params.year +'.pdf')
    }
})

var uploadPdf = multer({ storage: pdfStorage }).single('file')
app.post('/uploadPdf/:year', function (req, res) {
    let year = req.params.year
    uploadPdf(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        connection.query(`INSERT INTO pdf (id, name) VALUES ('${year}.jpg', ${year})`, function (error, results, fields) {
            if (error) {
                throw error
            }
            res.send("200")
        }) 
    })
});

var pdfImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/PdfImages/')
    },
    filename: function (req, file, cb) {
        cb(null, req.params.year + '.jpg')
    }
})

var uploadPdfImage = multer({ storage: pdfImageStorage }).single('file')
app.post('/uploadPdfImage/:year', function (req, res) {

    uploadPdfImage(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        console.log("uploaded!")

        Clipper('src/PdfImages/' + req.params.year + '.jpg', function () {
            this.resize(null, 1000)
                .toFile('src/PdfImages/' + req.params.year + '.jpg', (result) => {
                    res.send("200")
                })
        });
        
    })
});

app.post('/deletePdf/:year', function (req, res) {
    fs.unlink('src/PdfFiles/' + req.params.year + '.pdf', (err) => {
        if (err) throw err;
        connection.query(`DELETE FROM pdf WHERE id='${req.params.year}'`, function (error, results, fields) {
            if (error) throw error;

            fs.unlink('src/PdfImages/' + req.params.year + '.jpg', (err) => {
                if (err) throw err;
                res.send(results);
            });           
        });
    })
});



app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});

// var http = require("http");
// var express = require('express');
// var app = express();
// var mysql = require('mysql');
// var bodyParser = require('body-parser');

// //start mysql connection
// var connection = mysql.createConnection({
//     host: 'localhost', //mysql database host name
//     user: 'root', //mysql database user name
//     password: '', //mysql database password
//     database: 'julenytt' //mysql database name
// });

// connection.connect(function (err) {
//     if (err) throw err
//     console.log('You are now connected...')
// })
// //end mysql connection


// //end body-parser configuration

// //create app server
// var server = app.listen(3000, "127.0.0.1", function () {

//     var host = server.address().address
//     var port = server.address().port

//     console.log("Example app listening at http://%s:%s", host, port)

// });

// //start body-parser configuration
// app.use(bodyParser.json());       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));


// app.post('/api/sayHello', (request, response) => {
//     let a = request.body.a;
//     let b = request.body.b;

//     console.log("a: " + a)

//     let c = parseInt(a) + parseInt(b);
//     response.send('Result : ' + c);
//     console.log('Result : ' + c);
// });



//rest api to get all results
// app.get('/login', function (req, res) {
//     connection.query(`SELECT COUNT(*) AS count FROM login where user='${req.query.username}' AND password='${req.query.password}'`, [req.params.id], function (error, results, fields) {
//         if (error) throw error;
//         res.end(JSON.stringify(results));
//     });
// });

// //rest api to get all results
// app.get('/getPhotos', function (req, res) {
//     connection.query('SELECT * FROM images', function (error, results, fields) {
//         if (error) throw error;
//         res.send(results);
//     });
// });

// //rest api to get a single employee data
// app.get('/getTexts', function (req, res) {
//     connection.query('select * from text', function (error, results, fields) {
//         if (error) throw error;
//         res.send(results);
//     });
// });

// // //rest api to create a new record into mysql database
// // app.post('/employees', function (req, res) {
// //     var postData = req.body;
// //     connection.query('INSERT INTO employee SET ?', postData, function (error, results, fields) {
// //         if (error) throw error;
// //         res.end(JSON.stringify(results));
// //     });
// // });

// //rest api to update record into mysql database
// app.put('/updatetext', function (req, res) {
//     var postData = req.body.id;
//     console.log("body", postData)
//     connection.query('UPDATE text set txt=' + req.body.txt + ' WHERE id=' + req.body.id + '', function (error, results, fields) {
//         if (error) throw error;
//         res.send(results);
//     });
// });




// //rest api to delete record from mysql database
// app.delete('/employees', function (req, res) {
//     console.log(req.body);
//     connection.query('DELETE FROM `employee` WHERE `id`=?', [req.body.id], function (error, results, fields) {
//         if (error) throw error;
//         res.end('Record has been deleted!');
//     });
// });


// const http = require("http");
// const express = require('express');
// const mysql = require('mysql');
// const cors = require('cors')
// var bodyParser = require('body-parser');

// // Create connection
// const db = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '',
//     database : 'julenytt'
// });

// // Connect
// db.connect((err) => {
//     if(err){
//         throw err;
//     }
//     console.log('MySql Connected...');
// });

// const app = express();
// app.use(cors())

// //start body-parser configuration
// app.use(bodyParser.json());       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));

// // Select posts
// app.get('/login', (req, res) => {
//     console.log(req.query.username)
//     let sql = `SELECT COUNT(*) AS count FROM login where user='${req.query.username}' AND password='${req.query.password}'`;
//     let query = db.query(sql, (err, results) => {
//         if (err) throw err;
//         res.send(results);
//     });
// });

// // Select posts
// app.get('/getPhotos', (req, res) => {
//     let sql = 'SELECT * FROM images';
//     let query = db.query(sql, (err, results) => {
//         if(err) throw err;
//         res.send(results);
//     });
// });

// // Get edit
// app.get('/getEdit', (req, res) => {
//     let sql = 'SELECT * FROM edit';
//     let query = db.query(sql, (err, results) => {
//         if (err) throw err;
//         console.log(results);
//         res.send(results);
//     });
// });

// // Select number of view
// app.get('/getNumberOfViews', (req, res) => {
//     let sql = 'SELECT * FROM numviews';
//     let query = db.query(sql, (err, results) => {
//         if (err) throw err;
//         console.log(results);
//         res.send(results);
//     });
// });

// // Select pdfs
// app.get('/getPdfs', (req, res) => {
//     let sql = 'SELECT * FROM pdf';
//     let query = db.query(sql, (err, results) => {
//         if (err) throw err;
//         console.log(results);
//         res.send(results);
//     });
// });

// // Select texts
// app.get('/getTexts', (req, res) => {
//     let sql = 'SELECT * FROM text';
//     let query = db.query(sql, (err, results) => {
//         if (err) throw err;
//         res.send(results);
//     });
// });


// // Select texts
// app.put('/updateText', (req, res) => {
//     var postData = req.body;
//     console.log(postData)
//     // let sql = 'UPDATE text set txt='+req.body.txt+' WHERE id='+req.body.id+'';
//     // let query = db.query(sql, (err, results) => {
//     //     if (err) throw err;
//     //     res.send(results);
//     // });
// });


// //rest api to create a new record into mysql database
// app.post('/updateText', function (req, res) {
//     var postData = req.body;
//     console.log(postData)
//     let sql = 'UPDATE text set txt=' + req.body.txt + ' WHERE id=' + req.body.id + '';
//     let query = db.query(sql, (err, results) => {
//         if (err) throw err;
//         res.send(results);
//     });
// });

// app.listen('3000', () => {
//     console.log('Server started on port 3000');
// });