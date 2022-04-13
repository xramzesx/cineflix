<?php
    include '../props.php';
    include '../voids.php';

    // echo "siema"
    // echo $_GET['id'];

    $response = [
        "ok" => FALSE,
        "movie" => NULL,
        "seances" => []
    ];

    $required_fields = [
        "id"
    ];

    if ( check_if_set( $required_fields, 'GET' ) ) {
        $id = $_GET['id'];


        $conn = new mysqli(
            $domain_address,
            $dbusername,
            $dbpassword,
            $database
        );

        $sql = 
        "SELECT 
            `movies`.`id`,
            `movies`.`title`,
            `movies`.`description`,
            `movies`.`trailer`,
            `movies`.`length`,
            `movies`.`release_date`,
            `movies`.`poster_ext`,
            `movies`.`price`,
            `genres`.`genre`
        FROM 
            `movies` 
        INNER JOIN 
            `genres` 
        ON `movies`.`genre`=`genres`.`id`
        WHERE `movies`.`id`=\"$id\"";

        if ($conn->connect_errno){
            echo json_encode(response_error(500));
            exit();
        }

        prepareUtf8($conn);


        if ($result = $conn->query($sql)) {
            if ($row = $result->fetch_assoc()){
                $response['movie'] = $row;
                $response['ok'] = TRUE;
            }
            $result->close();
        }

        $date_now = date("Y-m-d");
        $time_now = date("H:i:s");
        $response["date"] = $date_now;
        $response["time_now"] = $time_now;
        $sql = 
            "SELECT 
                `id`,
                `date`,
                `time` 
            FROM `seances` 
            WHERE `movie`=\"$id\" AND `date`>\"$date_now\" OR 
            `date`=\"$date_now\" AND `time`>=\"$time_now\" AND `movie`=\"$id\"
            ORDER BY `date`,`time`";

        if ( $result = $conn->query($sql) ) {
            while ( $row = $result->fetch_assoc() ) {
                array_push( $response['seances'], $row );
            }

            $result->close();
        }


        $conn->close();

    }

    echo json_encode( response_success( $response ) );    

?>