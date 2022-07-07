const axios = require('axios').default;
const express = require('express');
const app = express();
const PORT = 9000;

// 80fc0be7bcb18707550c86f288ec17fe

app.set("view engine", "ejs");

app.use((req, _, next) => {
    console.log("new request", req.method, req.url)
    next();
})

app.use(express.static("public"))

app.get("/", (_, res) => {
    Promise.all([
        axios.
            get("https://api.themoviedb.org/3/movie/popular?api_key=80fc0be7bcb18707550c86f288ec17fe&language=en-US&page=1"),
        axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=80fc0be7bcb18707550c86f288ec17fe&language=en-US")
    ]).then(([moviesResponse, genresResponse]) => {
        const movies = moviesResponse.data
        const genres = genresResponse.data
        res.render("pages/home.ejs", { movies, genres })
    })


})

app.get("/details/:movieId", (req, res) => {
    const movieId = req.params.movieId;

    axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=80fc0be7bcb18707550c86f288ec17fe&language=en-US`)
        .then((response) => {
            const detailsMovie = response.data
            res.render("pages/details.ejs", { detailsMovie })
        })

})

app.get("/genre/:genreId", (req, res) => {
    const genreId = req.params.genreId;

    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=80fc0be7bcb18707550c86f288ec17fe&with_genres=${genreId}`)
        .then((response) => {
            const listGenre = response.data
            res.render("pages/genre.ejs", { listGenre })
        })
})


app.listen(PORT, () => { console.log('listening on port ' + PORT) })