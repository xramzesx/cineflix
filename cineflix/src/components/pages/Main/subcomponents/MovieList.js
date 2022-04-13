import { forwardRef } from 'react'
import './MovieComponent.scss'
import MovieListElement from './MovieListElement'

const MovieList =  forwardRef( ( props, ref ) => {
    const { titleClass } = props
    const movies = props.movies || []
    return (
        <>
            <div className={`section ${titleClass}`} ref={ ref }>
                <h1> Wszystkie filmy </h1>
            </div>
            <div className="section movie--all-list">
                { movies.map( (movie, i) => <MovieListElement movie={movie} key={i}/> ) }
            </div>
        </>
    )
})

export default MovieList