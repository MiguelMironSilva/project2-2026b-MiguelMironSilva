function Header({
user,
onLogin,
onMyMovies,
onLogout,
onToggleTheme,
isDarkMode,
}) {
return ( <header> <div className="logo"> <img
                 src="/images/JioCinema Logo.png"
                 alt="JioCinema Logo"
             />

            <p>Miguel Cinema</p>
        </div>

        <div className="header-controls">

            <div className="account-controls">

                {user ? (
                    <div
                        id="user-controls"
                        className="logged-in-controls"
                    >
                        <span id="username-display">
                            {user.username}
                        </span>

                        <button
                            type="button"
                            onClick={onMyMovies}
                        >
                            Meus Filmes
                        </button>

                        <button
                            type="button"
                            onClick={onLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        id="login-btn"
                        type="button"
                        onClick={onLogin}
                    >
                        Login
                    </button>
                )}

            </div>

            <div className="theme-mode-btns">

                <button
                    type="button"
                    className="theme-toggle"
                    onClick={onToggleTheme}
                    aria-label={
                        isDarkMode
                            ? "Mudar para modo claro"
                            : "Mudar para modo escuro"
                    }
                >
                    <i
                        className={
                            isDarkMode
                                ? "fa-solid fa-toggle-on"
                                : "fa-solid fa-toggle-off"
                        }
                    ></i>
                </button>

            </div>

        </div>
    </header>
);


}

export default Header;
