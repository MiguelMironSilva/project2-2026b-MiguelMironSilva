import { useState } from "react";

function AuthPanel({
onLogin,
onRegister,
}) {
const [mode, setMode] = useState("login");


const [loginUsername, setLoginUsername] = useState("");
const [loginPassword, setLoginPassword] = useState("");

const [registerUsername, setRegisterUsername] = useState("");
const [registerEmail, setRegisterEmail] = useState("");
const [registerPassword, setRegisterPassword] = useState("");

const [message, setMessage] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);


const switchToLogin = () => {
    setMode("login");
    setMessage("");
};


const switchToRegister = () => {
    setMode("register");
    setMessage("");
};


const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    try {
        await onLogin(
            loginUsername.trim(),
            loginPassword
        );

        setLoginPassword("");
        setMessage("");

    } catch (error) {
        setMessage(
            error.message || "Falha ao fazer login."
        );

    } finally {
        setIsSubmitting(false);
    }
};


const handleRegister = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    try {
        await onRegister(
            registerUsername.trim(),
            registerEmail.trim(),
            registerPassword
        );

        setLoginUsername(
            registerUsername.trim()
        );

        setRegisterUsername("");
        setRegisterEmail("");
        setRegisterPassword("");

        setMode("login");

        setMessage(
            "Cadastro realizado. Faça login para continuar."
        );

    } catch (error) {
        setMessage(
            error.message ||
            "Falha ao criar a conta."
        );

    } finally {
        setIsSubmitting(false);
    }
};


return (
    <section className="auth-panel">

        <div className="auth-panel-content">

            <div className="auth-tabs">

                <button
                    type="button"
                    className={
                        mode === "login"
                            ? "active"
                            : ""
                    }
                    onClick={switchToLogin}
                    disabled={isSubmitting}
                >
                    Login
                </button>

                <button
                    type="button"
                    className={
                        mode === "register"
                            ? "active"
                            : ""
                    }
                    onClick={switchToRegister}
                    disabled={isSubmitting}
                >
                    Novo Usuario
                </button>

            </div>


            {mode === "login" ? (
                <form onSubmit={handleLogin}>

                    <div className="auth-field">

                        <label htmlFor="login-username">
                            Nome de Usuario ou Email
                        </label>

                        <input
                            id="login-username"
                            type="text"
                            autoComplete="username"
                            value={loginUsername}
                            onChange={(event) =>
                                setLoginUsername(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <div className="auth-field">

                        <label htmlFor="login-password">
                            Senha
                        </label>

                        <input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            value={loginPassword}
                            onChange={(event) =>
                                setLoginPassword(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Entrando..."
                            : "Login"}
                    </button>

                </form>

            ) : (

                <form onSubmit={handleRegister}>

                    <div className="auth-field">

                        <label htmlFor="register-username">
                            Nome de Usuario
                        </label>

                        <input
                            id="register-username"
                            type="text"
                            autoComplete="username"
                            minLength={3}
                            maxLength={30}
                            value={registerUsername}
                            onChange={(event) =>
                                setRegisterUsername(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <div className="auth-field">

                        <label htmlFor="register-email">
                            Email
                        </label>

                        <input
                            id="register-email"
                            type="email"
                            autoComplete="email"
                            value={registerEmail}
                            onChange={(event) =>
                                setRegisterEmail(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <div className="auth-field">

                        <label htmlFor="register-password">
                            Senha
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            maxLength={128}
                            value={registerPassword}
                            onChange={(event) =>
                                setRegisterPassword(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Criando..."
                            : "Novo Usuario"}
                    </button>

                </form>
            )}


            {message && (
                <p className="auth-message">
                    {message}
                </p>
            )}

        </div>

    </section>
);


}

export default AuthPanel;
