import { useEffect, useState } from "react";

import {
getMyMovies,
getMovie,
} from "../services/api.js";

import MovieCard from "./MovieCard.jsx";

function MyMovies({
currentUser,
onMovieSelected,
onBack,
}) {
const [movieEntries, setMovieEntries] = useState([]);
const [filter, setFilter] = useState("all");


const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");


useEffect(() => {
    if (!currentUser) {
        setMovieEntries([]);
        setError("");
        return;
    }

    let cancelled = false;


    const loadLibrary = async () => {
        setIsLoading(true);
        setError("");


        try {
            const states = await getMyMovies();


            if (cancelled) {
                return;
            }


            const entries = await Promise.all(
                states.map(async (state) => {
                    try {
                        const movie = await getMovie(
                            state.tmdb_id
                        );

                        return {
                            movie,
                            state,
                        };

                    } catch (movieError) {
                        console.error(
                            `Failed to load movie ${state.tmdb_id}:`,
                            movieError
                        );

                        return null;
                    }
                })
            );


            if (cancelled) {
                return;
            }


            setMovieEntries(
                entries.filter(
                    entry => entry !== null
                )
            );

        } catch (loadError) {
            if (cancelled) {
                return;
            }

            console.error(
                "Failed to load My Movies:",
                loadError
            );

            setMovieEntries([]);

            setError(
                loadError.message ||
                "Falha ao carregar seus filmes."
            );

        } finally {
            if (!cancelled) {
                setIsLoading(false);
            }
        }
    };


    loadLibrary();


    return () => {
        cancelled = true;
    };
}, [currentUser]);


const filteredEntries =
    movieEntries.filter(({ state }) => {
        if (filter === "favorites") {
            return state.favorite;
        }

        if (filter === "watched") {
            return state.watched;
        }

        return true;
    });


const handleMovieClick = (movie) => {
    onMovieSelected(movie);
};


return (
    <section className="my-movies-section">

        <div className="my-movies-header">

            <h1>My Movies</h1>

            <button
                type="button"
                onClick={onBack}
            >
                Pesquisar
            </button>

        </div>


        <div className="my-movies-filters">

            <button
                type="button"
                className={
                    filter === "all"
                        ? "active"
                        : ""
                }
                onClick={() => setFilter("all")}
            >
                Todos
            </button>

            <button
                type="button"
                className={
                    filter === "favorites"
                        ? "active"
                        : ""
                }
                onClick={() =>
                    setFilter("favorites")
                }
            >
                Favoritados
            </button>

            <button
                type="button"
                className={
                    filter === "watched"
                        ? "active"
                        : ""
                }
                onClick={() =>
                    setFilter("watched")
                }
            >
                Vistos
            </button>

        </div>


        {isLoading && (
            <p className="my-movies-empty">
                Carregando seus filmes...
            </p>
        )}


        {!isLoading && error && (
            <p className="search-error">
                {error}
            </p>
        )}


        {!isLoading &&
            !error &&
            filteredEntries.length === 0 && (
                <p className="my-movies-empty">
                    {filter === "all"
                        ? "Você ainda não salvou nenhum filme."
                        : filter === "favorites"
                            ? "Você não possui filmes favoritados."
                            : "Você não possui filmes marcados como vistos."
                    }
                </p>
            )
        }


        {!isLoading &&
            !error &&
            filteredEntries.length > 0 && (
                <div className="my-movies-list">

                    {filteredEntries.map(
                        ({ movie, state }) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                state={state}
                                onClick={() =>
                                    handleMovieClick(
                                        movie
                                    )
                                }
                            />
                        )
                    )}

                </div>
            )
        }

    </section>
);


}

export default MyMovies;
