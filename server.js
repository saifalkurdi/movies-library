const express = require('express');
const cors = require('cors');
const data = require('./Movie Data/data.json')


const app = express()

function Movie (title, genre_ids,original_language,original_title, poster_path,video,vote_average,overview,release_date, vote_count, id, adult, backdrop_path, popularity, media_type ){
  this.title = title;
  this.genre_ids = genre_ids;
  this.original_language = original_language;
  this.original_title = original_title;
  this.poster_path = poster_path;
  this.video = video;
  this.vote_average = vote_average;
  this.overview = overview;
  this.release_date = release_date;
  this.vote_count = vote_count;
  this.id = id;
  this.adult = adult;
  this.backdrop_path = backdrop_path;
  this.popularity = popularity;
  this.media_type = media_type;

  
  }

  function notFoundPage(req,res){
    res.status(404).json({
      code:404,
      responseText: 'Page Not FOund'
    })
  }

  function handle500Error(err, req, res) {
    res.status(500).json({
      code : 500,
      responseText : 'Sorry, something went wrong'
    })
  }
  

app.get('/', (req, res)=>{
  const movie = new Movie(data.title, data.genre_ids, data.original_language, data.original_title, data.poster_path, data.video,data.vote_average, data.overview, data.release_date, data.vote_count, data.id, data.adult, data.backdrop_path, data.popularity, data.media_type )
res.send(movie)
})

app.get('/favorite', (req,res)=>{
res.send('Welcome to Favorite Page')
})

app.get('*', notFoundPage)

app.use(handle500Error);



app.listen(3000, () => console.log(`Up and running on port 3000`))

