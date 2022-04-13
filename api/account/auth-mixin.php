<?php
    //// Not only post method ////
    
    session_start();

    include '../props.php';
    include '../voids.php';


    $isAuth = TRUE;
    $type = -1;
    if ( isset($_SESSION['uid']) ) {
        
        $uid= $_SESSION['uid'];

        $sql = "SELECT `id`, `type` FROM users WHERE `id`=$uid";


        $conn = new mysqli(
            $domain_address, 
            $dbusername, 
            $dbpassword, 
            $database
        );

        if ( $conn->connect_errno ) {
            echo json_encode( response_error( 500 ) );
            exit();
        }

        //// tylko uid sprawdzamy będący intem, ////
        //// więc niepotrzebne jest aż tak utf8 ////

        if ( $result = $conn->query($sql) ) {

            //// RETURN WIth TYPE ////

            if ( $row = $result->fetch_assoc() ) {
                // if ( $row['id'] == $uid ) {}
                
                $type = $row['type'];
                
                // echo "<pre>";
                // print_r( $row );
                // echo "</pre>";
                
                $isAuth = TRUE;

            } else {
                $isAuth = FALSE;
            }


            $result->close();
        }

        $conn->close();

    } else {
        $isAuth = FALSE;
    }
    // echosiema byq";
?>