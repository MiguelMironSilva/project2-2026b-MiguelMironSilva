// API Key
const API_KEY = "35a13243cc51617756240cd4b86cae9d";
const baseURL = "https://image.tmdb.org/t/p/w500";

// API Path
const apiPaths = {
    searchMovie: (query) => `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}`,
    findGenres: `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
    findCast: (movie_id) => `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${API_KEY}`
}

const searchInput = document.querySelector('.input-field input');
const darkModeBtn = document.querySelector('header .theme-mode-btns .dark-mode');
const lightModeBtn = document.querySelector('header .theme-mode-btns .light-mode');
const searchMovieListContainer = document.querySelector('.search-movie-list-container');
const movieContainer = document.querySelector('.movie-container');
const castContainer = document.querySelector('.movie-container .cast-details-container');
const castDetailsContainer = document.querySelector('.movie-container .cast-details-container .cast-details');

const findGenres = async (genre_ids) => {
    const genres = [];

    const res = fetch(apiPaths.findGenres);
    
    try {
        const res_1 = await res;
        const res_2 = await res_1.json();
        genre_ids.forEach(genre_id => {
            for (let obj of res_2.genres) {
                if (genre_id == obj.id) {
                    genres.push(obj.name);
                    break;
                }
            }
        });
        return genres;
    } 
    catch(error) {
        console.log(error);
    }
};

const clearGenresList = (genresList) => {
    Array.from(genresList.children).forEach(children => {
        children.remove();
    });
};

const clearCastDetailsContainer = (genresList) => {
    Array.from(castDetailsContainer.children).forEach(children => {
        children.remove();
    });
};

const addCastToCastDetailsContainer = async (movieId) => {
    clearCastDetailsContainer();

    const res = fetch(apiPaths.findCast(movieId));

    try {
        const res_1 = await res;
        const res_2 = await res_1.json();
        const castDetails = res_2.cast.slice(0,10);
        
        if(castDetails.length !== 0) {
            castContainer.style.display = 'block';
        } 
        else {
            castContainer.style.display = 'none';
        }

        castDetails.forEach(castObj => {
            const cast = document.createElement('div');
            const img = document.createElement('img');
            const p = document.createElement('p');

            cast.classList.add('cast');

            img.src = castObj.profile_path !== null ? baseURL + castObj.profile_path : "./images/gray background.jpg";
            img.setAttribute('alt', `${castObj.name} Image`);
            p.textContent = castObj.name;

            cast.append(img, p);

            castDetailsContainer.appendChild(cast);
        });
    }
    catch(error) {
        console.log(error);
    }
};

const showMovieDetails = (movieObj) => {
    return (e) => {
        const movieImageURL = movieObj.poster_path !== null ? baseURL + movieObj.poster_path : "./images/gray background.jpg";
        const movieName = movieObj.title;
        const releaseYear = "(" + movieObj.release_date.substring(0,4) + ")";
        const originalTitle = movieObj.original_title;
        const ratings = movieObj.vote_average.toFixed(1);
        const movieDescription = movieObj.overview;

        const movieImageElement = document.querySelector('.movie-details-container .movie-image img');
        const movieNameElement = document.querySelector('.movie-details-container .movie-details .movie-name');
        const originalTitleElement = document.querySelector('.movie-details-container .movie-details .movie-original-name span');
        const ratingsElement = document.querySelector('.movie-details-container .movie-details .ratings span');
        const movieDescriptionElement = document.querySelector('.movie-details-container .movie-details .description');
        const genresList = document.querySelector('.movie-details-container .movie-details .genres .genres-list');

        movieImageElement.src = movieImageURL;
        movieNameElement.textContent = movieName + " " + releaseYear;
        originalTitleElement.textContent = originalTitle;
        ratingsElement.textContent = ratings;
        movieDescriptionElement.textContent = movieDescription;
        const res = findGenres(movieObj.genre_ids.slice(0,5));
        res
        .then(genres => {
            clearGenresList(genresList);
            genres.forEach(genre => {
                const li = document.createElement('li');
                li.textContent = genre;
                genresList.appendChild(li);
            });
        })
        .catch(error => {
            console.log(error);
        })

        addCastToCastDetailsContainer(movieObj.id);

        movieContainer.style.display = "block";
        searchMovieListContainer.style.display = "none";
        clearSearchMovieListContainer();
        searchInput.value = "";
    }
};

const clearSearchMovieListContainer = () => {
    Array.from(searchMovieListContainer.children).forEach(children => {
        children.remove();
    });
};

const buildSearchMovieList = (moviesList) => {
    if(searchInput.value !== "") {
        searchMovieListContainer.style.display = "block";
    }
    else {
        searchMovieListContainer.style.display = "none";
    }

    clearSearchMovieListContainer();

    moviesList.forEach(movie => {
        const p = document.createElement('p');
        p.textContent = movie.title;
        searchMovieListContainer.appendChild(p);

        p.addEventListener('click', showMovieDetails(movie));
    });
}

const searchMovie = (e) => {
    const res = fetch(apiPaths.searchMovie(searchInput.value));

    res
    .then(res => res.json())
    .then(res => {
        buildSearchMovieList(res.results.slice(0,10));
    })
    .catch(error => {
        console.log(error);
    });
};

const toggleTheme = (e) => {
    if(lightModeBtn.style.display !== "none") {
        darkModeBtn.style.display = "block";
        lightModeBtn.style.display = "none";
    }
    else {
        darkModeBtn.style.display = "none";
        lightModeBtn.style.display = "block";
    }

    if(lightModeBtn.style.display !== "none") {
        const root = document.documentElement;
        root.style.setProperty('--body-bg-color', "#fff");
        root.style.setProperty('--movie-search-bg-color', "#fff");
        root.style.setProperty('--logo-color', "#000");
        root.style.setProperty('--secondary-text-color', "#000");
        root.style.setProperty('--primary-text-color', "#d6078e");
        root.style.setProperty('--primary-border-color', "#d9008d");
    }
    else {
        const root = document.documentElement;
        root.style.setProperty('--body-bg-color', "#200E3A");
        root.style.setProperty('--movie-search-bg-color', "#11235A");
        root.style.setProperty('--logo-color', "#fff");
        root.style.setProperty('--secondary-text-color', "#fff");
        root.style.setProperty('--primary-text-color', "#fc61c6");
        root.style.setProperty('--primary-border-color', "#ff54c3");
    }
};

const hideSearchMovieListContainer = (e) => {
    setTimeout(() => {
        searchMovieListContainer.style.display = "none";
    }, 130);
}; 

searchInput.addEventListener('input', searchMovie);
searchInput.addEventListener('focusout', hideSearchMovieListContainer);
lightModeBtn.addEventListener('click', toggleTheme);
darkModeBtn.addEventListener('click', toggleTheme);