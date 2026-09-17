import { useEffect, useState } from "react";

import {
clearToken,
getCurrentUser,
login,
logout,
register,
} from "./services/api.js";

import Header from "./components/Header.jsx";
import AuthPanel from "./components/AuthPanel.jsx";
import MovieSearch from "./components/MovieSearch.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import MyMovies from "./components/MyMovies.jsx";

function App() {
const [currentUser, setCurrentUser] = useState(null);
const [currentMovie, setCurrentMovie] = useState(null);
const [currentView, setCurrentView] = useState("search");
const [showAuthPanel, setShowAuthPanel] = useState(false);
const [isDarkMode, setIsDarkMode] = useState(false);
const [isInitializing, setIsInitializing] = useState(true);


useEffect(() => {
    const restoreSession = async () => {
        try {
            const user = await getCurrentUser();

            setCurrentUser(user);
        } catch (error) {
            clearToken();
            setCurrentUser(null);
        } finally {
            setIsInitializing(false);
        }
    };

    restoreSession();
}, []);


const handleLogin = async (username, password) => {
    await login(username, password);

    const user = await getCurrentUser();

    setCurrentUser(user);
    setShowAuthPanel(false);
    setCurrentView("search");
};


const handleRegister = async (
    username,
    email,
    password
) => {
    await register(
        username,
        email,
        password
    );
};


const handleLogout = () => {
    logout();

    setCurrentUser(null);
    setCurrentMovie(null);
    setCurrentView("search");
    setShowAuthPanel(false);
};


const handleMovieSelected = (movie) => {
    setCurrentMovie(movie);
    setCurrentView("details");
};


const handleOpenMyMovies = () => {
    setCurrentView("library");
    setCurrentMovie(null);
};


const handleBackToSearch = () => {
    setCurrentView("search");
    setCurrentMovie(null);
};


const toggleTheme = () => {
    setIsDarkMode(
        previousValue => !previousValue
    );
};


if (isInitializing) {
    return (
        <div className="app">
            <p>Carregando...</p>
        </div>
    );
}


return (
    <div
        className={
            isDarkMode
                ? "app dark-theme"
                : "app light-theme"
        }
    >
        <Header
            user={currentUser}
            onLogin={() => setShowAuthPanel(true)}
            onMyMovies={handleOpenMyMovies}
            onLogout={handleLogout}
            onToggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
        />


        {showAuthPanel && (
            <AuthPanel
                onLogin={handleLogin}
                onRegister={handleRegister}
            />
        )}


        {currentView === "search" && (
            <MovieSearch
                onMovieSelected={handleMovieSelected}
            />
        )}


        {currentView === "details" &&
            currentMovie && (
                <MovieDetails
                    movie={currentMovie}
                    currentUser={currentUser}
                    onBack={handleBackToSearch}
                />
            )}


        {currentView === "library" &&
            currentUser && (
                <MyMovies
                    currentUser={currentUser}
                    onMovieSelected={handleMovieSelected}
                    onBack={handleBackToSearch}
                />
            )}
    </div>
);

}

export default App;
