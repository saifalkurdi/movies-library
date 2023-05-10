'use strict'
const express = require('express');
const cors = require('cors');
const data = require('./Movie Data/data.json');
const { default: axios } = require('axios');

require ('dotenv').config();

const pg = require('pg')
const client = new pg.Client(process.env.DBURL);

const app = express()
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3005;

app.get('/trending', handleRec);
// app.get('/search', handleSearch);
// app.get('/genres', genres);
// app.get('/discover', discover);
app.get('/getMovies', getMovie);

app.post('/getMovies', addMovie );

app.use(errorHandler);




 async function handleRec(req , res){
  const axiosCallApi = await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`)
  
  axiosCallApi.data.results.map(item =>
    new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview)
    )
 
    res.status(200).json({
      code : 200,
      movie:Movie.allData
    })
}

// function handleSearch(req, res){
//   const searchQuery = req.query.keyword;
//   console.log(searchQuery)
//   axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${searchQuery}&page=2`).then(
//     result => {
//       result.data.results.map(item =>
//         new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview)
//         )
//           res.status(200).json({
//         code : 200,
//         movie : Movie.allData
//       })
//     }
//   )
// }

// function genres (req , res){
//   axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.APIKEY}&language=en-US`).then(
//     result =>{
   
//         res.status(200).json({
//           code : 200,
//           movie : result.data.genres
//     })
//   }
//   )
// }

// function discover (req , res){
//   axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`).then(
//     result => {
//       result.data.results.map(item =>
//         new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview)
//         ).
//           res.status(200).json({
//         code : 200,
//         movie : Movie.allData
//       })
//     }
//   )
// }

function getMovie (req,res) {
  const sql = `select * from movie_data`;
  client.query(sql).then(data =>{
    res.json(data)
  }).catch(err=>{
    errorHandler(err,req,res);
  })
}

function addMovie( req, res){
  const userInput = req.body;
  
  const sql = `insert into movie_data (title, release_date, poster_path, overview) values
  ($1, $2, $3, $4) returning *`;

  const handleValueForUser = [userInput.title, userInput.release_date,userInput.poster_path,userInput.overview];

  client.query(sql, handleValueForUser ).then(data => {
  res.status(201).json(data)
  }).catch(err => errorHandler(err,req,res))
  }

function errorHandler(err ,req ,res){
  res.status(500).json({
    code: 500,
    messege: err.messege || err
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


  






client.connect().then(() =>{
  app.listen(PORT, () => console.log(`Up and running on port ${PORT}`))
})
