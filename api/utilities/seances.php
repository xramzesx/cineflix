<?php
    include '../account/auth-mixin.php';
    // echo $type;

    $response = [
        "seances" => [],
        "ok" => FALSE
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

        if ( check_if_set( [ "date" ] ) ) {
            $date = addslashes($_POST['date']);

            $sql = 
            "SELECT 
                `movies`.`title`,
                `seances`.`id`,
                `seances`.`time`,
                `movies`.`length`
            FROM `seances` INNER JOIN `movies`
            ON `movies`.`id`=`seances`.`movie`
            WHERE `seances`.`date`=\"$date\"
            ORDER BY `seances`.`time`";
    
            // $conn->query( $sql ) or die ( json_encode(response_error(500)) );
    
            if ( $result = $conn->query($sql) ) {
                while ( $row = $result->fetch_assoc() ) {
                    array_push( $response['seances'], $row );
                }
                $result->close();
                $response['ok'] = TRUE;
            }
            
        }

        $conn->close();
    } else {
        $response['error'] = TRUE;
    }
    
    echo json_encode( response_success($response) );


?>