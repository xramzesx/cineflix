import './Wildcard.scss'

const Wildcard = props => {

    let url = props.match ? props.match.path : props.url
    document.title = "404 | Cineflix"

    return (
        <div className="content content--no-padding wildcard">
            <h1 className="wildcard__code"> 404 </h1>
            <div className="wildcard__message">
                <h3 className="wildcard__content">Nie znaleziono strony :</h3>
                <pre className="wildcard__path"> { window.location.hostname + window.location.pathname} </pre>
            </div>
        </div>
    )
}

export default Wildcard