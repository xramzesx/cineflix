<?php
    include '../account/auth-mixin.php';

    // echo $isAuth;

    if ($isAuth) {
        $genres = [];

        $conn = new mysqli(
            $domain_address,
            $dbusername,
            $dbpassword,
            $database
        );

        if ( $conn->connect_errno ) {
            echo json_encode( 
                response_error( 500 ) 
            );
            exit();
        }

        prepareUtf8($conn);

        $empty_id=1;

        $sql = "SELECT `id`, `genre` FROM genres WHERE id=$empty_id";

        if ($result = $conn->query($sql)){
            if ($row = $result->fetch_assoc()){
                array_push($genres,[
                    "genre" => $row['genre'],
                    "id"    => $row['id']
                ]);
            }
            $result->close();
        }

        $sql = "SELECT `id`, `genre` FROM genres WHERE id!=$empty_id ORDER BY genre";  /// ORDER BY genre


        if ( $result = $conn->query($sql) ) {
            while ( $row = $result->fetch_assoc() ) {
                // echo $row['genre'];
                array_push($genres,[
                    "genre" => $row['genre'],
                    "id"    => $row['id']
                ]);

            }
            // echo "siema";
        }
        
        echo json_encode(response_success([
            "genres" => $genres
        ]));

        $conn->close();
    } else {
        echo json_encode(response_success([
            "genres"=> []
        ]));
    }

?>