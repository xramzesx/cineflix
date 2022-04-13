// const { default: Player } = require("./subcomponents/Player")
import Player from './subcomponents/Player'
import React, { Component } from 'react'
import './Main.scss'
import MovieComponent from './subcomponents/MovieComponent'
import MovieList from './subcomponents/MovieList'
import { basename } from '../../../Settings.json';

const Main = class extends Component {

    //// TU MA BYĆ ZAWARTE:
    ////    - YT PLAYER
    ////    - WSZYSTKIE DOSTĘPNE FILMY z linkiem do każdego z nich

    constructor ( props ) {
        super ( props )
        
        this.state = {
            movies : [],
            newest : [],
            bestsellers : [],
            movieId : "",
            drawedMovie : -1
        }

        this.localRefs = {
            main : React.createRef(),
            movies : React.createRef(),
        }
    }

    componentDidUpdate = ( prevProps ) => {

        console.log(prevProps)
        if ( prevProps.scrollTo != this.props.scrollTo )
            this.scrollToPage()   
        // return true
    }

    scrollToPage = () => {
        if ( this.props.scrollTo == "movies" ) {
            this.localRefs.movies.current.scrollIntoView() 
        } else {
            this.localRefs.main.current.scrollIntoView() 
        }
    }

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
      

    drawMovie = () => {
        //// DRAW A MOVIE FROM NEWEST ////
        
        
        if ( Array.isArray( this.state.newest ) ) {
            if ( this.state.newest.length ){
                let movie = this.getRandomIntInclusive( 0, this.state.newest.length - 1 )

                while ( movie == this.state.drawedMovie && this.state.newest.length > 1 ) {
                    movie = this.getRandomIntInclusive( 0, this.state.newest.length - 1 )
                }
                this.setState({
                    drawedMovie : movie
                })
            }
        }
        
        

    }

    componentDidMount = async () => {
        this.scrollToPage()
        document.title = "Cineflix"
        try {
            const response = await (await fetch(`${basename}api/trivial/movies`) ).json()
            
            if ( +response.code === 200 ){


                console.log ( this.getRandomIntInclusive( 0, response.newest.length - 1 ) , 'id')

                await this.setState({
                    movies : response.movies,
                    newest : response.newest,
                    bestsellers : response.bestsellers
                }, () => this.drawMovie())
    
            }
            console.log(response)

            
        } catch (error) {
            console.log('problem with fetching')
        }
    } 


    render() {

        const ready = this.state.newest.length && this.state.drawedMovie >= 0

        return (
            <div className="content content--no-padding content--main" ref={ this.localRefs.main } >
                <Player 
                    className="main__player"
                    movieId={ ready 
                        ? this.state.newest [ this.state.drawedMovie ].trailer 
                        : "" 
                    }
                    title={ ready 
                        ? this.state.newest [ this.state.drawedMovie ].title 
                        : "Nowość" 
                    }
                    link={ready ? `${basename}movie/${this.state.newest[this.state.drawedMovie].id}` : '' }
                    onEnd={ this.drawMovie }
                />
                <MovieComponent 
                    title="Nowości na ekranie" 
                    titleClass="title title--new"
                    movies={this.state.newest} 
                />
                <MovieComponent 
                    title="Bestsellery" 
                    titleClass="title title--bestsellers"
                    movies={this.state.bestsellers} 
                />
                <MovieComponent 
                    title="Wszystkie filmy" 
                    titleClass="title title--all"
                    movies={this.state.movies}
                    ref={ this.localRefs.movies }
                    grid
                />
                {/* <MovieList
                    ref={ this.localRefs.movies }
                    titleClass="title title--all"
                    movies={ this.state.movies }
                /> */}
            </div>
        )
    }

}

export default Main