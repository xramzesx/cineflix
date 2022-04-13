<?php
    include '../voids.php';
    include '../props.php';

    if ( $_SERVER['REQUEST_METHOD'] == "POST" ) {
        // print_r($_POST);
        if ( isset( $_POST['username'] ) && isset( $_POST['password']) ) {
            // echo "w pyte byqs";
            $username = $_POST['username'];
            $password = $_POST['password'];

            $sql = "SELECT id, username, password FROM users WHERE username=\"$username\"";

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

            
            if ( $result = $conn->query($sql) ) {

                if ( $row = $result->fetch_assoc() ){
                    //// NOT WHILE LOOP BECOUSE USERNAME IS UNIQUE ////

                    $hashed_password = $row['password'];
                    
                    // echo " ".crypt($password, $hashed_password)." ";

                    if ( password_verify( $password, $hashed_password ) ){
                    // if ( hash_equals( $hashed_password, crypt( $password, $hashed_password ) ) ){
                        session_start();

                        $_SESSION['uid'] = $row['id'];

                        echo json_encode(response_success([
                            "logged" => TRUE
                        ]));
                    } else {
                        echo json_encode(response_success([
                            "logged" => FALSE
                        ]));
                    }

                    // print_r($row);
                } else {
                    echo json_encode( response_success([
                        "logged" => FALSE
                    ]));
                }

                $result->close();
            }


            $conn->close();
        }

    } else {
        echo json_encode ( response_error ( 405 ) );
    }

?>