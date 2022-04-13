<?php
    include './auth-mixin.php';

    $response = [
        "auth" => $isAuth,
        "type" => -1,
        "tables" => []
    ];

    if ( $isAuth ) {
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

        $uid = $_SESSION['uid'];

        $sql = 
            "SELECT 
                `username`, 
                `name`, 
                `surname`, 
                `email`, 
                `mobile`, 
                `joined` 
            FROM users 
            WHERE id=\"$uid\"";

        if ( $result = $conn->query($sql) ){
            if ( $row = $result->fetch_assoc() ){
                $response['user'] = $row;
            }
            $result->close();
        }
        
        if ( $type == 0 ) {
            $sql = 
            "SELECT
                `reservations`.`id` as `reservation`,
                `users`.`id` as `user`,
                `users`.`name`,
                `seances`.`id` as `seance`
            FROM `users` INNER JOIN `reservations`
                ON `users`.`id`=`reservations`.`user`
            INNER JOIN `seances`
                ON `reservations`.`seance`=`seances`.`id`
            ORDER BY `reservations`.`date` DESC
            LIMIT 5";

            $last_reservations = [];

            if ( $result = $conn->query($sql) ){
                while ( $row = $result->fetch_assoc() ){
                    array_push($last_reservations, $row );
                }
                $result->close();
            }
            
            array_push( $response['tables'], [
                "name" => "Ostatnie rezerwacje",
                "content" => $last_reservations
            ]);
            
            $sql = 
            "SELECT
                `users`.`id`,
                `users`.`name`,
                `users`.`email`,
                `users`.`mobile`
            FROM `users`
            ORDER BY `users`.`joined` DESC
            LIMIT 5";

            $new_users = [];

            if ( $result = $conn->query($sql) ){
                while ( $row = $result->fetch_assoc() ){
                    array_push($new_users, $row );
                }
                $result->close();
            }
            
            array_push( $response['tables'], [
                "name" => "Nowi użytkownicy",
                "content" => $new_users
            ]);
            

        }

        $sql = 
        "SELECT
            `reservations`.`id`,
            `movies`.`title`,
            `seances`.`date`,
            `seances`.`time`
        FROM `users` INNER JOIN `reservations`
            ON `users`.`id`=`reservations`.`user`
        INNER JOIN `seances`
            ON `reservations`.`seance`=`seances`.`id`
        INNER JOIN `movies`
            ON `seances`.`movie`=`movies`.`id`
        WHERE `users`.`id`=\"$uid\"
        ORDER BY `reservations`.`date` DESC
        LIMIT 10";

        $my_reservations = [];

        if ( $result = $conn->query($sql) ){
            while ( $row = $result->fetch_assoc() ){
                array_push($my_reservations, $row );
            }
            $result->close();
        }
        
        array_push( $response['tables'], [
            "name" => "Moje rezerwacje",
            "content" => $my_reservations
        ]);


        $response['type'] = $type;
        // $sql = "SELECT * FROM "

        $conn->close();
        
    } 
    
    echo json_encode(response_success( $response ));
?>