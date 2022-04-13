<?php
    include '../voids.php';
    include '../props.php';

    if ( $_SERVER['REQUEST_METHOD'] == "POST" ) {
        // print_r($_POST);

        $required_fields = [
            'username','password',
            'name', 'surname',
            'email'
        ];

        $response = [
            "ok" => FALSE,
            "status" => ""
        ];


        if ( check_if_set( $required_fields ) ) {
            
            $username = addslashes($_POST['username']);
            $name = addslashes($_POST['name']);
            $surname = addslashes($_POST['surname']);
            $email = addslashes($_POST['email']);
            
            /// W DALSZEJ CZĘŚCI HASŁO BĘDZIE HASZOWANE
            $password = $_POST['password']; 
            
            // $isMobileSet = check_if_set( [ "mobile" ] );

            // $mobile = $isMobileSet ? addslashes($_POST['mobile']) : "";



            //// VALIDATE INPUT FIRST /////
            
            $isEmailValid = filter_var( $email, FILTER_VALIDATE_EMAIL );
            
            // $isMobileValid = $isMobileSet ? check_if_valid_mobile ( $mobile ) :TRUE;
            // $isMobileValid = ;
            // $isNameValid = check_if_valid_name( $name );

            if ( $isEmailValid ) {
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

                //// CHECK IF THERE IS ALREADY ANOTHER ACCOUNT ////
                //// ASSIGNED TO MATCHED PARAMS ////
                $sql = 
                "SELECT 
                `id`, 
                `username`,
                `email`
                FROM `users` 
                WHERE `username`=\"$username\" OR `email`=\"$email\"";
                
                // .( 
                //     $isMobileSet 
                //     ? " OR `email` is not null AND `mobile`=\"$mobile\"" 
                //     : "" 
                // )


                $isNotUsed = TRUE;
    
                if ( $result = $conn->query($sql) ) {
    
                    if ( $row = $result->fetch_assoc() ){
                        $isNotUsed = FALSE;
                        //// Jeden wiersz wystarczy 
    
                        //// NOT WHILE LOOP BECOUSE USERNAME IS UNIQUE ////
    
                        // $hashed_password = $row['password'];
                        
                        // echo " ".crypt($password, $hashed_password)." ";
    
                        // if ( password_verify( $password, $hashed_password ) ){
                        // // if ( hash_equals( $hashed_password, crypt( $password, $hashed_password ) ) ){
                        //     session_start();
    
                        //     $_SESSION['uid'] = $row['id'];
    
                        //     echo json_encode(response_success([
                        //         "logged" => TRUE
                        //     ]));
                        // } else {
                        //     echo json_encode(response_success([
                        //         "logged" => FALSE
                        //     ]));
                        // }
    
                        // print_r($row);
                    } 
    
                    $result->close();
                }
    
    
                //// IF EVERYTHING IS OK
                //// INSERT NEW ACCOUNT
                
                if ( $isNotUsed ) {

                    
                    // $sql = "SELECT `id` FROM `permissions` WHERE `type`=\"user\""

                    //// PASSWORD HASHING ////

                    $hashed = password_hash($password, PASSWORD_DEFAULT);


                    $sql = 
                    "INSERT INTO `users` (
                        `username`,
                        `name`,
                        `surname`,
                        `password`,
                        `email`,
                        `type`
                    ) SELECT 
                        \"$username\",
                        \"$name\",
                        \"$surname\",
                        \"$hashed\",
                        \"$email\",
                        `permissions`.`id`
                    FROM `permissions`
                    WHERE `permissions`.`type`=\"user\"";
                    
                    $conn->query($sql) or die ( json_encode( response_error(500) ) );
                    
                    session_start();
                    $_SESSION['uid'] = $conn->insert_id;

                    $response['ok'] = TRUE;

                } else {
                    $response['status'] .= "Już istnieje użytkownik o takich danych";
                }
    
                $conn->close();

            } else {
                $response['status'] .= "Niepoprawne dane formularza";
            }
            echo json_encode( response_success( $response ) );
        }

    } else {
        echo json_encode ( response_error ( 405 ) );
    }

?>