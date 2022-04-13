import { Link } from 'react-router-dom'
import './interactive.scss'

const Button = props => {

    const { 
        name,
        className,
        link
    } = props

    return link
    ? (
        <Link 
            { ...props }
            to={link}
            className={`button button--link ${ className || ''}`}
        >
            { name }
        </Link>
    )
    :
    (
        <button 
            {...props} 
            className={`button ${ className || '' }`} 
        >
            { name }
        </button>
    )
}

export default Button