import './MovieComponent.scss'

const MovieListElement = props => {
    const { id, title, poster_ext } = props.movie || {}

    return (
        <div className="movie--subsection">
            <div className="subsection movie--poster">
                <img src={`/api/posters/${id}.${poster_ext}`} alt={title} title={title}/>

            </div>
            <div className="subsection">
                <h1> {title} </h1>
            </div>
        </div>
    )
}

export default MovieListElement