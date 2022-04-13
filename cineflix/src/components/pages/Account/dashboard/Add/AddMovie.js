import { Component, createRef } from "react"
import Form from "../../../../elements/form/form"
import Select from "../../../../elements/form/select"
import Textarea from "../../../../elements/form/textarea"
import Textbox from "../../../../elements/form/textbox"
import Overlay from "../../../../elements/page/Overlay"
import ErrorWindow from '../../../../elements/page/ErrorWindow'
import Add from "./Add"

import { basename } from '../../../../../Settings.json'
import Button from "../../../../elements/interactive/button"

const AddMovie = class extends Component {

    constructor ( props ) {
        super ( props )

        this.fileRef = createRef()

        this.state = {
            //// FETCHED ////
            genres : [],


            //// FORM ////
            title : "",
            genre : 1,
            description : "",
            trailer : "",
            length : "",
            release_date : new Date(),
            poster : new Blob(),
            price : 0,
            //// FORM CONTROL ////
            disabled : false,
            success : false,
            message : ""

        }

    }

    componentDidMount = async () => {
        //// FETCHING DATA ////
        try{
            const response = await ( await fetch(`${basename}api/utilities/genres`)).json()
    
            if ( +response.code === 200 )
                await this.setState({
                    genres : response.genres
                })
            console.log(response)
        } catch {
            console.log('problem with fetching')
        }
    }

    handleChange = (e, name) => {

        console.log(e.target.value)

        // eval( `this.setState({
        //     ${name} : \`${e.target.value.split('\\').filter( el => el != "").join('\\\\').split(/'/)}\`
        // })`)

        this.setState({
            [name] : e.target.value
        })

        console.log({ [name] : "siema" })

        console.log( this.state[name], name )
    }

    handleSubmit = async e => {
        e.preventDefault()

        this.setState({
            disabled : true
        })

        const data = new FormData()
        console.log(this.state)
        data.append('title', this.state.title)
        data.append('genre', this.state.genre)
        data.append('description', this.state.description)
        data.append('trailer', this.state.trailer)
        data.append('length', this.state.length)
        data.append( 'price', this.state.price )
        // console.log(this.fileRef)
        data.append('poster', this.fileRef.current.files[0])
        
        data.append('release_date', this.state.release_date)



        const response = await ( await fetch( `${basename}api/add/movie`,{
            method : "post",
            body : data
        }) ).json()

        if ( +response.code == 200 ) {
            // if ( response )
                await this.setState({
                    success : true,
                    message : "",
                    fileOk : response.file_ok
                })
            // else 
            //     await this.setState({
            //         message : response.status
            //     })
        } else {
            await this.setState({
                message : response.message
            })
        }

        await this.setState({
            disabled : false
        })
        console.log(response)
    }

    render () {
        // console.log('siema' )
        if ( +this.props.type !== 0 ){
            return <Add/>
        }
        console.log( this.fileRef )
        return (
            <>
                <h2> Dodaj film </h2>
                <ErrorWindow>
                    { this.state.message }
                </ErrorWindow>
                <Form
                    // title="Siema"
                    enctype="multipart/form-data"
                    onSubmit={ this.handleSubmit }
                    submitValue="Dodaj"
                    className="subsection__form"
                    disabled={ this.state.disabled }
                >
                    <div className="section__row">
                        <Textbox
                            label="tytuł"
                            name="title"
                            onChange={ this.handleChange }
                            className="textbox--fill"
                            type="text"
                            required
                        />
                        <Select
                            label="gatunek"
                            name="genre"
                            className="textbox--fill"
                            options={ this.state.genres.map( ({ id, genre }) => { return { name : genre, value : id } }  ) }
                            onChange={ this.handleChange }
                            required
                        />
                    </div>
                    <div className="section__row">
                        <Textbox
                            label="trailer"
                            name="trailer"
                            className="textbox--fill"
                            onChange={ this.handleChange }
                            type="text"
                            additionalProps={{
                                maxLength : 11,
                                placeholder : "Youtube Video ID"
                            }}
                            required
                        />
                        <Textbox
                            label="czas trwania"
                            name="length"
                            className="textbox--fill"
                            onChange={ this.handleChange }
                            type="number"
                            additionalProps={{
                                min : "1",
                                max : "600",
                                placeholder : '0'
                            }}
                            required
                        />
                    </div>
                    <div className="section__row">
                        <Textbox
                            label="data premiery"
                            name="release_date"
                            onChange={ this.handleChange }
                            className="textbox--fill"
                            type="date"
                            required
                        />
                        <Textbox
                            label="plakat"
                            name="poster"
                            onChange={ this.handleChange }
                            className="textbox--fill"
                            type="file"
                            additionalProps={{
                                accept : "image/x-png,image/gif,image/jpeg"
                            }}
                            ref={ this.fileRef }
                            required
                        />
                        <Textbox
                            label="cena"
                            name="price"
                            className="textbox--fill"
                            onChange={ this.handleChange }
                            type="number"
                            additionalProps={{
                                min : "1",
                                max : "600",
                                placeholder : '0'
                            }}
                            required
                        />
                    </div>
                    <Textarea
                        label="Opis"
                        name="description"
                        onChange={ this.handleChange }
                        type="text"
                        additionalProps={{
                            maxLength : 900,
                            rows : 15
                        }}
                        required
                    />
                </Form>
                <Overlay
                    show = { this.state.success }
                >
                    <div>
                        <h1> Sukces! </h1>
                        <h2> Udało się pomyślnie dodać film </h2>
                        <Button
                            link={`${basename}account`}
                            name="Powrót do panelu sterowania"
                        />
                    </div>
                </Overlay>
            </>
        )

    }
}

export default AddMovie