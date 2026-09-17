const IMAGE_BASE_URL =
"https://image.tmdb.org/t/p/w500";

function MovieCard({
movie,
state,
onClick,
}) {
const posterUrl = movie.poster_path
? `${IMAGE_BASE_URL}${movie.poster_path}`
: "/images/gray background.jpg";

const statusParts = [];

if (state?.favorite) {
    statusParts.push("Favoritado");
}

if (state?.watched) {
    statusParts.push("Assistido");
}

if (state?.rating !== null &&
    state?.rating !== undefined) {
    statusParts.push(
        `Sua avaliação: ${state.rating}/10`
    );
}


return (
    <article
        className="my-movie-card"
        onClick={onClick}
        tabIndex={0}
        role="button"
        onKeyDown={(event) => {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                onClick();
            }
        }}
    >
        <img
            src={posterUrl}
            alt={`${movie.title} Poster`}
        />

        <h2>
            {movie.title}
        </h2>

        <p>
            {statusParts.length > 0
                ? statusParts.join(" · ")
                : "Nenhum estado salvo"}
        </p>
    </article>
);

}

export default MovieCard;
