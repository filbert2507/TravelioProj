const express = require('express');
const router = express.Router();
const axios = require('axios');

const bodyParser = require('body-parser')

const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

router.get('/:filter', (req, res) => {
    const filter = req.params.filter;
    axios.get('https://www.googleapis.com/books/v1/volumes?q=%7B' + filter)
    .then(response => {
        // Access the response data
        const responseData = response.data;
        res.json(response.data);
        // Process the response data here
    })
    .catch(error => {
        // Handle any errors
        res.status(500).json({ message: error })
    });
    
  });


module.exports = router;