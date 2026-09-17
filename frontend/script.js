const API_BASE_URL = "http://127.0.0.1:8000/api";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// ============================================================
// Elementos DOM
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

// ============================================================
// Autenticação
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

```
showLoginBtn.classList.add('active');
showRegisterBtn.classList.remove('active');

loginMessage.textContent = '';
registerMessage.textContent = '';
```

};

const showRegisterForm = () => {
loginForm.style.display = 'none';
registerForm.style.display = 'block';

```
showLoginBtn.classList.remove('active');
showRegisterBtn.classList.add('active');

loginMessage.textContent = '';
registerMessage.textContent = '';
```

};

const updateAuthenticationUI = (user) => {
if (user) {
loginBtn.style.display = 'none';
userControls.style.display = 'flex';

```
    usernameDisplay.textContent = user.username;

    hideAuthPanel();
} else {
    loginBtn.style.display = 'block';
    userControls.style.display = 'none';

    usernameDisplay.textContent = '';
}
```

};

const fetchCurrentUser = async () => {
const token = getToken();

```
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
```

};

const login = async (event) => {
event.preventDefault();

```
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
```
