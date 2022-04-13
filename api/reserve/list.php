<?php
    include '../account/auth-mixin.php';

    $uid = "";

    $conn = new mysqli (
        $domain_address,
        $dbusername,
        $dbpassword,
        $database
    );


    if ( $conn->connect_errno ) {
        echo json_encode( response_error( 500) );
        exit();
    }

    prepareUtf8($conn);

    $uid_matched = FALSE;
    $response = [
        "ok" => FALSE,
        "information" => [],
        "reservations" => [],
    ];

    $message = "";

    if ( $isAuth ) {
        $uid = $_SESSION['uid'];
        $uid_matched = TRUE;
    } else {

        $required_fields = [
            "mobile","name"
        ];


        if ( check_if_set( $required_fields ) ) {
            $mobile = format_mobile( $_POST['mobile'] );
            $name = $_POST['name'];
            
            $isValidMobile = check_if_valid_mobile( $mobile );
            $isValidName = check_if_valid_name( $name );

            if ( $isValidMobile && $isValidName ) {
                $mobile = addslashes($mobile);
                $name = addslashes($name);

                // echo $mobile;
                $sql = "SELECT `id` FROM `users` WHERE `mobile`=\"$mobile\" AND `name`=\"$name\"";
                
                if ( $result = $conn->query ( $sql ) ) {
                    if ( $row = $result->fetch_assoc() ) {
                        // echo $mobile;
                        $uid = $row['id'];
                        $uid_matched = TRUE;
                    }
                    $result->close();
                }
    
            }

        } else {
            $message .= "Nie podano nr telefonu lub nazwy użytkownika. ";
        }
    }

    if ( $uid_matched ) {
        //// FETCH ALL RESERVATIONS /////
        //// ASSIGNED TO ACCOUNT    /////

        $sql = 
        "SELECT 
            `reservations`.`id`, 
            `movies`.`title`,
            `seances`.`date`,
            `seances`.`time`
        FROM `reservations` INNER JOIN `seances`
            ON `seances`.`id`=`reservations`.`seance`
        INNER JOIN `movies`
            ON `movies`.`id`=`seances`.`movie`
        WHERE `reservations`.`user`=\"$uid\"
        ORDER BY `seances`.`date`,`seances`.`time` DESC";

        if ( $result = $conn->query( $sql ) ) {

            while ( $row = $result->fetch_assoc()) {
                array_push( 
                    $response['reservations'], 
                    $row
                );
            }

            $result->close();
        }

        $response['ok'] = TRUE;
    } else {
        $message .= "Nie znaleziono użytkownika z przypisanymi seansami";
    }

    $response['status'] = $message;
    echo json_encode( response_success( $response ) );

    $conn->close();
?>