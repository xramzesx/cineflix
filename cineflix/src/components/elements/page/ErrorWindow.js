import './ErrorWindow.scss'

const ErrorWindow = ({ children, className }) => {

    return  children 
        ? (
            <div className={`error-window ${ className || '' }`}>
                { children }
            </div>
        ) : null

}

export default ErrorWindow