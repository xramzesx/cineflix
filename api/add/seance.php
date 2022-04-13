<?php
    include '../account/auth-mixin.php';

    $required_fields = [
        "movie","date",
        "time","info"
    ];

    // print_r($_POST);

    $response = [
        "ok" => FALSE,
        "insertedID" => -1,
        "status" => ""
    ];

    if ($isAuth && $type == 0) {
        if ( check_if_set( $required_fields ) ) {
            $movie = addslashes( $_POST['movie']);
            $date = addslashes( $_POST['date']);
            $time = addslashes( $_POST['time']);
            $info = addslashes( $_POST['info']);
            
            $movieLength = 0;

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


            //// FETCHING SEANCE LENGTH ////

            $sql = 
            "SELECT `length` 
            FROM `movies` 
            WHERE `id`=\"$movie\"";


            if ( $result = $conn->query( $sql ) ) {

                if ($row = $result->fetch_assoc()) {
                    $movieLength = $row['length'];
                }

                $result->close();
            }

            //// FETCHING ALL SEANCES ON CURRENT DATE ////

            $sql = 
            "SELECT
            `seances`.`id`,
            `seances`.`time`,
            `movies`.`length`
            FROM `seances` INNER JOIN `movies`
            ON `seances`.`movie` = `movies`.`id`
            WHERE `seances`.`date`=\"$date\"";

            $seances = [];

            if ( $result = $conn->query( $sql ) ) {

                while ($row = $result->fetch_assoc()) {
                    array_push($seances, $row);
                }

                $result->close();
            }

            $isNotColliding = check_if_time_colliding(
                $time,
                $movieLength,
                $seances
            );

            if ( $isNotColliding) {
                //// INSERT VALID SEANCE ////
    
                $sql = 
                "INSERT INTO seances (
                    `movie`,
                    `date`,
                    `time`,
                    `message`
                ) VALUES (
                    \"$movie\",
                    \"$date\",
                    \"$time\",
                    \"$info\"
                )";
    
                $conn->query( $sql ) or die( json_encode(response_error( 500 )) );
    
                $response['insertedID'] = $conn->insert_id;
                $response['ok'] = TRUE;

            } else {
                $response['status'] = "Podany seans koliduje z innymi";
            }
            $conn->close();

        }
    } 

    echo json_encode(response_success( $response ));

?>