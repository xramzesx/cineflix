import { forwardRef } from 'react'
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube'
import './Player.scss'


/// ADD YOUTUBE PLAYER ////
const Player = forwardRef( ( { 
        className, 
        movieId, 
        loop,
        onEnd,
        title,
        link
    }, ref ) => {
    const opts = {
        // height: '390',
        // width: '640',
        playerVars: {
        // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            mute : 1,
            loop : loop || 0,
            enablejsapi : 1
        },
    };
    
    const handleReady = e => {
        e.target.playVideo()
    }

    const handleEnd = e => {
        if (onEnd)
            onEnd()
        if (loop)
            e.target.playVideo()
        console.log('konuec')
    }

    const innerComponent = (
        <>
        {
                movieId ?
                (
                    // (<iframe src={"https://www.youtube.com/embed/" + movieId} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>)
                    <YouTube
                        videoId={ movieId }
                        opts={opts}
                        className="player__youtube"
                        onReady={ handleReady }
                        onEnd={ handleEnd }
                    />
                )
                : null
            }
            <div className="player__title">
                <h1> {title || ''} </h1>
            </div>
        </>
    )

    return link ? (
            <Link to={link || ''} ref={ref} className={`player ${ className || '' }`.trim()}>
                { innerComponent }
            </Link>
        ) : (
        <div ref={ref} className={`player ${ className || '' }`.trim()}>
            { innerComponent }
        </div>
    )
})

export default Player