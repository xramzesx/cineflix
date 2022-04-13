<?php
    include '../account/auth-mixin.php';
    // echo $type;

    $response = [
        "movies" => [],
        "informations" => []
    ];

    if ( $isAuth && $type == 0 ) {
        $conn = new mysqli(
            $domain_address,
            $dbusername,
            $dbpassword,
            $database
        );

        if ( $conn->connect_errno ) {
            echo json_encode(response_error(500));
            exit();
        }

        prepareUtf8($conn);


        $sql = "SELECT 
                    `id`, 
                    `title`,
                    `length`
                FROM
                    movies
                ORDER BY
                    `title`";

        // $conn->query( $sql ) or die ( json_encode(response_error(500)) );

        if ( $result = $conn->query($sql) ) {
            while ( $row = $result->fetch_assoc() ) {
                // print_r($row);
                array_push( $response['movies'], $row );
            }
            $result->close();
        }
        
        $sql = "SELECT `id`, `name` FROM informations";
        
        if ( $result = $conn->query($sql) ){
            while ( $row = $result->fetch_assoc()) {
                array_push( $response['informations'], $row );
            }
            $result->close();
        }

        $conn->close();
    } else {
        $response['error'] = TRUE;
    }
    
    echo json_encode( response_success($response) );


?>