const API_BASE_URL = "http://127.0.0.1:8000/api";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// ============================================================
// ELEMENTOS DOM
// ============================================================

const searchInput = document.querySelector('.input-field input');
const searchMovieListContainer = document.querySelector(
'.search-movie-list-container'
);

const movieContainer = document.querySelector('.movie-container');
const castContainer = document.querySelector(
'.movie-container .cast-details-container'
);
const castDetailsContainer = document.querySelector(
'.movie-container .cast-details-container .cast-details'
);

const darkModeBtn = document.querySelector(
'header .theme-mode-btns .dark-mode'
);
const lightModeBtn = document.querySelector(
'header .theme-mode-btns .light-mode'
);

const loginBtn = document.querySelector('#login-btn');
const logoutBtn = document.querySelector('#logout-btn');
const userControls = document.querySelector('#user-controls');
const usernameDisplay = document.querySelector('#username-display');

const authPanel = document.querySelector('#auth-panel');

const showLoginBtn = document.querySelector('#show-login-btn');
const showRegisterBtn = document.querySelector('#show-register-btn');

const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');

const loginUsernameInput = document.querySelector('#login-username');
const loginPasswordInput = document.querySelector('#login-password');

const registerUsernameInput = document.querySelector(
'#register-username'
);
const registerEmailInput = document.querySelector('#register-email');
const registerPasswordInput = document.querySelector(
'#register-password'
);

const loginMessage = document.querySelector('#login-message');
const registerMessage = document.querySelector('#register-message');

const favoriteBtn = document.querySelector('#favorite-btn');
const watchedBtn = document.querySelector('#watched-btn');
const userRating = document.querySelector('#user-rating');

let currentMovieId = null;

let currentMovieState = {
    favorite: false,
    watched: false,
    rating: null,
};

const myMoviesBtn = document.querySelector('#my-movies-btn');
const closeMyMoviesBtn = document.querySelector('#close-my-movies-btn');

const myMoviesSection = document.querySelector('#my-movies-section');
const myMoviesList = document.querySelector('#my-movies-list');
const myMoviesEmpty = document.querySelector('#my-movies-empty');

const filterAllBtn = document.querySelector('#filter-all-btn');
const filterFavoritesBtn = document.querySelector('#filter-favorites-btn');
const filterWatchedBtn = document.querySelector('#filter-watched-btn');

let myMovies = [];
let currentMyMoviesFilter = 'all';

// ============================================================
// AUTENTICAÇÃO
// ============================================================

const getToken = () => {
return sessionStorage.getItem('access_token');
};

const setToken = (token) => {
sessionStorage.setItem('access_token', token);
};

const removeToken = () => {
sessionStorage.removeItem('access_token');
};

const showAuthPanel = () => {
authPanel.style.display = 'block';
};

const hideAuthPanel = () => {
authPanel.style.display = 'none';
};

const showLoginForm = () => {
loginForm.style.display = 'block';
registerForm.style.display = 'none';

showLoginBtn.classList.add('active');
showRegisterBtn.classList.remove('active');

loginMessage.textContent = '';
registerMessage.textContent = '';


};

const showRegisterForm = () => {
loginForm.style.display = 'none';
registerForm.style.display = 'block';

showLoginBtn.classList.remove('active');
showRegisterBtn.classList.add('active');

loginMessage.textContent = '';
registerMessage.textContent = '';


};

const updateAuthenticationUI = (user) => {
    if (user) {
        loginBtn.style.display = 'none';
        userControls.style.display = 'flex';

        usernameDisplay.textContent = user.username;

        hideAuthPanel();

        if (currentMovieId !== null) {
            loadMovieState(currentMovieId);
        }

    } else {
        loginBtn.style.display = 'block';
        userControls.style.display = 'none';

        usernameDisplay.textContent = '';

        myMovies = [];
        hideMyMoviesSection();
        clearMyMoviesList();
        myMoviesEmpty.style.display = 'none';

        resetMovieState();
        setMovieControlsEnabled(false);
    }
};

const fetchCurrentUser = async () => {
const token = getToken();


if (!token) {
    updateAuthenticationUI(null);
    return;
}

try {
    const response = await fetch(
        `${API_BASE_URL}/auth/me`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Backend returned ${response.status}`
        );
    }

    const user = await response.json();

    updateAuthenticationUI(user);

} catch (error) {
    console.error(
        'Failed to fetch current user:',
        error
    );

    removeToken();
    updateAuthenticationUI(null);
}

};

const resetMovieState = () => {
    currentMovieState = {
        favorite: false,
        watched: false,
        rating: null,
    };

    favoriteBtn.textContent = 'Favoritar';
    favoriteBtn.setAttribute('aria-pressed', 'false');

    watchedBtn.textContent = 'Visto';
    watchedBtn.setAttribute('aria-pressed', 'false');

    userRating.value = '';
};


const updateMovieStateUI = () => {
    favoriteBtn.textContent = currentMovieState.favorite
        ? 'Favoritado ✓'
        : 'Favoritar';

    favoriteBtn.setAttribute(
        'aria-pressed',
        String(currentMovieState.favorite)
    );

    watchedBtn.textContent = currentMovieState.watched
        ? 'Visto ✓'
        : 'Ver';

    watchedBtn.setAttribute(
        'aria-pressed',
        String(currentMovieState.watched)
    );

    userRating.value = currentMovieState.rating === null
        ? ''
        : String(currentMovieState.rating);
};


const setMovieControlsEnabled = (enabled) => {
    favoriteBtn.disabled = !enabled;
    watchedBtn.disabled = !enabled;
    userRating.disabled = !enabled;
};


const loadMovieState = async (movieId) => {
    const token = getToken();

    if (!token) {
        resetMovieState();
        setMovieControlsEnabled(false);
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/my-movies/${movieId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (response.status === 401) {
            removeToken();
            updateAuthenticationUI(null);
            resetMovieState();
            setMovieControlsEnabled(false);
            return;
        }

        if (!response.ok) {
            throw new Error(
                `Backend returned ${response.status}`
            );
        }

        const state = await response.json();

        currentMovieState = {
            favorite: state.favorite,
            watched: state.watched,
            rating: state.rating,
        };

        updateMovieStateUI();
        setMovieControlsEnabled(true);

    } catch (error) {
        console.error(
            'Failed to fetch movie state:',
            error
        );

        resetMovieState();
        setMovieControlsEnabled(false);
    }
};


const saveMovieState = async (changes) => {
    const token = getToken();

    if (!token || currentMovieId === null) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/my-movies/${currentMovieId}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(changes),
            }
        );

        if (response.status === 401) {
            removeToken();
            updateAuthenticationUI(null);
            resetMovieState();
            setMovieControlsEnabled(false);
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                `Backend returned ${response.status}`
            );
        }

        currentMovieState = {
            favorite: data.favorite,
            watched: data.watched,
            rating: data.rating,
        };

        updateMovieStateUI();

    } catch (error) {
        console.error(
            'Failed to save movie state:',
            error
        );
    }
};

const hideMovieDetails = () => {
    movieContainer.style.display = 'none';
};


const showMyMoviesSection = () => {
    myMoviesSection.style.display = 'block';
    hideMovieDetails();

    searchMovieListContainer.style.display = 'none';
    clearSearchMovieListContainer();
};


const hideMyMoviesSection = () => {
    myMoviesSection.style.display = 'none';
};


const setActiveMyMoviesFilter = (filter) => {
    currentMyMoviesFilter = filter;

    filterAllBtn.classList.toggle(
        'active',
        filter === 'all'
    );

    filterFavoritesBtn.classList.toggle(
        'active',
        filter === 'favorites'
    );

    filterWatchedBtn.classList.toggle(
        'active',
        filter === 'watched'
    );
};


const getFilteredMyMovies = () => {
    switch (currentMyMoviesFilter) {
        case 'favorites':
            return myMovies.filter(
                movie => movie.favorite
            );

        case 'watched':
            return myMovies.filter(
                movie => movie.watched
            );

        default:
            return myMovies;
    }
};


const clearMyMoviesList = () => {
    myMoviesList.innerHTML = '';
};


const createMyMovieCard = (movie, state) => {
    const card = document.createElement('div');
    const image = document.createElement('img');
    const title = document.createElement('h2');
    const status = document.createElement('p');

    card.classList.add('my-movie-card');

    image.src = movie.poster_path !== null
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : './images/gray background.jpg';

    image.alt = `${movie.title} Poster`;

    title.textContent = movie.title;

    const statusParts = [];

    if (state.favorite) {
        statusParts.push('Favorite');
    }

    if (state.watched) {
        statusParts.push('Watched');
    }

    if (state.rating !== null) {
        statusParts.push(`Your rating: ${state.rating}/10`);
    }

    status.textContent = statusParts.length > 0
        ? statusParts.join(' · ')
        : 'No personal status';

    card.append(
        image,
        title,
        status
    );

    card.addEventListener(
        'click',
        showMovieDetails({
            id: movie.id,
        })
    );

    return card;
};


const renderMyMovies = async () => {
    clearMyMoviesList();

    const filteredMovies = getFilteredMyMovies();

    if (filteredMovies.length === 0) {
        myMoviesEmpty.style.display = 'block';
        return;
    }

    myMoviesEmpty.style.display = 'none';

    const movieCards = await Promise.all(
        filteredMovies.map(async state => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/movies/${state.tmdb_id}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Backend returned ${response.status}`
                    );
                }

                const movie = await response.json();

                return createMyMovieCard(
                    movie,
                    state
                );

            } catch (error) {
                console.error(
                    `Failed to fetch movie ${state.tmdb_id}:`,
                    error
                );

                return null;
            }
        })
    );

    movieCards.forEach(card => {
        if (card !== null) {
            myMoviesList.appendChild(card);
        }
    });

    if (myMoviesList.children.length === 0) {
        myMoviesEmpty.textContent =
            'Unable to load your saved movies.';

        myMoviesEmpty.style.display = 'block';
    }
};


const loadMyMovies = async () => {
    const token = getToken();

    if (!token) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/my-movies/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (response.status === 401) {
            removeToken();
            updateAuthenticationUI(null);
            hideMyMoviesSection();
            return;
        }

        if (!response.ok) {
            throw new Error(
                `Backend returned ${response.status}`
            );
        }

        myMovies = await response.json();

        await renderMyMovies();

    } catch (error) {
        console.error(
            'Failed to fetch My Movies:',
            error
        );

        clearMyMoviesList();
        myMoviesEmpty.textContent =
            'Failed to load your movies.';
        myMoviesEmpty.style.display = 'block';
    }
};

const login = async (event) => {
event.preventDefault();

loginMessage.textContent = '';

const username = loginUsernameInput.value.trim();
const password = loginPasswordInput.value;

if (!username || !password) {
    loginMessage.textContent =
        'Please enter your username/email and password.';
    return;
}

try {
    const formData = new URLSearchParams();

    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded',
            },
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || `Login failed (${response.status})`
        );
    }

    setToken(data.access_token);

    loginForm.reset();

    await fetchCurrentUser();

} catch (error) {
    console.error('Login failed:', error);

    loginMessage.textContent = error.message;
}


};

const register = async (event) => {
event.preventDefault();

registerMessage.textContent = '';

const username = registerUsernameInput.value.trim();
const email = registerEmailInput.value.trim();
const password = registerPasswordInput.value;

if (!username || !email || !password) {
    registerMessage.textContent =
        'Please fill in all fields.';
    return;
}

try {
    const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            `Registration failed (${response.status})`
        );
    }

    registerForm.reset();

    loginUsernameInput.value = username;

    showLoginForm();

    loginMessage.textContent =
        'Registration successful. Please log in.';

} catch (error) {
    console.error('Registration failed:', error);

    registerMessage.textContent = error.message;
}


};

const logout = () => {
removeToken();
updateAuthenticationUI(null);
showLoginForm();


loginForm.reset();
registerForm.reset();


};

// ============================================================
// HELPERS
// ============================================================

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

const clearSearchMovieListContainer = () => {
Array.from(searchMovieListContainer.children).forEach(child => {
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
        throw new Error(
            `Backend returned ${response.status}`
        );
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

        img.setAttribute(
            'alt',
            `${castObj.name} Image`
        );

        p.textContent = castObj.name;

        cast.append(img, p);
        castDetailsContainer.appendChild(cast);
    });

} catch (error) {
    console.error(
        "Failed to fetch cast:",
        error
    );

    castContainer.style.display = 'none';
}


};

const showMovieDetails = (movieObj) => {
return async () => {
    hideMyMoviesSection();
    try {
    const response = await fetch(
    `${API_BASE_URL}/movies/${movieObj.id}`
    );


        if (!response.ok) {
            throw new Error(
                `Backend returned ${response.status}`
            );
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

        currentMovieId = String(movie.id);

        await loadMovieState(currentMovieId);

        movieContainer.style.display = "block";
        searchMovieListContainer.style.display = "none";

        clearSearchMovieListContainer();

        searchInput.value = "";

    } catch (error) {
        console.error(
            "Failed to fetch movie details:",
            error
        );
    }
};


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

    p.addEventListener(
        'click',
        showMovieDetails(movie)
    );
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
        throw new Error(
            `Backend returned ${response.status}`
        );
    }

    const data = await response.json();

    buildSearchMovieList(
        data.results.slice(0, 10)
    );

} catch (error) {
    console.error(
        "Failed to search movies:",
        error
    );
}


};

// ============================================================
// TEMA
// ============================================================

const toggleTheme = () => {
if (lightModeBtn.style.display !== "none") {
darkModeBtn.style.display = "block";
lightModeBtn.style.display = "none";
} else {
darkModeBtn.style.display = "none";
lightModeBtn.style.display = "block";
}


if (lightModeBtn.style.display !== "none") {
    const root = document.documentElement;

    root.style.setProperty(
        '--body-bg-color',
        "#fff"
    );

    root.style.setProperty(
        '--movie-search-bg-color',
        "#fff"
    );

    root.style.setProperty(
        '--logo-color',
        "#000"
    );

    root.style.setProperty(
        '--secondary-text-color',
        "#000"
    );

    root.style.setProperty(
        '--primary-text-color',
        "#d6078e"
    );

    root.style.setProperty(
        '--primary-border-color',
        "#d9008d"
    );

} else {
    const root = document.documentElement;

    root.style.setProperty(
        '--body-bg-color',
        "#200E3A"
    );

    root.style.setProperty(
        '--movie-search-bg-color',
        "#11235A"
    );

    root.style.setProperty(
        '--logo-color',
        "#fff"
    );

    root.style.setProperty(
        '--secondary-text-color',
        "#fff"
    );

    root.style.setProperty(
        '--primary-text-color',
        "#fc61c6"
    );

    root.style.setProperty(
        '--primary-border-color',
        "#ff54c3"
    );
}


};

// ============================================================
// BUSCA
// ============================================================

const hideSearchMovieListContainer = () => {
setTimeout(() => {
searchMovieListContainer.style.display = "none";
}, 130);
};

// ============================================================
// LISTENERS
// ============================================================

// Search
searchInput.addEventListener(
'input',
searchMovie
);

searchInput.addEventListener(
'focusout',
hideSearchMovieListContainer
);

// Theme
lightModeBtn.addEventListener(
'click',
toggleTheme
);

darkModeBtn.addEventListener(
'click',
toggleTheme
);

// Authentication
loginBtn.addEventListener(
'click',
() => {
showAuthPanel();
showLoginForm();
}
);

showLoginBtn.addEventListener(
'click',
showLoginForm
);

showRegisterBtn.addEventListener(
'click',
showRegisterForm
);

loginForm.addEventListener(
'submit',
login
);

registerForm.addEventListener(
'submit',
register
);

logoutBtn.addEventListener(
'click',
logout
);

favoriteBtn.addEventListener(
    'click',
    () => {
        saveMovieState({
            favorite: !currentMovieState.favorite,
        });
    }
);


watchedBtn.addEventListener(
    'click',
    () => {
        saveMovieState({
            watched: !currentMovieState.watched,
        });
    }
);


userRating.addEventListener(
    'change',
    () => {
        const rating = userRating.value === ''
            ? null
            : Number(userRating.value);

        saveMovieState({
            rating: rating,
        });
    }
);

myMoviesBtn.addEventListener(
    'click',
    async () => {
        setActiveMyMoviesFilter('all');
        showMyMoviesSection();
        await loadMyMovies();
    }
);


closeMyMoviesBtn.addEventListener(
    'click',
    () => {
        hideMyMoviesSection();
        myMoviesEmpty.style.display = 'none';
        clearMyMoviesList();
    }
);


filterAllBtn.addEventListener(
    'click',
    async () => {
        setActiveMyMoviesFilter('all');
        await renderMyMovies();
    }
);


filterFavoritesBtn.addEventListener(
    'click',
    async () => {
        setActiveMyMoviesFilter('favorites');
        await renderMyMovies();
    }
);


filterWatchedBtn.addEventListener(
    'click',
    async () => {
        setActiveMyMoviesFilter('watched');
        await renderMyMovies();
    }
);

// ============================================================
// INICIALIZAÇÃO
// ============================================================

showAuthPanel();
showLoginForm();

resetMovieState();
setMovieControlsEnabled(false);

fetchCurrentUser();