<?php
    include '../account/auth-mixin.php';
    
    // ini_set()
    
    $required_fields = [ 
        'title','trailer', 
        'genre', 'description', 
        'length', 'release_date',
        'price'
    ];
    // echo check_if_set($required_fields);
    
    // echo htmlspecialchars(" siema mord \" deczko ");
    // echo " siema mord \" deczko";
    // echo urldecode(" siema mord \" deczko");
    // echo addslashes(" siema mord \" deczko");
    // echo mysqli->real_escape_string(" siema mord \" deczko");
    if ( !(check_if_set($required_fields) && isset($_FILES['poster']) ) ) {
        echo json_encode(response_error(403));
        exit();
    }


    if ( $isAuth && $type === "0") {

        $path = pathinfo( $_FILES['poster']['name'] );
        $file_extension = $path['extension'];

        // echo $file_extension;


        // print_r($_POST);

        $title = addslashes( $_POST['title'] );
        $genre = addslashes( $_POST['genre'] );
        $description = addslashes( $_POST['description'] );
        $trailer = addslashes( $_POST['trailer'] );
        $length = addslashes( $_POST['length'] );
        $price = addslashes( $_POST['price'] );
        // $poster = addslashes( $_FILES['poster'] );
        $release_date = addslashes( $_POST['release_date'] );
        // echo base64_encode($poster);
        $sql = 
            "INSERT INTO movies (
                `title`,
                `genre`,
                `description`,
                `trailer`,
                `length`,
                `poster_ext`,
                `release_date`,
                `price`
            ) VALUES (
                \"$title\",
                \"$genre\",
                \"$description\",
                \"$trailer\",
                \"$length\",
                \"$file_extension\",
                \"$release_date\",
                \"$price\"
            )";


        //// dorobić lepsze miniaturki /////
        // echo $sql;
        $conn = new mysqli (
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

        $conn->query( $sql ) or die( json_encode(response_error(500)) );


        $id = $conn->insert_id;
        $uploaddir = '../posters/';
        $uploadfile = $uploaddir.$id.'.'.$file_extension;



        $conn->close();
        // echo $description;
        // echo $_FILES['poster']['name'];
        // move_uploaded_file( $_FILES['poster']['name'], "./siema.png"  );

        echo json_encode( response_success([
            "id" => $id,
            "file_ok" => move_uploaded_file( 
                $_FILES['poster']['tmp_name'], 
                $uploadfile 
            )
        ]));
        // print_r($_FILES);
    } else {

    }
?>