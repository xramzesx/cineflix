<?php
    include '../account/auth-mixin.php';

    if ( isset( $_POST['seance'] ) && !empty( $_POST['seance']) ) {
        
        $seanceId = $_POST['seance'];

        $response = [
            "auth" => $isAuth,
            "user" => null,
            "taken" => [],
            "info" => null
        ];

        $conn = new mysqli(
            $domain_address,
            $dbusername,
            $dbpassword,
            $database
        );

        if ( $conn->connect_errno ){
            echo json_encode(response_error(500));
            exit();
        }

        prepareUtf8($conn);

        if ( $isAuth ) {
            $uid= $_SESSION['uid'];

            $sql = 
            "SELECT 
                `username`,
                `name`,
                `surname`,
                `email`,
                `mobile` 
            FROM users 
            WHERE id=\"$uid\"";

            if ($result = $conn->query( $sql )){

                if ( $row = $result->fetch_assoc()){
                    $response['user'] = $row;
                }

                $result->close();
            }
        } 


        //// FETCHING SEANCE INFO ////

        $sql = 
            "SELECT 
                `movies`.`title`,
                `movies`.`length`, 
                `seances`.`date`, 
                `seances`.`time`, 
                `movies`.`price`, 
                `informations`.`content` as 'message'
            FROM `seances` 
            INNER JOIN  `movies` 
            ON `seances`.`movie` = `movies`.`id`
            INNER JOIN `informations` 
            ON `seances`.`message`=`informations`.`id`
            WHERE `seances`.`id`=\"$seanceId\"";

        if ( $result = $conn->query( $sql ) ) {

            if ( $row = $result->fetch_assoc() ){
                $response['info'] = $row;
            }

            $result->close();
        }

        //// FEtCHING TAKEN SEATS ////

        $sql = 
        "SELECT 
            `seats`.`seat` 
        FROM `seats` 
        INNER JOIN `reservations` 
            ON `seats`.`reservation`=`reservations`.`id` 
        INNER JOIN `seances` 
            ON `reservations`.`seance`=`seances`.`id` 
        WHERE `seances`.`id`=\"$seanceId\"";

        if ( $result = $conn->query($sql) ) {
            while ( $row = $result->fetch_assoc() ){
                array_push(
                    $response['taken'],
                    intval($row['seat'])
                );
            }
            $result->close();
        }

        echo json_encode( 
            response_success( 
                $response 
            )
        );

        $conn->close();
    } else {
        echo json_encode( response_error( 403 ) );
    }
?>