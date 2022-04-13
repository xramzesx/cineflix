import React, { Component } from "react"
import Form from "../../elements/form/form"
import Textbox from "../../elements/form/textbox"
import Button from "../../elements/interactive/button"
import Overlay from "../../elements/page/Overlay"
import Subprop from "../../elements/page/Subprop"
import Seat from './components/Seat'
import './Reserve.scss'

import { basename } from  "../../../Settings.json"

const route = `${basename}reserve`

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

const Reserve = class extends Component {

    constructor ( props ) {
        super(props)

        this.state = {
            //// USER ////
            auth : false,
            user : {},
            info : {},
            //// SCREENING ROOM ////
            taken : [],
            selected : [],
            price : 1,
            //// FORM ////
            formDisabled : false,

            mobile : "",
            name : "",
            email : "",

            //// INTERACTIONS ////
            message : "",
            success : false,

            //// FETCHED RESPONSE ////
            reservationId : -1
        }

        this.localRefs = {
            main : React.createRef()
        }
    }

    componentDidMount = async () => {
        this.localRefs.main.current.scrollIntoView() 
        document.title = "Zarezerwuj miejsca | Cineflix"
        try {
            const seanceId = this.props.match.params.id
            console.log(seanceId)
            const data = new FormData()
            data.append('seance',seanceId)
            const response = await (await fetch(`${basename}api/utilities/seance`, {
                method : "post",
                body : data
            })).json()

            const {
                auth,
                user,
                taken,
                info
            } = response

            const {
                price
            } = info

            await this.setState({
                auth,
                user : user || null,
                taken,
                price : price || 1,
                info : info || {}
            })

            console.log(response)
        } catch (error) {
            console.log('problem with fetching')
            console.log(error)
        }
    }


    formatToDate ( dateStr ) {
        // const date = new Date(dateStr)
     
        if ( dateStr === undefined ) return ""

        const date = dateStr.match(/(\d+)/g)

        return `${+date[2]} ${ months[+date[1] - 1 ] } ${+date[0]}`
        // return `${date.getDay()} ${ months[date.getMonth() ] } ${date.getFullYear()}`

    }

    formatToTime( time ) {
        // if ( time === undefined ) return ""

        return time === undefined ? "" : `${(time - time % 60)/60}h ${time % 60}m`
    }

    handleSeatSelection = (isSelected ,id ) => {
        const index = this.state.selected.findIndex( i => i == id )
        
        let result 
        if ( isSelected && index >= 0){
            const selected = JSON.parse(JSON.stringify( this.state.selected ))
            selected.splice( index, 1 )
            
            this.setState({
                selected
            }, () => console.log( this.state.selected ))
            
            result = false
        } else {
            
            this.setState({
                selected : [...this.state.selected, id].sort( (a,b) => a - b )
            }, () => console.log(this.state.selected))
            
            result = true
        }

        return result

    }

    handleChange = ( e, name ) => {
        this.setState({
            [name] : e.target.value
        }, () => { console.log(e.target.value) })
    }


    validInput = ( str , regex ) => regex.test( str.trim() )

    sendForm = async () => {
        
        const data = new FormData()
        
        data.append( 'seats', this.state.selected )
        data.append( 'seance', this.props.match.params.id )
        let valid = true

        let message = ""

        let email = this.state.email.trim()
        let mobile = this.state.mobile
            .replaceAll( ' ','' ).replaceAll('-','')
            .replaceAll(':','').replaceAll('.','')

        if ( !this.state.auth ) {
            if ( this.state.name.length ) {
                let isMobileSet = mobile.length >= 8 && mobile.length <= 15 ? this.validInput(
                    mobile,
                    /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g
                ) : false
                let isEmailSet = this.validInput(
                    email,
                    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
                )
                
                console.log( isMobileSet, isEmailSet )
                console.log( mobile.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g) )
                
                console.log( mobile )

                if ( !( isEmailSet || isMobileSet )){
                    message = "Musisz podać poprawny numer telefonu. "
                    valid = false
                } else {

                    if ( isEmailSet )
                        data.append('email', email )
                    if ( isMobileSet )
                        data.append( 'mobile', mobile )
                    data.append('name', this.state.name )
                }
                
            } else {
                valid = false
                message = "Imię jest wymagane. "
            }
        }

        if ( this.state.selected.length <= 0 ){
            valid = false
            message +="Wybierz co najmniej jedno miejsce"
        }

        if ( valid ) {
            try {
                const response = await (await fetch( `${basename}api/reserve/seance`, {
                    method : "post",
                    body : data
                } )).json()
                
                
                if ( response.ok ) {
                    await this.setState({
                        reservationId : response.reservationId,
                        success : true
                    })
                } else {
                    message += response.status
                    //// USUWAMY ZAJĘTE MIEJSCA ////

                    if ( response.alreadyTaken ) {
                        const tempSelected = [ ...this.state.selected ]
                        for ( const seat of response.matched ) {
                            const index = tempSelected.indexOf( +seat )
                            if ( index >= 0 )
                                tempSelected.splice( index ,1 )
                        }

                        await this.setState({
                            selected : tempSelected,
                            taken : response.taken
                        })

                        console.log(this.state)
                    }


                }

                console.log(response)

            } catch (error) {
                console.log("problem with fetching")
                console.log(error)
            }
    
        }
        
        await this.setState({
            formDisabled : false,
            message
        })
    }

    
    handleSubmit = e => {
        e.preventDefault()

        this.setState({
            formDisabled : true
        })


        this.sendForm()
        console.log('siema')

    }

    render() {
        const seats_data = []
        
        for (let i = 300; i > 0; i--) {
            seats_data.push( {
                id : i,
                selected : false,
                taken : false
            })
        }

        for ( const seat of this.state.taken ){
            const index = seats_data.findIndex( el => el.id == seat )
            // console.log(seat)
            // console.log(index)
            if ( index >= 0 )
                seats_data[index].taken = true
        }
        
        const seats = seats_data.map( 
            ( {id, selected, taken}, i ) => (
                <Seat 
                    id={id} 
                    key={i} 
                    selected={selected} 
                    index={i} 
                    disabled={taken}
                    onClick ={ this.handleSeatSelection }
                />
            )
        )

        const selectedSeats = this.state.selected.map( (index, i) => (
            <tr key={i}>
                <td> {i + 1}. </td>
                <td> { this.state.price } zł </td>
                <td> Miejsce { index } </td>
            </tr>
        ))

        return (
            <div className="content content--reserve" ref={ this.localRefs.main }>
                <div className="section">
                    <h1> Wybierz miejsca </h1>
                    <div className={`screening-room ${ this.state.success ? "screening-room--hidden" : "" }`}>
                        { seats }
                        <Overlay show={this.state.success} className="overlay--screening-room">
                            <div className="overlay--screening-room__div">
                                <h1> Hej! </h1>
                                <h2>Już zarezerwowałeś!</h2>
                                <p> Możesz sprawdzić swoją rezerwację w zakładce "Sprawdź rezerwację" </p>
                            </div>
                        </Overlay>
                        <div className="screening-room__screen"> 
                            <p>Ekran</p>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <h1> Podsumowanie </h1>
                    <div className="reserve--sum-up">
                        <div className="subsection">
                            <h2> Rachunek </h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th> lp. </th>
                                        <th> Cena </th>
                                        <th> Miejsce </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { selectedSeats }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan="2"> W sumie </th>
                                        <td> { selectedSeats.length * this.state.price } zł </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="subsection reserve__info" >
                            <h2> Dane rezerwującego </h2>
                            <Form 
                                className="reserve__form"
                                submitValue="Zarezerwuj"
                                disabled={ this.state.formDisabled }
                                onSubmit={ this.handleSubmit }
                            >
                            { this.state.message.length ? <p className="message--invalid"> { this.state.message } </p> : null }

                                { this.state.auth ? (
                                    <div className="reserve__client-data">
                                        <Subprop
                                            title="username"
                                            prop={ this.state.user.username }
                                        />
                                        <div className="reserve__info--row">
                                            <Subprop
                                                title="Imię"
                                                prop={ this.state.user.name }
                                            />
                                            
                                            <Subprop
                                                title="Nazwisko"
                                                prop={ this.state.user.surname }
                                            />

                                        </div>
                                        <div className="reserve__info--row">
                                            {
                                                this.state.user.email 
                                                ? 
                                                    <Subprop
                                                        title="Adres email"
                                                        prop={ this.state.user.email }
                                                    />
                                                : null
                                            }

                                            {
                                                this.state.user.mobile 
                                                ? 
                                                    <Subprop
                                                        title="Telefon"
                                                        prop={ this.state.user.mobile }
                                                    />
                                                : null
                                            }
                                        </div>
                                    </div>
                                ) : (
                                    <div className="reserve__client-data">
                                        <h2> Wymagane są dane </h2>
                                        <p> Podaj nr telefonu lub zaloguj się do swojego konta by przypisać rezerwacje do adresu email</p>
                                        
                                        <div className="reserve__info--row reserve__info--form">
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
                                        </div>
                                        <div className="reserve__info--row reserve__info--form">
                                            {/* <Textbox
                                                name="email"
                                                label="Email"
                                                type="email"
                                                onChange={ this.handleChange }
                                                // required
                                            /> */}
                                        </div>
                                    </div>
                                )
                                }
                                
                                <div className="reserve__seance-data">
                                    <Subprop
                                        title="Tytuł filmu"
                                        prop={ this.state.info.title }
                                    />
                                    <Subprop
                                        title="Dzień"
                                        prop={ this.formatToDate(this.state.info.date) }
                                    />
                                    <Subprop
                                        title="Godzina"
                                        prop={ this.state.info.time }
                                    />
                                    <Subprop
                                        title="Długość"
                                        prop={ this.formatToTime(this.state.info.length) }
                                    />
                                    <div className="reserve__info--row">
                                        <Subprop
                                            title="Zarezerwowane miejsca"
                                            prop={ this.state.selected.join( ', ' ) || "Wybierz miejsca powyżej" }
                                        />
                                        <Subprop
                                            title="Cena"
                                            prop={ `${this.state.selected.length * this.state.price}zł` }
                                        />
                                    </div>
                                </div>
                            </Form>
                            {
                                this.state.auth ? null : (
                                    <div className="reserve__info--row">
                                        <Button
                                            name="Użyj adresu email"
                                            link={ basename + "/account" }
                                        />
                                    </div>
                                )
                            }
                            <Overlay show={ this.state.success }>
                                <div>
                                    <h1> Sukces! </h1>
                                    <p> Udalo się pomyślnie zarezerwować bilety. </p>
                                    <h2> Nr rezerwacji : { this.state.reservationId } </h2>
                                    <Button
                                        name="Sprawdź rezerwację"
                                        link={ `${basename}check/${this.state.reservationId }` }
                                    />
                                </div>
                            </Overlay>
                        </div>
                    </div>
                    {
                        this.state.info.message ? (
                            <div className="section subsection reserve__seance-message">
                                <h1> Informacje dodatkowe </h1>
                                { this.state.info.message.split('\n').map( ( line, i) => <p key={i}> {line} </p> ) }
                            </div>
                        ) : null
                    }

                </div>
            </div>
        )
    }
}

export default Reserve