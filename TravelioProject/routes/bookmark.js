const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');


router.get('/all', function (req, res) {
    //query
    connection.query('SELECT * FROM bookmarks ORDER BY id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } 
        
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Bookmarks Not Found!',
            })
        }
        
        else {
            return res.status(200).json({
                status: true,
                message: 'List Data Bookmarks',
                data: rows
            })
        }
    });
});


router.post('/save', [

    body('judul').notEmpty(),
    body('thumbnail').notEmpty(),
    body('author').notEmpty(),
    body('rating').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        judul: req.body.judul,
        thumbnail: req.body.thumbnail,
        author: req.body.author,
        rating: req.body.rating
    }

    // insert query
    connection.query('INSERT INTO bookmarks SET ?', formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(201).json({
                status: true,
                message: 'Insert Data Successfully',
                data: rows[0]
            })
        }
    })

});


router.delete('/delete/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM bookmarks WHERE id = ${id}`, function(err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Deleted Data Successfully!',
            })
        }
    })
});


module.exports = router;