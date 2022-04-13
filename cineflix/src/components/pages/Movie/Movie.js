import Player from "../Main/subcomponents/Player"
// import Reserve from "../Reserve"
import React,{ Component } from 'react'

import Row from '../../elements/page/Row'

import './Movie.scss'
import Subprop from "../../elements/page/Subprop"
import Button from "../../elements/interactive/button"
import Wildcard from "../Wildcard/Wildcard"
import Table from "../../elements/page/Table"
import { Link } from "react-router-dom"

import { basename } from '../../../Settings.json'

const months = [
    'stycznia',
    'lutego',
    'marca',
    'kwietnia',
    'maja',
    'czerwca',
    'lipca',
    'sierpnia',
    'września',
    'października',
    'listopada',
    'grudnia'
]


const Movie = class extends Component {

    //// INFORMACJE O FILMIE
    //// W DALSZEJ CZĘŚCI FETCHUJEMY LISTĘ DOSTĘPNYCH SEANSÓW z godzinami
    //// w formie listy?

    constructor ( props ) {
        super(props)
        this.state = {
            id : this.props.match.params.id,
            title : "",
            description : "",
            trailer : "",
            length : "",
            release_date : "",
            poster_ext : "",

            seances : [],

            ok : true,
            ready : false,
        }

        this.localRefs = {
            description : React.createRef(),
            trailer : React.createRef(),
            reserve : React.createRef()
        }
    }

    componentDidMount = async () => {
        // document.body.scrollTop = 0
        this.localRefs.description.current.scrollIntoView() 
        document.title = "film | Cineflix"

        try {
            // const data = new FormData()

            // data.append( 'id', this.props.match.params.id )

            const response = await ( 
                await fetch(`${basename}api/trivial/movie?id=${ this.props.match.params.id }`)
            ).json()

            if ( +response.code === 200 ) {
                if ( response.ok && response.movie ) {
                    const { 
                        title,
                        description,
                        trailer,
                        length,
                        genre,
                        poster_ext,
                        release_date
                    } = response.movie

                    const { seances } = response
                    document.title = title +" | Cineflix"

                    await this.setState({
                        title : title,
                        genre : genre,
                        description : description ,
                        trailer : trailer,
                        length : length,
                        poster_ext : poster_ext,
                        release_date,
                        ready : true,

                        seances
                    })
                } else {
                    await this.setState({
                        ok : false,
                        ready : true
                    })
                }
                
            } else {
                await this.setState({
                    ok : false,
                    ready : true
                })
            }

            console.log(response)
        } catch (error) {
            console.log('problem with fetching', error)
        }
    }

    formatToDate ( dateStr ) {
        // const date = new Date(dateStr)
     
        const date = dateStr.match(/(\d+)/g)

        return `${+date[2]} ${ months[+date[1] - 1 ] } ${+date[0]}`
        // return `${date.getDay()} ${ months[date.getMonth() ] } ${date.getFullYear()}`

    }

    formatToTime( time ) {
        return `${(time - time % 60)/60}h ${time % 60}m`
    }

    render() {
        const { 
            id,
            title,
            genre,
            description,
            trailer,
            length,
            release_date,
            poster_ext,

            seances
        } = this.state

        const ready = this.state.ready && this.state.ok
        console.log(seances)
        // console.log(this.props.params)
        if ( this.state.ok === false )
            return <Wildcard url={ this.props.match.params.path }/>



        let formated_seances = []
        const available_seances = []
        if ( ready ) {
            // seances.map( ({ date, time, id }) => { 
            //     const strDate = `d${date}`.replaceAll( '-', '_' )
            //     if (!Array.isArray(available_seances[strDate])) 
            //         available_seances[strDate] = []
            //     available_seances[strDate].push( {
            //         time,
            //         id
            //     }) 
            //     // console.log(available_seances)
            //     return null
            // } )


            for ( const { date } of seances ) {
                available_seances[ `${date || ''}`.replaceAll('-','_')] = []
            }

            for ( const { id, time, date } of seances ) {
                available_seances[`${date || ''}`.replaceAll('-','_')].push({ id, time })
            }


            for ( let i in available_seances ) {
                console.log(i)
                formated_seances.push(
                    <table className="reservations-list__info">
                        <thead>
                            <tr>
                                <th> {  this.formatToDate(i.replaceAll('_','-'))} </th> 
                            </tr>
                        </thead>
                        <tbody>
                            { 
                                available_seances[i].map( ({ id, time }, i) => (
                                    <tr>
                                        <Button
                                            link={ `${basename}reserve/${id}` }
                                            name={ ( <td> {time} </td> ) }
                                        />
                                        {/* <Link to=>
                                            
                                        </Link> */}
                                    </tr>
                                )) 
                            }
                        </tbody>
                    </table>
                )
            }
            
            console.log(available_seances)

            // available_seances.map(element => { console.log(element) })
        }
        console.log(available_seances)

        // const formated_seances = [ d2020_20_12 = 123 ]

        // for (const el of available_seances)
        //     formated_seances.push( JSON.stringify(el) )

        // // const formated_seances = available_seances.map(element => JSON.stringify(element))
        // console.log(formated_seances)
        return (
            <div className="content content--no-padding" ref={ this.localRefs.description }>
                <div className="movie-content">
                {/* { this.props.match.params.id } */}
                    <div className="movie-content__poster">
                        {
                            ready 
                                ? <img 
                                    src={`${basename}api/posters/${id}.${poster_ext}`} 
                                    alt={title} 
                                    title={title}
                                />
                                : null
                        }
                    </div>
                    <div className="movie-content__informations">
                        <h1 className="movie-content__title"> {title} </h1>
                        <p className="movie-content__description">{ description }</p>
                        {
                            ready 
                            ? (
                                <div className="movie-content__buttons">
                                    <Button
                                        onClick={ () => this.localRefs.trailer.current.scrollIntoView() }
                                        // link="#trailer"
                                        name="Zobacz zwiastun"
                                    />
                                    <Button
                                        // onClick={}
                                        onClick={ () => this.localRefs.reserve.current.scrollIntoView() }
                                        name="Zarezerwuj"
                                    />
                                </div>
                            ) : null
                        }
                        <div className="movie-content__props" >
                            <Subprop
                                title="data premiery"
                                prop={ ready ? this.formatToDate(release_date) : release_date }
                            />
                            <Subprop
                                title="czas trwania"
                                prop={ ready ? this.formatToTime( length ) : length }
                            />
                            <Subprop
                                title="gatunek"
                                prop={ genre }
                            />
                        </div>
                    </div>
                </div>
                <Player 
                    id="trailer"
                    className="main__player"
                    movieId={ trailer }
                    loop
                    title="Zwiastun"
                    ref={ this.localRefs.trailer }
                />

                <div className="section reservation-title" id="reserve" ref={ this.localRefs.reserve }>
                    <h1> Wybierz date i godzine seansu </h1>
                </div>
                <div className="section reservations-list">
                    {/* { formated_seances.join() } */}
                    
                    { ready && seances.length 
                        ? formated_seances
                        // (
                        //     <div>
                        //         { seances.map( ( { id, date, time }, i ) => <div> { id } { date } { time } </div> ) }
                        //     </div>
                        // )

                        : (
                            <div className="reservations-list__info"> 
                                Nie znaleziono żadnych dostępnych seansów 
                            </div>
                        ) 
                    }
                    {/* { ready && seances.length > 0 ? formated_seances.join('') : (<div className="reservations-list__info"> Nie znaleziono żadnych dostępnych seansów </div>) } */}
                </div>
                {/* <Route path={ `${props.match.url}/:id` } component={Reserve} /> */}
            </div>
        )

    }

}

export default Movie