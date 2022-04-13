<?php
    include '../voids.php';

    if ($_SERVER['REQUEST_METHOD'] == "POST" ) {
        session_start();
        
        //// UNSETTING ALL SESSION VARS ////
        $_SESSION = [];

        //// KILL THE SESSION COOKIE ////
        if ( ini_get( 'session.use_cookies' )) {
            $params = session_get_cookie_params();
            setcookie( 
                session_name(), 
                '', 
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }

        //// SESSION DESTRUCTION ////
        session_destroy();

        echo json_encode( response_success([
            "success" => true
        ]) );

    } else {
        echo json_encode( response_error( 405 ) );
    }

?>