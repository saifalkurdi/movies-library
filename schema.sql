create table if not exists movie_data(
  id serial primary key ,
  title varchar(255),
  release_date varchar(255),
  poster_path varchar(1000),
  overview varchar (1500),
  comments varchar(255)
); 

insert into movie_data (title, release_date, poster_path, overview, comments) values('test',45,'anything','http://google.com', 'test comments')