const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const cors = require('cors');
const multer = require('multer')
const sizeOf = require('image-size');
const fs = require('fs')
const path = require('path');
const Clipper = require('image-clipper');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { nextTick } = require('process');

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

var connection = mysql.createConnection({
    host: process.env.DB_HOST, //mysql database host name
    user: process.env.DB_USER, //mysql database user name
    password: process.env.DB_PASS, //mysql database password
    database: process.env.DB_DATABASE //mysql database name
});

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]
    if(!token) {
        res.send("No token")
        res.json({auth: false, message: "No token"})
    } else {
        jwt.verify(token, process.env.secret, (err, decoded) => {
            if(err) {
                res.json({auth: false, message: "Failed to authenticate"})
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }


}

app.post('/loggedIn', verifyJWT, function (req, res) {
    res.json({auth: true, message: "User already logged in"})
});

app.post('/login', function (req, res) {
    connection.query(`SELECT * FROM login where user='${req.body.username}' AND password='${req.body.password}'`, function (error, results) {
        if (error) throw error;

        if(results.length > 0) {
            const userData = Object.assign({}, results[0])
            id = userData.user
            const token = jwt.sign({id}, process.env.secret, {
                expiresIn: 3600
            })
            res.json({auth: true, token: token, user: id})
        } else {
            res.json({auth: false, message: "No user exist"})
        }

    });
});
//verifyJWT
app.get('/getPhotos', function (req, res) {
    connection.query('SELECT * FROM images', function (error, results) {
        if (error) throw error;
        res.send(results);
    });
});

app.post('/updatePhotoTitle/', verifyJWT, function (req, res) {
    connection.query(`UPDATE images set title='${req.body.title}' WHERE id='${req.body.id}'`, function (error, results) {
        if (error) throw error;
        res.json({auth: true, results});
    });
});

app.post('/deletePhoto', verifyJWT, function (req, res) {
    fs.unlink('src/Images/uploads/' + req.body.id, (err) => {
        if (err) throw err;
        connection.query(`DELETE FROM images WHERE id='${req.body.id}'`, function (error, results) {
            if (error) throw error;
            // res.send(results);
            res.json({auth: true, results});
        });
    })
});

app.post('/deleteAllPhotos', verifyJWT, function (req, res) {
    var directory = 'src/Images/uploads/'
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
                connection.query(`DELETE FROM images WHERE id='${file}'`, function (error, results) {
                    if (error) throw error;
                });                
            });
        }
    });  
    
    // res.send("200");
    res.json({auth: true, data: "200"});
});

const InsertimagesToDatabase = (file, imagePosition) => {
    return new Promise(function(resolve, reject) {
            connection.query(`INSERT INTO images (id, imgPosition, title) VALUES ('${file.filename}', ${imagePosition}, '')`, function (error, results) {
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
app.post('/uploadPhoto/:number', verifyJWT, function (req, res) {

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

            Promise.all(promiseList).then((result) => {
                res.json({auth: true, data: result});
            })
        })
    })
});


app.get('/getTexts', function (req, res) {
    connection.query('SELECT * FROM text', function (error, results) {
        if (error) throw error;
        res.send(results);
    });
});

app.post('/updatetext/', verifyJWT, function (req, res) {
    var postData = req.body;
    connection.query(`UPDATE text set txt='${req.body.txt}' WHERE id='${req.body.id}'`, function (error, results) {
        if (error) throw error;
        res.json({auth: true, data: results});
    });
});

app.get('/getPdfs', function (req, res) {
    connection.query('SELECT * FROM pdf', function (error, results) {
        if (error) throw error;
        res.send(results);
    });
});

var pdfStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/PdfFiles/')
    },
    filename: function (req, file, cb) {
        cb(null, req.params.year +'.pdf')
    }
})

var uploadPdf = multer({ storage: pdfStorage }).single('file')
app.post('/uploadPdf/:year', verifyJWT, function (req, res) {
    let year = req.params.year
    uploadPdf(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        connection.query(`INSERT INTO pdf (id, name) VALUES ('${year}.jpg', ${year})`, function (error, results) {
            if (error) {
                throw error
            }
            // res.send("200")
            res.json({auth: true, data: "200"});
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
app.post('/uploadPdfImage/:year', verifyJWT, function (req, res) {

    uploadPdfImage(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        Clipper('src/PdfImages/' + req.params.year + '.jpg', function () {
            this.resize(null, 1000)
                .toFile('src/PdfImages/' + req.params.year + '.jpg', (result) => {
                    res.json({auth: true, data: "200"});
                })
        });
        
    })
});

app.post('/deletePdf/:year', function (req, res) {
    fs.unlink('src/PdfFiles/' + req.params.year + '.pdf', (err) => {
        if (err) throw err;
        connection.query(`DELETE FROM pdf WHERE id='${req.params.year}'`, function (error, results) {
            if (error) throw error;

            fs.unlink('src/PdfImages/' + req.params.year + '.jpg', (err) => {
                if (err) throw err;
                // res.send(results);
                res.json({auth: true, data: results});
            });           
        });
    })
});



app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});

