"use strict";
const express = require("express");
const cors = require("cors");
const data = require("./Movie Data/data.json");
const { default: axios } = require("axios");

require("dotenv").config();

const pg = require("pg");
const client = new pg.Client(process.env.DBURL);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3008;
app.get("/", (req, res) => {
  const movie = new Movie(
    data.id,
    data.title,
    data.release_date,
    data.poster_path,
    data.overview
  );
  res.send(movie);
});
app.get("/trending", handleRec);
app.get("/getMovies", getMovie);
app.post("/addMovie", addMovie);
app.get("/getMovies/:id", getMovieById);
// http://localhost:PORT/link/id
app.put("/getMovies/:id", updateMovieById);
app.delete("/getMovies/:id", deleteMovieById);

app.use(errorHandler);

async function handleRec(req, res) {
  const axiosCallApi = await axios.get(
    `${process.env.URL}?api_key=${process.env.APIKEY}`
  );
  Movie.allData = [];
  console.log(axiosCallApi.data.results);
  axiosCallApi.data.results.map(
    (item) =>
      new Movie(
        item.id,
        item.title,
        item.release_date,
        item.poster_path,
        item.overview
      )
  );
  res.status(200).json({
    code: 200,
    movie: Movie.allData,
  });
}

function getMovie(req, res) {
  const sql = `select * from movie_data`;
  client
    .query(sql)
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => {
      errorHandler(err, req, res);
    });
}

function addMovie(req, res) {
  const userInput = req.body;
  const sql = `insert into movie_data (title, release_date, poster_path, overview, comments) values ($1, $2, $3, $4, $5) returning *`;

  const handleValueForUser = [
    userInput.title,
    userInput.release_date,
    userInput.poster_path,
    userInput.overview,
    userInput.comments,
  ];
  client.query(sql, handleValueForUser)
    .then((data) => {
      res.status(201).json(data.rows);
    })
    .catch((err) => errorHandler(err, req, res));
}

function getMovieById(req, res) {
  Movie.allData = [];
  const id = req.params.id;
  const sql = `select * from movie_data where id = ${id}`;
  client.query(sql).then((data) => res.status(200).json(data.rows));
}

function updateMovieById(req, res) {
  const id = req.params.id;
  const newData = req.body;
  const sql = `update movie_data set title = $1 , release_date = $2, poster_path = $3, overview = $4 where id = $5 returning *`;
  const updatedValue = [
    newData.title,
    newData.release_date,
    newData.poster_path,
    newData.overview,
    id,
  ];
  client
    .query(sql, updatedValue)
    .then((data) => res.status(202).json(data.rows));
}

function deleteMovieById(req, res) {
  const id = req.params.id;
  const sql = `delete from movie_data where id = ${id}`;
  client
    .query(sql)
    .then((data) =>
      res.status(204).json({
        code: 204,
        message: `row deleted successfully with id : ${id}`,
      })
    )
    .catch((err) => errorHandler(err, req, res));
}

function errorHandler(err, req, res) {
  res.status(500).json({
    code: 500,
    message: err.message || err,
  });
}

function Movie(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
  Movie.allData.push(this);
}

Movie.allData = [];

client
  .connect()
  .then(() => {
    app.listen(PORT, () => console.log(`listening to port ${PORT}`));
  })
  .catch((err) => console.log(err));