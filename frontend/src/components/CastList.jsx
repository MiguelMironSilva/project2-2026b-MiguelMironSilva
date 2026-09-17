const IMAGE_BASE_URL =
"https://image.tmdb.org/t/p/w500";

function CastList({
cast = [],
}) {
if (cast.length === 0) {
return null;
}


return (
    <div className="cast-details-container">

        <h1>Elenco</h1>

        <div className="cast-details">

            {cast.map((person) => {
                const imageUrl = person.profile_path
                    ? `${IMAGE_BASE_URL}${person.profile_path}`
                    : "/images/gray background.jpg";

                return (
                    <div
                        className="cast"
                        key={`${person.id}-${person.cast_id ?? person.order}`}
                    >

                        <img
                            src={imageUrl}
                            alt={`${person.name} Foto`}
                        />

                        <p>
                            {person.name}
                        </p>

                        {person.character && (
                            <span className="cast-character">
                                {person.character}
                            </span>
                        )}

                    </div>
                );
            })}

        </div>

    </div>
);


}

export default CastList;
