'use strict'
const express = require('express');
const cors = require('cors');
const data = require('./Movie Data/data.json')

require ('dotenv').config();

const app = express()
app.use(cors());

const PORT = process.env.PORT || 3005;


app.get('/rec', handleRec);

function handleRec(req , res){
  data.map(item =>
    new Movie = (data.id, data.title, data.release_date, data.poster_path, data.overview)
    )
    res.status(200).json({
      code :200,
      movie: Movie.allData
    })
}

function Movie (id, title, release_date, poster_path, overview ){
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
  Movie.allData.push(this);
  }

  Movie.allData = [];

  









app.listen(PORT, () => console.log(`Up and running on port ${PORT}`))

