import { Component, createRef, useState } from 'react'
import { Switch, Route } from 'react-router-dom'

import { basename } from '../../../Settings.json'

import Form from '../../elements/form/form'

import Textbox from '../../elements/form/textbox'
import Button from '../../elements/interactive/button'
import ErrorWindow from '../../elements/page/ErrorWindow'

import Subprop from '../../elements/page/Subprop'
import Subsection from '../../elements/page/Subsection'

import './Account.scss'
import Add from './dashboard/Add/Add'
import AddMovie from './dashboard/Add/AddMovie'
import AddSeance from './dashboard/Add/AddSeance'
import Billings from './dashboard/Billings'

const Account = class extends Component {
    constructor( props ) {
        super(props)

        this.ref = {
            loginForm : createRef(),
            registerForm : createRef()
        }

        this.state = {
            pageLoaded : false,
            auth : false,
            type : -1,
            
            formDisabled : false,

            //// LOGIN FORM ////
            lUsername : "",
            lPassword : "",
            
            //// REGISTER FORM ////
            rUsername : "",
            rPassword: "",
            rName : "",
            rSurname : "",
            rEmail : "",
            rMobile : "",

            userInfo : {},
            tables : [],

            //// Messages handling ////

            lmessage : "",
            rmessage : ""
        }
        this.localRefs = {
            main : createRef()
        }
    }

    

    async componentDidMount () {
        document.title = "Konto | Cineflix"
        this.localRefs.main.current.scrollIntoView()

        //// AUTH FIRST ////
        await this.authorize()
    }

    authorize = async () => {
        try{            
            const response = await ( await fetch ( `${basename}api/account/info`, {
                method : "post"
            })).json()
    
            await this.setState({
                pageLoaded : true,
                auth : response.auth || false,
                type : response.type || -1,
                userInfo : response.user || {},
                tables : response.tables || [],
                rmessage : "",
                lmessage : ""
            })

            console.log(response)
        } catch { 
            await this.setState({
                pageLoaded : true,
                auth : false
            })
        }
    }

    handleChange = ( e, name ) => {
        console.log(name, e.target.value)

        this.setState({
            [name] : e.target.value
        })
    }

    handleLoginSubmit = async e => {
        e.preventDefault()

        this.setState({
            formDisabled : true
        })

        const formData = new FormData()

        formData.append('username', this.state.lUsername)
        formData.append('password', this.state.lPassword)

        const data = new URLSearchParams ( formData )
        try {
            const response = await ( await fetch(`${basename}api/account/login`, {
                method : "post",
                body : data
            }) ).json()
    
            console.log(response)
            if ( response.logged ){
                // await this.setState( { pageLoaded : false } )
                await this.authorize()
            } else {
                this.setState({
                    lmessage : "Zły login lub hasło"
                })
            }
        } catch {
            this.setState({
                lmessage : "Problem z połączeniem z serwerem"
            })
        }
        
        await this.setState({
            formDisabled : false
        })
    }

    validInput = ( str , regex ) => regex.test( str.trim() )

    validateMobile = ( mobile ) => mobile.length >= 8 && mobile.length <= 15 ? this.validInput(
        mobile,
        /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g
    ) : false

    validateEmail = ( email ) => this.validInput(
        email,
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
    )

    handleRegisterSubmit = async e => {
        e.preventDefault()
        
        this.setState({
            formDisabled : true
        })

        console.log('siema')
        
        //// VALIDATE FIRST /////

        let email = this.state.rEmail.trim()
        let mobile = this.state.rMobile
            .replaceAll( ' ','' ).replaceAll('-','')
            .replaceAll(':','').replaceAll('.','')


        let isOk = false

        let isEmailValid = this.validateEmail(email)
        let isMobileValid = mobile.length == 0 || this.validateMobile(mobile)



        if ( isEmailValid && isMobileValid ) {
            const data = new FormData()
    
            data.append( 'username', this.state.rUsername )
            data.append( 'password', this.state.rPassword )
    
            data.append( 'name' , this.state.rName )
            data.append( 'surname', this.state.rSurname )
    
            data.append( 'email', email )
            // data.append( 'mobile', mobile )
            try {
                const response = await ( await fetch( `${basename}api/account/register`, {
                    method : "post",
                    body : data
                } ) ).json()
    
                if ( response.code == 200 ) {
                    if ( response.ok ) {
                        await this.authorize()
                    } else {
                        await this.setState({
                            rmessage : response.status || ''
                        })
                    }
                } else {
                    await this.setState({
                        rmessage : response.message || ''
                    })
                }

                console.log( response )
            } catch {
                await this.setState({
                    rmessage : "Problem z połączeniem z serwerem"
                })
            }


        } else {
            let message = ""
            if ( !isEmailValid ) message += "Niepoprawny adres email. "
            if ( !isMobileValid ) message += "Niepoprawny numer telefonu. "
            await this.setState({
                rmessage : message
            })
        }



        await this.setState({
            formDisabled : false
        })
        // const data = new URLSearchParams( formData )
    }

    handleLogOut = async e => {
        const response = await ( 
            await fetch( 
                `${basename}api/account/logout`,
                {
                    method : "post"
                }
            ) 
        ).json()

        if ( response.success ){
            await this.setState({
                auth : false,
                userInfo : {}
            })
        }

        console.log(response)
    }


    render() {

        const { 
            pageLoaded, 
            auth,
            userInfo
        } = this.state

        const { match } = this.props
        const localPath = "account"
        const path = basename + localPath
        console.log(match)

        

        return (
            <div className={`content ${ auth ? "content--auth" : "content--unauth" }`} ref={ this.localRefs.main }>
                {
                    pageLoaded
                    ? 
                        auth 
                        ? (
                            <>
                                <div className="section">
                                    <h1 className="section__header"> Hej { userInfo.username } !</h1>
                                    <div className="section__subsections" >
                                        <Subsection title="Informacje">
                                            <Subprop title="Imię" prop={ userInfo.name } />
                                            <Subprop title="Nazwisko" prop={ userInfo.surname } />
                                            <Subprop title="Adres email" prop={ userInfo.email } />
                                            { userInfo.mobile ? <Subprop title="Numer telefonu" prop={ userInfo.mobile } /> : null }
                                            <Subprop title="Data rejestracji" prop={ userInfo.joined } />
                                        </Subsection>
                                        <Subsection className="subsection--main">
                                            <Switch>
                                                <Route path={ path +'/add/movie'} >
                                                    <AddMovie type={ this.state.type }/>
                                                </Route>
                                                <Route path={ path +'/add/seance'}>
                                                    <AddSeance type={ this.state.type } />
                                                </Route>
                                                <Route path={ path +'/add'} component={ Add } />
                                                <Route path={ path +'/add/:id'} component={ Add } />
                                                <Route path={ path } >
                                                    <Billings tables={ this.state.tables || [] }/>
                                                </Route>
                                                
                                            </Switch>
                                        </Subsection>
                                        <Subsection title="Akcje" className="subsection--actions">
                                            {
                                                this.state.type == 0 ? (
                                                    <>
                                                        <Button
                                                            link={path + '/add/movie'}
                                                            name="Dodaj film"
                                                        />
                                                        <Button
                                                            link={path + '/add/seance'}
                                                            name="Dodaj seans"
                                                        />
                                                    </>
                                                ) : null

                                            }
                                            <div className="section__row">
                                                {  this.state.type == 0 ? (
                                                    <Button
                                                    link={ path }
                                                    name="Informacje"
                                                />
                                                ) : null }
                                                <Button
                                                    onClick={ this.handleLogOut }
                                                    link= { path }
                                                    name="Wyloguj"
                                                />

                                            </div>

                                        </Subsection>
                                    </div>
                                </div>
                            </>
                        )
                        : (
                            <><div className="section section--login">
                            <h1>Witamy ponownie!</h1>
                            <h2>Zaloguj się</h2>
                            <Form 
                                // ref={this.ref.loginForm} 
                                method="POST" 
                                onSubmit={ this.handleLoginSubmit } 
                                submitValue="Zaloguj"
                                disabled={ this.state.formDisabled }
                            >
                                <Textbox
                                    label="username"
                                    name="lUsername"
                                    onChange={ this.handleChange }
                                    type="text"
                                    required
                                />
                                <Textbox
                                    label="password"
                                    name="lPassword"
                                    onChange={ this.handleChange }
                                    type="password"
                                    required
                                />
                                <ErrorWindow className="login--error-message">
                                    { this.state.lmessage }
                                </ErrorWindow>
                            </Form>
                        </div>
                        <div 
                            // ref={ this.ref.registerForm }
                             className="section section--register"
                        >
                            <h1>Nie posiadasz jeszcze konta?</h1>
                            <h2>Zarejestruj się</h2>
                            <Form 
                                method="POST" 
                                onSubmit={ this.handleRegisterSubmit }
                                submitValue="Zarejestruj"
                                disabled={ this.state.formDisabled }
                            >
                                <div className="section__row">
                                    <Textbox
                                        label="username"
                                        name="rUsername"
                                        onChange={ this.handleChange }
                                        type="text"
                                        required
                                    />
                                    <Textbox
                                        label="password"
                                        name="rPassword"
                                        onChange={ this.handleChange }
                                        type="password"
                                        additionalProps={{
                                            minLength : 8,
                                            maxLength : 128
                                        }}
                                        required
                                    />
                                {/* <Textbox
                                    label="telefon"
                                    name="rMobile"
                                    onChange={ this.handleChange }
                                    type="tel"
                                    additionalProps = {{
                                        maxLength : 15,
                                        minLength : 8
                                    }}
                                /> */}
                                </div>
                                <div className="section__row">
                                    <Textbox
                                        label="name"
                                        name="rName"
                                        onChange={ this.handleChange }
                                        type="text"
                                        required
                                    />
                                    <Textbox
                                        label="surname"
                                        name="rSurname"
                                        onChange={ this.handleChange }
                                        type="text"
                                        required
                                    />
                                </div>
                                <Textbox
                                    label="email"
                                    name="rEmail"
                                    onChange={ this.handleChange }
                                    type="email"
                                    required
                                />
                                {/* <div className="section__row special"> */}
                                    {/* <Textbox
                                        // label="urodzony"
                                        name="rBdate"
                                        onChange={ this.handleChange }
                                        type="date"
                                        required
                                    /> */}
                                {/* </div> */}
                                
                                <ErrorWindow className="login--error-message">
                                    { this.state.rmessage }
                                </ErrorWindow>
                            </Form>
                        </div>

                            </>
                        )
                    : (
                        <>

                        </>
                    )
                }

            </div>
        )

    };

}


// const Account = props => {

//     const [ pageLoaded, setPageLoaded ] = useState( false )

//     // const [ formData , setFormData ] = useState({
//     //     login : "",
//     //     password : "",
//     // })

//     const handleLoginSubmit = () => {

//     }


//     const handleRegisterSubmit = () => {

//     }

// }

export default Account