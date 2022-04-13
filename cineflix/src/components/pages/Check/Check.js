import React, { Component } from 'react';
import Form from '../../elements/form/form';
import Textbox from '../../elements/form/textbox';
import Subprop from '../../elements/page/Subprop';
import Subsection from '../../elements/page/Subsection';
import "./Check.scss"

import { basename } from '../../../Settings.json'

const route = `${basename}check`

const Check = class extends Component {
    
    constructor (props) {
        super(props)

        this.state = {
            //// INTERACTIONS ////
            auth : false,
            formDisabled : false,

            //// FETCHED RESULT ////
            reservation : {},
            reservations : [],
            seats : [],

            

            //// FORM HANDLING ////
            name : "",
            mobile : "",

            reservationId : "",

            //// ERROR HANDLING ////
            message : "",
        }


        this.localRefs = {
            form : React.createRef(),
            info : React.createRef()
        }

    }

    componentDidMount = async () => {
        this.localRefs.form.current.scrollIntoView() 

        try {
            const response = await ( await fetch( `${basename}api/account/auth` )).json()
            console.log(response)
            if ( +response.code === 200 )
                await this.setState({
                    auth : response.auth
                })
        } catch {
            console.log('problem with auth')
        }
        const { id : reservation } = this.props.match.params
        
        if ( this.state.auth )
            this.fetchAllReservations()
        
        if ( reservation ) {
            this.fetchReservation( reservation )
        }

        console.log(this.props.match.params)
        
    }

    fetchReservation = async id => {
        
        if ( this.validateReservationId( id ) ){
            this.setState({
                formDisabled : true
            })
            try {

                const data = new FormData()
                data.append('reservationId', id)
                
                const response = await ( 
                    await fetch( `${basename}api/reserve/check`, 
                    {
                        method : "post",
                        body : data
                    }
                )).json()
                
                if ( +response.code == 200 ) {
                    if ( response.ok ) {
                        if ( this.props.match.url != `${route}/${response.reservation.id}` ){
                            // console.log(this.props.match.url, `${route}/${response.reservation.id}`)
                            this.props.history.push( `${route}/${response.reservation.id}` )
                        }
                        
                        const reservation = {
                            ...response.reservation,
                            ok : true,
                            // id
                        }

                        this.setState({
                            reservationId : id,
                            seats : response.seats,
                            reservation : reservation,
                            message : ""
                        }, () => this.localRefs.info.current.scrollIntoView())
                    } else {
                        this.setState({
                            reservationId : id,
                            reservation : {},
                            seats : [],
                            message : response.status
                        })
                    }
                } else {
                    this.setState({
                        reservationId : id,
                        reservation : {},
                        seats : [],
                        message : response.message
                    })
                }

                console.log(response)
            } catch (error) {
                console.log("problem with fetching")
                console.log(error)
            }

            await this.setState({
                formDisabled : false
            })

        } else {
            this.setState({
                message : "Niepoprawny numer rezerwacji. "
            })
        }
    }

    fetchAllReservations = async () => {
        this.setState({
            formDisabled : true
        })
        
        try {

            const data = new FormData()

            if ( !this.state.auth ){
                data.append( 'name', this.state.name )
                data.append( 'mobile', this.state.mobile )
            }

            // data.append('reservationId', id)
            
            const response = await ( 
                await fetch( `${basename}api/reserve/list`, 
                {
                    method : "post",
                    body : data
                }
            )).json()
            
            if ( +response.code == 200 ) {
                if ( response.ok ) {
                    if ( response.reservations )
                        this.setState({
                            reservations : response.reservations || [],
                            message : ""
                        })
                    else 
                        this.setState({
                            reservations : response.reservations || [],
                            message : "Do podanego konta nie znaleziono żadnych rezerwacji"
                        })
                    
                    console.log( response.reservations )

                } else {
                    this.setState({
                        message : response.status
                    })
                }
            } else {
                this.setState({
                    message : response.message || "Wystąpił problem z połączeniem"
                })
            }

            // if ( +response.code == 200 ) {
            //     // if ( this.props.match.url !== `${route}/${id}` ){
            //     //     console.log(this.props.match.url)
            //     //     this.props.history.push( `${route}/${id}` )
            //     // }
            // } else {
            //     this.setState({
            //         message : response.status
            //     })
            // }

            console.log(response)
        } catch (error) {
            console.log("problem with fetching")
            console.log(error)
        }

        await this.setState({
            formDisabled : false
        })
    }

    handleUserSubmit = e => {
        e.preventDefault()
        this.fetchAllReservations()
    }
    
    handleReserveSubmit = e => {
        e.preventDefault()
        const { reservationId : id } = this.state
        this.fetchReservation( id )
        
    }

    handleChange = ( e, name ) => {
        this.setState({
            [name] : e.target.value
        })
    }

    validInput = ( str , regex ) => regex.test( str.trim() )

    validateMobile ( mobile ) {
        return  mobile.length >= 8 && mobile.length <= 15 ? this.validInput(
            mobile,
            /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g
        ) : false
    }

    validateReservationId ( reservationId ) {
        return reservationId.length > 0 && reservationId.length <= 13
    }

    render() {
        return (
            <div className="content content--check-reservation" ref={this.localRefs.form}>
                <div className="section section--check-form">
                    <h1> Sprawdź swoją rezerwację </h1>
                    <Subsection title="Formularz" className="subsection--check-form">
                        <p> Podaj imię i nr telefonu na który dokonałeś rezerwacji, bądź podaj bezpośrednio jej numer</p>
                        <div className="check__row">
                            {
                                this.state.auth ? null : (
                                    <Form
                                        submitValue="Znajdź przypisane rezerwacje"
                                        onSubmit={ this.handleUserSubmit }
                                        disabled = { this.state.formDisabled }
                                    >
                                        <Textbox
                                            name="name"
                                            label="Imię"
                                            type="text"
                                            onChange={ this.handleChange }
                                            additionalProps={{
                                                maxLength : 13
                                            }}
                                            required
                                        />
                                        <Textbox
                                            name="mobile"
                                            label="Telefon"
                                            type="tel"
                                            onChange={ this.handleChange }
                                            additionalProps ={{
                                                maxLength : 15,
                                                minLength : 8
                                            }}
                                            required
                                        />
                                    </Form>
                                )
                            }
                            <Form
                                submitValue="Sprawdź"
                                onSubmit={ this.handleReserveSubmit }
                                disabled = { this.state.formDisabled }
                            >
                                <Textbox
                                    name="reservationId"
                                    label="Rezerwacja"
                                    type="text"
                                    onChange={ this.handleChange }
                                    additionalProps={{
                                        maxLength : 13
                                    }}
                                    required
                                />
                            </Form>
                        </div>
                    </Subsection>
                    {
                        this.state.message ? (
                            <Subsection
                                className="check--alert"
                            >
                                { this.state.message }
                            </Subsection>
                        ) : null
                    }
                    { this.state.reservation.ok ? (
                        <Subsection
                            title={`Rezerwacja nr ${ this.state.reservation.id }`}
                            ref={this.localRefs.info}
                        >
                            <Subprop
                                title="Tytuł filmu"
                                prop={ this.state.reservation.title }
                            />
                            <div className="check--row">
                                <Subprop
                                    title="Dzień"
                                    prop={ this.state.reservation.date }
                                />
                                <Subprop
                                    title="Godzina"
                                    prop={ this.state.reservation.time }
                                />
                            </div>
                            <div className="check--row">
                                <Subprop
                                    title="Miejsca"
                                    prop={ this.state.seats.join(', ') }
                                />
                                <Subprop
                                    title="Cena"
                                    prop={ `${this.state.reservation.price * this.state.seats.length} zł` }
                                />
                            </div>
                            {
                                this.state.reservation.content ? (          
                                    <Subprop
                                        className="subprop--seance-message"
                                        title="Dodatkowy komunikat"
                                        prop={ this.state.reservation.content.split("\n").map( 
                                            ( line, i ) => <p key={i}> {line} </p>
                                        )}
                                    />
                                ) : null
                            }
                        </Subsection>
                    ): null }


                    {
                        this.state.reservations.length ? (
                            <Subsection 
                                title="Przypisane rezerwacje"
                                className="check--reservations-list"
                            >
                                <table>
                                    <thead>
                                        <tr>
                                            <th> lp </th>
                                            <th> nr </th>
                                            <th> film </th>
                                            <th> dzień </th>
                                            <th> godzina </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.reservations.map( ( { id, title, date, time }, i ) => (
                                            <tr key={i} onClick={ e => { 
                                                if ( !this.state.formDisabled ) {
                                                    this.fetchReservation( id )
                                                }
                                            }}>
                                                <td> {i + 1} </td>
                                                <td> { id } </td>
                                                <td> { title } </td>
                                                <td> { date } </td>
                                                <td> { time } </td>
                                            </tr>
                                        )) }
                                    </tbody>
                                </table>
                            </Subsection>
                        ) : null
                    }
                </div>
            </div>
        );
    }
}

export default Check