import './Overlay.scss'

const Overlay = ({ show, children, className }) => {

    return (
        <div className={`overlay${ show ? " overlay--show" : "" } ${className || ""}`}>
            {children}
        </div>
    )
}

export default Overlay