<?php
    include '../props.php';
    include '../voids.php';

    $response = [
        "movies" => [],
        "newest" => [],
        "bestsellers" => [],
    ];
    
    $conn = new mysqli(
        $domain_address,
        $dbusername,
        $dbpassword,
        $database
    );

    if ( $conn->connect_errno){
        echo json_encode(response_error(500));
        exit();
    }

    prepareUtf8($conn);

    //// ALL MOVIES ////
    //// Na potrzeby projektu, pobieramy listę wszystkich filmów
    //// w prawdziwym scenariuszu pobralibyśmy tylko określoną liczbę filmów
    $sql = "SELECT `id`, `title`, `poster_ext` FROM `movies`";

    if ($result = $conn->query($sql)){
        while ( $row = $result->fetch_assoc()) {
            array_push($response['movies'], $row);
        }

        $result->close();
    }

    //// NEW ////

    $sql = 
    "SELECT 
        `id`,
        `title`,
        `poster_ext`,
        `trailer` 
    FROM `movies` 
    ORDER BY `release_date` 
    DESC LIMIT 5";
    
    if ($result = $conn->query($sql)){
        while ( $row = $result->fetch_assoc()) {
            array_push($response['newest'], $row);
        }

        $result->close();
    }


    //// BESTSELLERS ////

    // $sql = "SELECT `movies`.`id`,`movies`.`title`,`movies`.`poster_ext` ,COUNT(`seats`.`id`) 
    // FROM `movies` INNER JOIN `seances`
    // ON `movies`.`id`=`seances`.`movie`
    // INNER JOIN `reservations`
    // ON `seances`.`id`=`reservations`.`seance`
    // INNER JOIN `seats`
    // ON `reservations`.`id`=`seats`.`reservation`
    // GROUP BY `movies`.`id`";

    $sql = 
    "SELECT 
        `movies`.`id`,
        `movies`.`title`,
        `movies`.`poster_ext`
    FROM `movies` INNER JOIN `seances`
        ON `movies`.`id`=`seances`.`movie`
    INNER JOIN `reservations`
        ON `seances`.`id`=`reservations`.`seance`
    INNER JOIN `seats`
        ON `reservations`.`id`=`seats`.`reservation`
    GROUP BY `movies`.`id`
    ORDER BY COUNT(`seats`.`id`) DESC LIMIT 5";

    if ($result = $conn->query($sql)){
        while ( $row = $result->fetch_assoc()) {
            array_push($response['bestsellers'], $row);
        }

        $result->close();
    }


    $conn->close();

    echo json_encode(response_success( $response ));

?>