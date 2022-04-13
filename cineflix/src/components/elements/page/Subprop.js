

const Subprop = ({ title, prop, className }) => {

    return (
        <div className={`subprop ${className || ''}`}>
            <div className="subprop__title">{ title }</div>
            <div className="subprop__prop">{ prop }</div>
        </div>
    )
}

export default Subprop