<?php
    include '../account/auth-mixin.php';

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

    prepareUtf8($conn);

    $response = [
        "ok" => FALSE,
        "taken" => [],
        "alreadyTaken" => FALSE,
        "status" => "",
        "reservationId" => -1
    ];

    $uid = "";

    // $ok = FALSE;

    $uid_matched = FALSE;


    //// GETTING UID FIRST /////

    if ( $isAuth ) {
        $uid = $_SESSION['uid'];
        $uid_matched = TRUE;
    } else {
        $required_fields = [
            "name", "mobile"
        ];

        if ( check_if_set( $required_fields ) ) {
            $name = addslashes( $_POST['name'] );
            $mobile = format_mobile(  
                $_POST['mobile'] 
            );

            //// SERVER SIDE VALIDATION ////
            
            // $mobileLength = strlen ( $mobile );

            // $isValidMobile = 
            //     preg_match(
            //         "/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.\/0-9]*$/", 
            //         $mobile
            //     ) 
            //     && $mobileLength <= 15 
            //     && $mobileLength >= 8;
            
            
            $isValidMobile = check_if_valid_mobile( $mobile );

            if ( $isValidMobile ) {
                $mobile = addslashes( $mobile );

                //// CHECKING IF THERE IS ALREADY IN TABLE ////
                //// AND IT'S RESERVE_ONLY TYPE ////

                $sql = 
                "SELECT `users`.`id`,`permissions`.`type` 
                FROM `permissions` INNER JOIN `users`
                ON `permissions`.`id` = `users`.`type`
                WHERE `users`.`mobile`=\"$mobile\"";

                $isMobileAlreadyStored = FALSE;

                if ($result = $conn->query( $sql )) {
                    $isGoodType = TRUE;

                    if ( $row = $result->fetch_assoc() ) {
                        //// IF A NIE FOR, BO PODCZAS REJESTRACJI
                        //// SCALAMY WSZYSTKIE NUMERY TELEFONU DO JEDNEGO KONTA
                        
                        if ( $row['type'] != "reserve_only" ) {
                            $isGoodType = FALSE;
                        } else {
                            $uid = $row['id'];
                            $uid_matched = TRUE;
                        }
                        $isMobileAlreadyStored = TRUE;
                    }
                    
                    $result -> close();

                    if ( !$isGoodType ) {
                        $conn->close();
                        $response['status'] .= "Numer telefonu jest już przypisany do istniejącego konta. Aby go użyć, zaloguj się";
                        echo json_encode( response_success( $response ) );
                        exit();                        
                    }

                }

                $isMobileWithSameName = FALSE;


                if ( $isMobileAlreadyStored ) {
                    $sql = 
                    "SELECT `users`.`id`,`permissions`.`type` 
                    FROM `permissions` INNER JOIN `users`
                    ON `permissions`.`id` = `users`.`type`
                    WHERE `users`.`mobile`=\"$mobile\" AND `users`.`name`=\"$name\"";
                    
                    if ($result = $conn->query( $sql )) {
                        if ( $row = $result->fetch_assoc() ) {
                            $uid = $row['id'];
                            $uid_matched = TRUE;
                        }
    
                        $result->close();
                    }
                }

                if ( !$isMobileAlreadyStored && !$isMobileWithSameName) {
                    // $sql = "SELECT `id` FROM `permissions` WHERE `type`=\"reserve_only\"";

                    // $type_id = 

                    $sql = 
                    "INSERT INTO `users`(`name`,`mobile`,`type`) 
                    SELECT \"$name\",\"$mobile\",`permissions`.`id`
                    FROM `permissions`
                    WHERE `permissions`.`type`=\"reserve_only\"";

                    $conn->query( $sql ) or die( json_encode(response_error(500)) );

                    $uid = $conn->insert_id;
                    $uid_matched = TRUE;

                    // echo $uid." boghadztwo ";
                }
                 

            } else {
                $conn->close();
                $response['status'] .= "Niewłaściwy numer telefonu. ";
                echo json_encode( response_success( $response ) );            
                exit();
            }

        } else {
            $conn->close();
            $response['status'] .= "Imię lub nr telefonu jest niezdefiniowany.";
            echo json_encode( response_success( $response ) );
            exit();
        }
    }


    $required_fields = [
        "seats", "seance"
    ];


    if ( check_if_set( $required_fields ) ) {
        $seance = addslashes($_POST['seance']);
        $seats = explode( "," , $_POST['seats'] );

        if ( count( $seats ) ) {
            if ( $uid_matched ) {
                
                //// CHECKING IF THERE IS ALREADY TAKEN SEATS ////

                $alreadyTaken = [];

                foreach ($seats as $key => $seat) {
                    $sql = 
                    "SELECT 
                        `seats`.`id` 
                    FROM `seats` 
                    INNER JOIN `reservations` 
                        ON `seats`.`reservation`=`reservations`.`id` 
                    INNER JOIN `seances` 
                        ON `reservations`.`seance`=`seances`.`id` 
                    WHERE `seances`.`id`=\"$seance\" AND `seats`.`seat`=\"".addslashes( $seat )."\"";
                    // echo $seat;
                    if ( $result = $conn->query( $sql ) ) {
                        if ( $row = $result->fetch_assoc() ) {
                            // print_r($row);
                            array_push( $alreadyTaken, $seat );
                        }
                        $result->close();
                    }
                }

                if ( count( $alreadyTaken ) ) {
                    //// SOME SEATS ARE ALREADY TAKEN ////
                    $sql = 
                    "SELECT 
                        `seats`.`seat` 
                    FROM `seats` 
                    INNER JOIN `reservations` 
                        ON `seats`.`reservation`=`reservations`.`id` 
                    INNER JOIN `seances` 
                        ON `reservations`.`seance`=`seances`.`id` 
                    WHERE `seances`.`id`=\"$seance\"";

                    $response['alreadyTaken'] = TRUE;
                    $response['matched'] = $alreadyTaken;
                    $response['status'] .= "Niektóre miejsca zostały już zajęte. ";

                    if ( $result = $conn->query( $sql ) ){

                        while ( $row = $result->fetch_assoc() ) {
                            array_push( $response['taken'], $row['seat'] );
                        }

                        $result->close();
                    }

                    echo json_encode( response_success ( $response ) );

                } else {
                    //// CREATE NEW RESERVATION ////

                    $sql = 
                    "INSERT INTO `reservations`(`user`,`seance`)
                    VALUES ( \"$uid\", \"$seance\" )";

                    $conn->query( $sql ) or die( json_encode(response_error(500)) );
                    $reservationId = sprintf( "%011d",$conn->insert_id);

                    
                    //// CREATE SEATS INSERTION QUERY ////
                    $sql = "INSERT INTO `seats`(`seat`,`reservation`) VALUES";
    
                    foreach ($seats as $key => $seat) {
                        if ( $key == 0 )
                            $sql .= " (\"".addslashes($seat)."\",\"$reservationId\")";
                        else
                            $sql .= ", (\"".addslashes($seat)."\",\"$reservationId\")";
    
                    }
    
                    $conn->query( $sql ) or die( json_encode(response_error(500)) );
    
                    $response['ok'] = TRUE;
                    $response['reservationId'] = $reservationId;
                    $response['status'] .= "Pomyślnie zarezerwowano bilety";
                    echo json_encode( response_success( $response ) );
                }
            } else {
                $conn->close();
                $response['status'] .= "Problem z identyfikatorem użytkownika. ";
                echo json_encode( response_success( $response ) );
                exit();
            }
        } else {
            $conn->close();
            $response['status'] .= "Nie wybrano żadnego miejsca. ";
            echo json_encode( response_success( $response ) );
            exit();            
        }

    } else {
        $conn->close();
        $response['status'] .= "Nie podano seansu lub miejsc. ";
        echo json_encode( response_success( $response ) );
        exit();
    }


    $conn->close();
?>