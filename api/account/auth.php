<?php
    include './auth-mixin.php';

    echo json_encode( response_success (
        $isAuth 
        ?        
            [
                "auth" => $isAuth,
                "type" => $type          
            ]
        :
            [
                "auth" => $isAuth
            ]
    ));

?>