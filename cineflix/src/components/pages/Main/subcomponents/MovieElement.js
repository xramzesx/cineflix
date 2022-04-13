import { Link } from 'react-router-dom';
import './MovieComponent.scss'
import { basename } from '../../../../Settings.json'

const MovieElement = props => {

    const { id, title, poster_ext } = props.movie || {}

    return (
        <Link 
            className="movie__element" 
            to={`${basename}movie/${id}`}
        >
            <img src={`${basename}api/posters/${id}.${poster_ext}`} alt={title} title={title}/>
            <div className="movie__info">
                <h3> {title} </h3>
            </div>
        </Link>
    )
}

export default MovieElement