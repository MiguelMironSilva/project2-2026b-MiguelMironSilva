import { useEffect, useState } from "react";

import {
getMovieState,
updateMovieState,
} from "../services/api.js";

const EMPTY_STATE = {
favorite: false,
watched: false,
rating: null,
};

function MovieControls({
movie,
currentUser,
}) {
const [movieState, setMovieState] = useState(
EMPTY_STATE
);

const [isLoading, setIsLoading] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [error, setError] = useState("");


useEffect(() => {
    let cancelled = false;


    const loadState = async () => {
        if (!movie?.id || !currentUser) {
            setMovieState(EMPTY_STATE);
            setError("");
            return;
        }


        setIsLoading(true);
        setError("");


        try {
            const state = await getMovieState(
                movie.id
            );


            if (cancelled) {
                return;
            }


            setMovieState({
                favorite: Boolean(state.favorite),
                watched: Boolean(state.watched),
                rating:
                    state.rating === null
                        ? null
                        : Number(state.rating),
            });

        } catch (loadError) {
            if (cancelled) {
                return;
            }


            console.error(
                "Failed to load movie state:",
                loadError
            );


            setMovieState(EMPTY_STATE);

            setError(
                loadError.message ||
                "Falha ao carregar o estado do filme."
            );

        } finally {
            if (!cancelled) {
                setIsLoading(false);
            }
        }
    };


    loadState();


    return () => {
        cancelled = true;
    };
}, [movie, currentUser]);


const saveState = async (changes) => {
    if (!currentUser || !movie?.id) {
        return;
    }


    setIsSaving(true);
    setError("");


    try {
        const updatedState =
            await updateMovieState(
                movie.id,
                changes
            );


        setMovieState({
            favorite: Boolean(
                updatedState.favorite
            ),
            watched: Boolean(
                updatedState.watched
            ),
            rating:
                updatedState.rating === null
                    ? null
                    : Number(
                        updatedState.rating
                    ),
        });

    } catch (saveError) {
        console.error(
            "Failed to save movie state:",
            saveError
        );

        setError(
            saveError.message ||
            "Falha ao salvar a alteração."
        );

    } finally {
        setIsSaving(false);
    }
};


const toggleFavorite = () => {
    saveState({
        favorite: !movieState.favorite,
    });
};


const toggleWatched = () => {
    saveState({
        watched: !movieState.watched,
    });
};


const handleRatingChange = (event) => {
    const value = event.target.value;


    saveState({
        rating:
            value === ""
                ? null
                : Number(value),
    });
};


const controlsDisabled =
    !currentUser ||
    isLoading ||
    isSaving;


return (
    <div className="user-movie-controls">

        <button
            type="button"
            onClick={toggleFavorite}
            disabled={controlsDisabled}
            aria-pressed={movieState.favorite}
        >
            {movieState.favorite
                ? "Favoritado"
                : "Favoritar"}
        </button>


        <button
            type="button"
            onClick={toggleWatched}
            disabled={controlsDisabled}
            aria-pressed={movieState.watched}
        >
            {movieState.watched
                ? "Assistido"
                : "Marcar como assistido"}
        </button>


        <label htmlFor="user-rating">
            Sua Avaliação:
        </label>


        <select
            id="user-rating"
            value={
                movieState.rating === null
                    ? ""
                    : movieState.rating
            }
            onChange={handleRatingChange}
            disabled={controlsDisabled}
        >
            <option value="">
                Sem Avaliação
            </option>

            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
        </select>


        {isLoading && (
            <span className="movie-controls-status">
                Carregando...
            </span>
        )}


        {isSaving && (
            <span className="movie-controls-status">
                Salvando...
            </span>
        )}


        {error && (
            <span className="movie-controls-error">
                {error}
            </span>
        )}

    </div>
);

}

export default MovieControls;
