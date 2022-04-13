import { Component } from "react"
import Form from "../../../../elements/form/form"
import Select from "../../../../elements/form/select"
import Textbox from "../../../../elements/form/textbox"
import Add from "./Add"
import ErrorWindow from '../../../../elements/page/ErrorWindow'
import Overlay from '../../../../elements/page/Overlay'

import { 
    basename,
    openHours
} from '../../../../../Settings.json'
import Subprop from "../../../../elements/page/Subprop"
import Button from "../../../../elements/interactive/button"

const AddSeance = class extends Component {

    constructor ( props ) {
        super ( props )

        this.state = {
            //// FETCHED ////
            movies : [],
            informations : [],
            seances : [],
            message : "",
            //// FETCHED CONTROLS ////
            fetchSeancesOk : true,
            insertedId : -1,

            //// FORM ////
            
            movie : "",     // id
            date : "",
            time : "",
            information : "",   // info id

            //// FORM VALIDATION ////
            timeValid : true,
            collisions : [],
            openHours : true,
            
            //// FORM INTERACTIONS /////
            formDisabled : false,
            movieLength : 0,
            success : false
        }

    }

    componentDidMount = async () => {
        //// FETCHING DATA ////
        try{
            const response = await ( await fetch(`${basename}api/utilities/movies`)).json()
    
            if ( +response.code === 200 && !response.error )
                await this.setState({
                    movies : response.movies,
                    informations : response.informations,
                    information : response.informations[0].id,
                    movie : response.movies[0].id,
                    movieLength : response.movies[0].length
                })
            console.log(response)
        } catch {
            console.log('problem with fetching')
        }
    }

    fetchSeances = async date => {
        this.setState({
            formDisabled : true
        })

        await this.setState({
            date
        })

        const data = new FormData()
        data.append('date', this.state.date )

        try {
            const response = await (await fetch( `${ basename }api/utilities/seances`, {
                method : "post",
                body : data
            })).json()

            if ( response.code == 200 ) {
                if ( response.ok ) {
                    await this.setState({
                        fetchSeancesOk : response.ok,
                        seances : response.seances
                    })
                } else {
                    await this.setState({
                        fetchSeancesOk : response.ok,
                        message : response.status || ""
                    })
                }

            } else {
                this.setState({
                    message : response.message || ""
                })
            }


            console.log(response)
        } catch (error) {
            console.log("problem with fetching")
        }

        await this.setState({
            formDisabled : false
        }, () => this.validateSeanceTime( this.state.time ))
    }

    handleChange = async (e, name) => {
        console.log(e.target.value)

        // eval( `this.setState({
        //     ${name} : \`${e.target.value.split('\\').filter( el => el != "").join('\\\\').split(/'/)}\`
        // })`)

        

        switch (name) {
            case "date":
                this.fetchSeances( e.target.value )
                // this.validateSeanceTime( this.state.time )
                break;
        
            case "movie":
                const movieLength = this.state.movies.find( movie => movie.id == e.target.value )
                console.log("dl filmu",movieLength)
                
                await this.setState({
                    [name] : e.target.value,
                    movieLength : movieLength.length || 0
                }, () => this.validateSeanceTime( this.state.time ) )

                break
            case "time":
                
                const isValidSeanceTime = this.validateSeanceTime( e.target.value )

            default:
                this.setState({
                    [name] : e.target.value
                })
                break;
        }

        // if ( name == "date" ) {
        // } else {
        // }


        console.log({ [name] : e.target.value })

        console.log( this.state[name], name )
    }

    handleSubmit = async e => {
        e.preventDefault()

        this.setState({
            formDisabled : true
        })
        
        if ( this.state.timeValid ) {
            const data = new FormData()
            console.log(this.state)
            data.append('movie', this.state.movie)
            data.append('date', this.state.date)
            data.append('time', this.state.time)
            data.append('info', this.state.information)
    
            const response = await ( await fetch(`${basename}api/add/seance`,{
                method : "post",
                body : data
            })).json()
            
            if ( +response.code == 200 ) {
                if ( response.ok ) {
                    this.setState({
                        success : response.ok,
                        insertedId : response.insertedID
                    })
                } else {
                    this.setState({
                        success : response.ok,
                        message : response.status
                    })
                }
            } else {
                this.setState({
                    message : response.message
                })
            }

            console.log(response)
        } else {
            await this.setState({
                message : "Podaj niekolidującą godzine seansu, będącą równocześnie w czasie pracy kina"
            })
        }

        await this.setState({
            formDisabled : false
        })

    }

    isBetween = ( value, from, to ) => value >= from && value <= to

    validateSeanceTime = (stime, slength = this.state.movieLength ) => {
        
        if ( stime !== '' && stime !== undefined ) {
    
            //// NEW SEANCE EDGE TIMES ////
            const seanceStartTime = +this.timeToMinutes( stime )
            const seanceEndTime = seanceStartTime + ( +slength )
            

            //// CINEMA OPEN HOURS ////
            const { start, end } = openHours
            const oStart = +start * 60
            const oEnd = +end * 60
    
            let isInOpenHours = true
    
            //// VALIDATE OPEN HOURS ////
            // if ( 
            //     oStart > seanceStartTime 
            // ||  oEnd < seanceStartTime
            // ||  oEnd < seanceEndTime
            // ) {
            //     // this.setState({
            //     //     collisions : [],
            //     //     timeValid : false
            //     // })
            //     console.log('czy powinno?')
            //     isInOpenHours = false
            //     // return false
            // }
    
            if ( 
                !this.isBetween( 
                    seanceStartTime, oStart, oEnd
                ) || !this.isBetween(
                    seanceEndTime, oStart, oEnd
                )
            ) {
                isInOpenHours = false
            }


            //// COLLISIONS DETECTIONS ////
            let isColliding = false
            const collisions = []
    
    
            for ( const { time, length, id, title } of this.state.seances ) {
                const startTime = +this.timeToMinutes( time )
                const endTime = startTime + ( +length )
                let colliding = false
    
    
                console.log(
                    time,
                    this.isBetween( seanceStartTime, startTime, endTime ),
                    this.isBetween ( startTime, seanceStartTime, seanceEndTime)
                )

                if ( this.isBetween( seanceStartTime, startTime, endTime ) )
                    colliding = true
                if ( this.isBetween ( startTime, seanceStartTime, seanceEndTime) )
                    colliding = true

                // if ( this.isBetween( seanceStartTime, startTime, endTime ) )
                //     colliding = true
                
                // if ( this.isBetween( seanceEndTime, startTime, endTime ) )
                //     colliding = true
                
                // if ( this.isBetween ( startTime, seanceStartTime, seanceEndTime ) )
                //     colliding = true
                
                // if ( this.isBetween( endTime, seanceStartTime, seanceEndTime ) )
                //     colliding = true
    
                // if ( seanceStartTime  )
    
    
                // if ( startTime <= seanceEndTime ) {
                //     if ( endTime >= seanceStartTime )
                //         colliding = true    
                // }
    
                if (colliding)
                    collisions.push( { id, title, time, length } )
                console.log( startTime )
            }
    
            const isAllOk = collisions.length == 0 && isInOpenHours
    
            this.setState({
                timeValid : isAllOk,
                openHours : isInOpenHours,
                collisions,
            })
    
            return isAllOk
        }

        this.setState({
            timeValid : false,
            openHours : true,
            collisions : []
        })

        return false
    }


    timeToMinutes = time => {
        const regex = /(\d\d)+/g

        const matched = time.match(regex)
        // console.log(time.match(regex))

        return +matched[0] * 60 + ( +matched[1] )
    }


    minutesToTime = (minutes, full = true) => {
        const phours =  this.zerofill( ((minutes - (minutes % 60) ) / 60 ) % 24) 
        const pminutes = this.zerofill( minutes % 60 )

        return `${ phours }:${ pminutes }${full ? ":00" : ""}`
    }


    getEndTime = ( time, length ) => {
        const startMinutes = this.timeToMinutes( time )

        console.log('minuty',startMinutes)
        return this.minutesToTime( startMinutes + (+length) )
    }


    zerofill = numb => {
        let number = +JSON.parse(JSON.stringify( numb ))

        if ( number < 0 )
            number = -number
        if ( number < 10 )
            return `0${number}`
        else
            return `${number}`
    }

    refreshData = async () => {
        await this.fetchSeances( this.state.date )
        await this.setState({ success : false, message : "" })
    }

    render () {
        // console.log( +this.props.type )

        // console.log("siemaaaa", +this.props.type)

        if ( +this.props.type !== 0) {
            return <Add/>
        }
    
        return (
            <>
                <h2> Dodaj seans </h2>
                <p> Godziny otwarcia : <span className={this.state.openHours ? "" : "time-invalid"}> { this.minutesToTime(openHours.start * 60, false) } - { this.minutesToTime(openHours.end * 60,false) } </span>  </p>
                <Form
                    method="POST"
                    submitValue="Dodaj"
                    onSubmit={ this.handleSubmit }
                    className="subsection__form"
                    disabled={ this.state.formDisabled }
                >
                    {/* Dodać jeszcze automatyczną */}
                    <ErrorWindow> 
                        {this.state.message}
                    </ErrorWindow>
                    <div className="section__row">
                        <Select
                            label="film"
                            name="movie"
                            className="textbox--fill"
                            options={ this.state.movies.map( ({ id, title }) => { return { name : title, value : id } }  ) }
                            onChange={ this.handleChange }
                            required
                        />
                        <Textbox
                            label="dzień"
                            name="date"
                            onChange={ this.handleChange }
                            className="textbox--fill"
                            type="date"
                            required
                        />
                    </div>
                    {
                        this.state.fetchSeancesOk ? this.state.date.length ? (
                            <div className="section--seances-table">
                                <h2> Seanse {this.state.date} </h2>
                                {
                                    this.state.seances.length ? (

                                        <table>
                                            <thead>
                                                <tr>
                                                    <th> Seans </th>
                                                    <th> Tytuł </th>
                                                    <th> Długość </th>
                                                    <th> Rozpoczęcie </th>
                                                    <th> Zakończenie </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { 
                                                    this.state.seances.map( ({ id, title, time, length }, i) => (
                                                        <tr key={ i }>
                                                            <td> { id } </td>
                                                            <td> { title } </td>
                                                            <td> { length } </td>
                                                            <td> { time } </td>
                                                            <td> { this.getEndTime ( time , length ) } </td>
                                                        </tr>
                                                    )) 
                                                }
                                            </tbody>
                                        </table>
                                    ) : ( <h1> nie znaleziono żadnego seansu </h1> )
                                }
                            </div>
                        ) : (
                            <div className="section--seances-table">
                                <h2> Wybierz datę seansu </h2>    
                            </div>
                        ) : ( 
                            <div className="section--seances-table"> 
                                <h2> Wpisz poprawną datę </h2> 
                            </div> 
                        )
                    }

                    <div className="section__row">
                        <Select
                            label="informacje dodatkowe"
                            name="information"
                            className="textbox--fill"
                            options={ this.state.informations.map( 
                                ({ id, name }) => { return { name : name, value : id } }
                            )}
                            onChange={ this.handleChange }
                            required
                        />
                        <Textbox
                            label="godzina"
                            name="time"
                            onChange={ this.handleChange }
                            className="textbox--fill"
                            type="time"
                            required
                        />
                    </div>
                    <div className="section__row" >
                        <Subprop
                            title="Długość filmu"
                            prop={ this.state.movieLength }
                        />
                        <Subprop
                            title="Koniec filmu"
                            prop={ this.state.time.length ? this.getEndTime ( this.state.time , +this.state.movieLength) : "nie wybrano godziny"}
                            className={ this.state.timeValid ? "" : "time-invalid" }
                        />
                    </div>
                    {
                        this.state.timeValid ? null : (
                            <div className="section--seances-table"> 

                                {
                                    this.state.collisions.length ? (
                                        <>
                                        <h2 className="time-invalid"> Kolizje </h2>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th> Seans </th>
                                                    <th> Tytuł </th>
                                                    <th> Rozpoczęcie </th>
                                                    <th> Zakończenie </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { 
                                                    this.state.collisions.map( ({ id, title, time, length }, i) => (
                                                        <tr key={ i } className="time-invalid">
                                                            <td> { id } </td>
                                                            <td> { title } </td>
                                                            <td> { time } </td>
                                                            <td> { this.getEndTime ( time , length ) } </td>
                                                        </tr>
                                                    )) 
                                                }
                                            </tbody>
                                        </table>
                                        </>
                                    ) : null
                                }
                            </div> 
                        )
                    }
                </Form>
                <Overlay show={ this.state.success }>
                    <div>
                        <h1> Sukces! </h1>
                        <p> Udało się dodać seans o id : </p>
                        <h2>{ this.state.insertedId }</h2>
                        <Button
                            name="Dodaj kolejny seans"
                            onClick={ this.refreshData }
                        />
                    </div>
                </Overlay>
            </>
        )
    }
}

export default AddSeance