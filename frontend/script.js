const API_BASE_URL = "http://127.0.0.1:8000/api";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const searchInput = document.querySelector('.input-field input');
const darkModeBtn = document.querySelector('header .theme-mode-btns .dark-mode');
const lightModeBtn = document.querySelector('header .theme-mode-btns .light-mode');
const searchMovieListContainer = document.querySelector('.search-movie-list-container');
const movieContainer = document.querySelector('.movie-container');
const castContainer = document.querySelector('.movie-container .cast-details-container');
const castDetailsContainer = document.querySelector('.movie-container .cast-details-container .cast-details');


const clearGenresList = (genresList) => {
    Array.from(genresList.children).forEach(child => {
        child.remove();
    });
};


const clearCastDetailsContainer = () => {
    Array.from(castDetailsContainer.children).forEach(child => {
        child.remove();
    });
};


const addCastToCastDetailsContainer = async (movieId) => {
    clearCastDetailsContainer();

    try {
        const response = await fetch(
            `${API_BASE_URL}/movies/${movieId}/credits`
        );

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        const castDetails = data.cast.slice(0, 10);

        if (castDetails.length !== 0) {
            castContainer.style.display = 'block';
        } else {
            castContainer.style.display = 'none';
        }

        castDetails.forEach(castObj => {
            const cast = document.createElement('div');
            const img = document.createElement('img');
            const p = document.createElement('p');

            cast.classList.add('cast');

            img.src = castObj.profile_path !== null
                ? `${IMAGE_BASE_URL}${castObj.profile_path}`
                : "./images/gray background.jpg";

            img.setAttribute('alt', `${castObj.name} Image`);
            p.textContent = castObj.name;

            cast.append(img, p);
            castDetailsContainer.appendChild(cast);
        });

    } catch (error) {
        console.error("Failed to fetch cast:", error);
        castContainer.style.display = 'none';
    }
};


const showMovieDetails = (movieObj) => {
    return async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/movies/${movieObj.id}`
            );

            if (!response.ok) {
                throw new Error(`Backend returned ${response.status}`);
            }

            const movie = await response.json();

            const movieImageURL = movie.poster_path !== null
                ? `${IMAGE_BASE_URL}${movie.poster_path}`
                : "./images/gray background.jpg";

            const movieName = movie.title;

            const releaseYear = movie.release_date
                ? `(${movie.release_date.substring(0, 4)})`
                : "";

            const originalTitle = movie.original_title;
            const ratings = movie.vote_average.toFixed(1);
            const movieDescription = movie.overview;

            const movieImageElement =
                document.querySelector(
                    '.movie-details-container .movie-image img'
                );

            const movieNameElement =
                document.querySelector(
                    '.movie-details-container .movie-details .movie-name'
                );

            const originalTitleElement =
                document.querySelector(
                    '.movie-details-container .movie-details .movie-original-name span'
                );

            const ratingsElement =
                document.querySelector(
                    '.movie-details-container .movie-details .ratings span'
                );

            const movieDescriptionElement =
                document.querySelector(
                    '.movie-details-container .movie-details .description'
                );

            const genresList =
                document.querySelector(
                    '.movie-details-container .movie-details .genres .genres-list'
                );

            movieImageElement.src = movieImageURL;
            movieNameElement.textContent = `${movieName} ${releaseYear}`;
            originalTitleElement.textContent = originalTitle;
            ratingsElement.textContent = ratings;
            movieDescriptionElement.textContent = movieDescription;

            clearGenresList(genresList);

            if (movie.genres) {
                movie.genres.forEach(genre => {
                    const li = document.createElement('li');
                    li.textContent = genre.name;
                    genresList.appendChild(li);
                });
            }

            await addCastToCastDetailsContainer(movie.id);

            movieContainer.style.display = "block";
            searchMovieListContainer.style.display = "none";
            clearSearchMovieListContainer();
            searchInput.value = "";

        } catch (error) {
            console.error("Failed to fetch movie details:", error);
        }
    };
};


const clearSearchMovieListContainer = () => {
    Array.from(searchMovieListContainer.children).forEach(child => {
        child.remove();
    });
};


const buildSearchMovieList = (moviesList) => {
    if (searchInput.value !== "") {
        searchMovieListContainer.style.display = "block";
    } else {
        searchMovieListContainer.style.display = "none";
    }

    clearSearchMovieListContainer();

    moviesList.forEach(movie => {
        const p = document.createElement('p');

        p.textContent = movie.title;
        searchMovieListContainer.appendChild(p);

        p.addEventListener('click', showMovieDetails(movie));
    });
};


const searchMovie = async () => {
    const query = searchInput.value.trim();

    if (query === "") {
        clearSearchMovieListContainer();
        searchMovieListContainer.style.display = "none";
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/movies/search?query=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();

        buildSearchMovieList(data.results.slice(0, 10));

    } catch (error) {
        console.error("Failed to search movies:", error);
    }
};


const toggleTheme = (e) => {
    if (lightModeBtn.style.display !== "none") {
        darkModeBtn.style.display = "block";
        lightModeBtn.style.display = "none";
    } else {
        darkModeBtn.style.display = "none";
        lightModeBtn.style.display = "block";
    }

    if (lightModeBtn.style.display !== "none") {
        const root = document.documentElement;

        root.style.setProperty('--body-bg-color', "#fff");
        root.style.setProperty('--movie-search-bg-color', "#fff");
        root.style.setProperty('--logo-color', "#000");
        root.style.setProperty('--secondary-text-color', "#000");
        root.style.setProperty('--primary-text-color', "#d6078e");
        root.style.setProperty('--primary-border-color', "#d9008d");

    } else {
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