import { useEffect, useState } from "react";

import { searchMovies } from "../services/api.js";

function MovieSearch({
onMovieSelected,
}) {
const [query, setQuery] = useState("");
const [movies, setMovies] = useState([]);
const [showResults, setShowResults] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery === "") {
        setMovies([]);
        setShowResults(false);
        setIsLoading(false);
        setError("");

        return;
    }

    let cancelled = false;

    const search = async () => {
        setIsLoading(true);
        setError("");

        try {
            const data = await searchMovies(
                trimmedQuery
            );

            if (cancelled) {
                return;
            }

            const results = Array.isArray(data.results)
                ? data.results.slice(0, 10)
                : [];

            setMovies(results);
            setShowResults(true);

        } catch (searchError) {
            if (cancelled) {
                return;
            }

            console.error(
                "Failed to search movies:",
                searchError
            );

            setMovies([]);
            setShowResults(false);

            setError(
                searchError.message ||
                "Falha ao pesquisar filmes."
            );

        } finally {
            if (!cancelled) {
                setIsLoading(false);
            }
        }
    };


    const timeoutId = setTimeout(
        search,
        300
    );


    return () => {
        cancelled = true;
        clearTimeout(timeoutId);
    };
}, [query]);


const handleMovieSelected = (movie) => {
    onMovieSelected(movie);

    setQuery("");
    setMovies([]);
    setShowResults(false);
    setError("");
};


const handleBlur = () => {
    setTimeout(() => {
        setShowResults(false);
    }, 150);
};


return (
    <div className="input-field">

        <input
            type="text"
            value={query}
            placeholder="Insira o Nome do Filme ..."
            onChange={(event) =>
                setQuery(event.target.value)
            }
            onFocus={() => {
                if (movies.length > 0) {
                    setShowResults(true);
                }
            }}
            onBlur={handleBlur}
            aria-label="Pesquisar filmes"
        />


        {showResults && (
            <div className="search-movie-list-container">

                {isLoading && (
                    <p>
                        Pesquisando...
                    </p>
                )}


                {!isLoading &&
                    movies.length === 0 &&
                    !error && (
                        <p>
                            Nenhum filme encontrado.
                        </p>
                    )}


                {!isLoading &&
                    movies.map((movie) => (
                        <p
                            key={movie.id}
                            onMouseDown={() =>
                                handleMovieSelected(
                                    movie
                                )
                            }
                        >
                            {movie.title}
                        </p>
                    ))
                }

            </div>
        )}


        {error && (
            <p className="search-error">
                {error}
            </p>
        )}

    </div>
);

}

export default MovieSearch;
