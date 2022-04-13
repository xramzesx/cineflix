import { forwardRef, useState } from "react"
import './MovieComponent.scss'
import MovieElement from "./MovieElement"



const MovieComponent = forwardRef(( props , ref ) => {
    const { title, titleClass, grid } = props
    const movies = props.movies || []
    
    return (
        <>
            <div className={`section movie--section ${titleClass || ''}`} ref={ref}>
                <h1> { title } </h1>
            </div>
            <div className={`section--no-padding movie--list${ grid ? " movie--grid" : ""}`}>
                { movies.map( ( movie, i ) => <MovieElement movie={movie} key={i}/>) }
            </div>
        </>
    )
})

export default MovieComponent