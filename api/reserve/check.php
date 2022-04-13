<?php
    include '../account/auth-mixin.php';

    $uid = "";

    $uid_matched = FALSE;
    $response = [
        "ok" => FALSE,
        "reservation" => [],
        "seats" => [],
        "status" => ""
    ];

    // $message = "";

    // if ( $isAuth ) {
    //     $uid = $_SESSION['uid'];
    //     $uid_matched = TRUE;
    // } else {

    //     $required_fields = [
    //         "mobile","name"
    //     ];


    //     if ( check_if_set( $required_fields ) ) {
    //         $sql = "SELECT `id` FROM `users` WHERE `mobile`=\"\"";
            
    //         $uid_matched = TRUE;
    //     } else {
    //         $message .= "Nie podano nr telefonu lub nazwy użytkownika";
    //     }
    // }

    $required_fields = [ "reservationId" ];

    if ( check_if_set( $required_fields )) {        
        $conn = new mysqli (
            $domain_address,
            $dbusername,
            $dbpassword,
            $database
        );

        if ( $conn->connect_errno ) {
            echo json_encode(response_error( 500 ));
            exit();
        }

        prepareUtf8($conn);

        $reservationId = addslashes( $_POST['reservationId'] );

        //// FETCHING RESERVATION INFO AND 
        //// CHECK IF RESERVATION EXISTS



        $sql = "SELECT 
            `reservations`.`id`,
            `movies`.`title`,
            `seances`.`date`,
            `seances`.`time`,
            `informations`.`content`,
            `movies`.`price`
        FROM `reservations` INNER JOIN `seances`
            ON `seances`.`id`=`reservations`.`seance`
        INNER JOIN `movies`
            ON `movies`.`id`=`seances`.`movie`
        INNER JOIN `informations`
            ON `informations`.`id`=`seances`.`message`
        WHERE `reservations`.`id`=\"$reservationId\"";
        //// ZAMIENIĆ seances.price na movies.price

        $exists = FALSE;

        if ( $result = $conn->query( $sql ) ) {
            if ( $row = $result->fetch_assoc() ) {
                $exists = TRUE;
                $response['reservation'] = $row;
            }
            $result->close();
        }
        // print_r($_POST);
        // print_r($reservationId);

        if ( $exists ) {

            //// FETCHING ALL RESERVED SEATS ////

            $sql = 
            "SELECT `seat` 
            FROM `seats` 
            WHERE `reservation`=\"$reservationId\"";


            if ( $result = $conn->query( $sql ) ) {
            
                ///// WYCHODZIMY Z ZAŁOŻENIA ŻE
                ///// KAŻDE ZAMÓWIENIE MUSI MIEĆ
                ///// CONAJMNIEJ JEDNO MIEJSCE
                
                while ( $row = $result->fetch_assoc() ) {
                    array_push( $response['seats'], $row['seat'] );
                }
                $result -> close();
            }

            if ( count( $response['seats'] ) <= 0 ) {
                $response['status'] .= "Rezerwacja nie ma prawa istnieć";
            } 
            // else {
            //     $response['status'] .= "Rezerwacja nie ma prawa istnieć. ";
            // }



        } else {
            $response['status'] .= "Podana rezerwacja nie istnieje";
        }

        
        $conn->close();

    } else {
        $response['status'] .= "Nie podano nr rezerwacji";
    }


    if ( count( $response['seats'] ) ) {
        $response['ok'] = TRUE;
    }

    echo json_encode( response_success($response) );

    //// JEŚLI ZOSTANIE PODANY TYLKO NR REZERWACJI ////
    // if ( $uid_matched ) {

    // } else {

    // }
?>