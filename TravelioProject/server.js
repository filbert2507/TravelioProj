const express = require('express');

const connection = require('./config/database');

//init app express
const app = express();

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

    app.get('/setup', async (req,res) => {
        try {
            await connection.query('CREATE TABLE bookmarks ( id SERIAL PRIMARY KEY, Judul VARCHAR(255), Thumbnail text, Author VARCHAR(255), Rating decimal(10,0) )')
            res.status(200).send({ message: "Successfully added table"})
        } catch (err)
        {
            console.log(err)
            res.sendStatus(500)
        }
    })


  const bookmarksRouter = require('./routes/bookmark');
  app.use('/api/bookmarks', bookmarksRouter); 

  const booklistsRouter = require('./routes/booklist');
  app.use('/api/booklists', booklistsRouter); 


const PORT = process.env.PORT || 8020;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}.`)
});

