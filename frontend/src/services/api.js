const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL ||
"http://127.0.0.1:8000/api";

// ============================================================
// TOKEN STORAGE
// ============================================================

const TOKEN_KEY = "access_token";

export const getToken = () => {
return sessionStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
sessionStorage.removeItem(TOKEN_KEY);
};

// ============================================================
// REQUEST HELPERS
// ============================================================

const getAuthHeaders = () => {
const token = getToken();


if (!token) {
    return {};
}

return {
    Authorization: `Bearer ${token}`,
};


};

const parseResponse = async (response) => {
const contentType =
response.headers.get("content-type") || "";


let data = null;

if (contentType.includes("application/json")) {
    data = await response.json();
} else {
    data = await response.text();
}

if (!response.ok) {
    const message =
        typeof data === "object" && data?.detail
            ? Array.isArray(data.detail)
                ? data.detail
                    .map(error => error.msg)
                    .join(", ")
                : data.detail
            : `Request failed with status ${response.status}`;

    throw new Error(message);
}

return data;


};

// ============================================================
// AUTHENTICATION
// ============================================================

export const register = async (
username,
email,
password
) => {
const response = await fetch(
`${API_BASE_URL}/auth/register`,
{
method: "POST",


        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            username,
            email,
            password,
        }),
    }
);

return parseResponse(response);


};

export const login = async (
username,
password
) => {
const formData = new URLSearchParams();


formData.append(
    "grant_type",
    "password"
);

formData.append(
    "username",
    username
);

formData.append(
    "password",
    password
);

const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
        method: "POST",

        headers: {
            "Content-Type":
                "application/x-www-form-urlencoded",
        },

        body: formData,
    }
);

const data = await parseResponse(response);

setToken(data.access_token);

return data;

};

export const getCurrentUser = async () => {
const response = await fetch(
`${API_BASE_URL}/auth/me`,
{
headers: {
...getAuthHeaders(),
},
}
);


return parseResponse(response);


};

export const logout = () => {
clearToken();
};

// ============================================================
// MOVIES
// ============================================================

export const searchMovies = async (query) => {
const response = await fetch(
`${API_BASE_URL}/movies/search?query=${encodeURIComponent(query)}`
);


return parseResponse(response);


};

export const getMovie = async (tmdbId) => {
const response = await fetch(
`${API_BASE_URL}/movies/${encodeURIComponent(tmdbId)}`
);


return parseResponse(response);


};

export const getMovieCredits = async (tmdbId) => {
const response = await fetch(
`${API_BASE_URL}/movies/${encodeURIComponent(tmdbId)}/credits`
);


return parseResponse(response);


};

// ============================================================
// USER MOVIE STATE
// ============================================================

export const getMovieState = async (tmdbId) => {
const response = await fetch(
`${API_BASE_URL}/my-movies/${encodeURIComponent(tmdbId)}`,
{
headers: {
...getAuthHeaders(),
},
}
);


return parseResponse(response);


};

export const updateMovieState = async (
tmdbId,
changes
) => {
const response = await fetch(
`${API_BASE_URL}/my-movies/${encodeURIComponent(tmdbId)}`,
{
method: "PATCH",


        headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
        },

        body: JSON.stringify(changes),
    }
);

return parseResponse(response);


};

export const deleteMovieState = async (tmdbId) => {
const response = await fetch(
`${API_BASE_URL}/my-movies/${encodeURIComponent(tmdbId)}`,
{
method: "DELETE",


        headers: {
            ...getAuthHeaders(),
        },
    }
);

return parseResponse(response);


};

export const getMyMovies = async () => {
const response = await fetch(
`${API_BASE_URL}/my-movies/`,
{
headers: {
...getAuthHeaders(),
},
}
);


return parseResponse(response);


};
