<?php

    header('Content-Type: text/html; charset=utf-8');

    //// DEFAULT JSON RESPONSE ////

    function response_error ( $error_code ) {
        $message = "error";

        switch ($error_code) {
            case 401:
                $message = "unauthorised";
                break;

            case 404:
                $message = "not found";
                # code...
                break;
            
            case 405:
                $message = "method not allowed";
                break;

            case 500:
                $message = "internal server error";
               break;

            default:
                # code...
                break;
        }

        return [
            'code' => $error_code,
            'message' => $message
        ];
    }

    function response_success( $data ) {
        //// UNCOMMENT IN PROD ////
        // $data = utf8ize($data);
        $response = [];
        foreach ($data as $key => $value) {
            # code...
            $response[$key] = $value;
        }

        $response['code'] = 200;
        $response['message'] = 'success';

        return $response;
    }

    //// UTF-8 HOSTING PROBLEM ////

    function utf8ize($d) {
        if (is_array($d)) {
            foreach ($d as $k => $v) {
                $d[$k] = utf8ize($v);
            }
        } else if (is_string ($d)) {
            return utf8_encode($d);
        }
        return $d;
    }
    
    function prepareUtf8 ( $conn ) {
        //// Problem z hostingiem ct8.pl
        //// Serwery domyślnie działa w
        //// charsecie latin1
        $conn->set_charset("utf8mb4");
        $conn->query( "SET NAMES 'utf8mb4';");
        $conn->query( "SET CHARACTER SET 'utf8mb4';");
        $conn->query( "SET COLLATION_CONNECTION = 'utf8mb4_general_ci';");
    }

    //// INPUT FORMATING ////

    function format_mobile( $mobile )
    {
        return str_replace( 
            [ 
                ".",' ',
                '-', ':', 
                "_" 
            ], 
            "", 
            $mobile
        );
    }

    function format_minutes_to_time($time, $format = '%02d:%02d') {
        if ($time < 1) {
            return;
        }
        $hours = floor($time / 60);
        $minutes = ($time % 60);
        return sprintf($format, $hours, $minutes);
    }

    //// FAST BOOLEANS ////

    function check_if_set( $arr = [], $method = "POST" ) {
        if (count( $arr ) == 0 )
            return FALSE;

        switch ($method) {
            case 'POST':
                foreach ($arr as $name) {
                    if ( !(isset($_POST["$name"]) && $_POST[$name]) ){
                        return FALSE;
                    }
                }
                break;
            
            case 'GET':
                foreach ($arr as $name) {
                    if ( !(isset($_GET["$name"]) && $_GET[$name]) ){
                        return FALSE;
                    }
                }
                break;
            default:
                # code...
                return FALSE;
                break;
        }
        
        return TRUE;
    }


    function check_if_valid_mobile($mobile){
        if ( !is_string( $mobile ) )
            return FALSE;

        $mobileLength = strlen ( $mobile );

        return 
            preg_match(
                "/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.\/0-9]*$/", 
                $mobile
            ) 
            && $mobileLength <= 15 
            && $mobileLength >= 8;
    }

    function check_if_valid_name ( $name ) {
        //// MAX DŁUGOŚĆ POLSKIEGO IMIENIA TO 13 //// 
        //// (Wierzchosława) ////
        
        if ( !is_string( $name ) )
            return FALSE;


        $nameLength = strlen($name);
        return $nameLength > 0 && $nameLength <= 13;
    }

    function is_between( $value, $from, $to ) {
        return $value >= $from && $value <= $to;
    }

    function check_if_time_colliding( $stime, $slength, $seances ) {
        global $open_hour_start, $open_hour_end;

        if ( $stime != '' ) {
            //// NEW SEANCE EDGE TIMES ////
            $seance_start_time = strtotime( $stime );
            $seance_end_time = $seance_start_time + intval($slength) * 60;

            //// CINEMA OPEN HOURS ////
            $open_start = strtotime( 
                format_minutes_to_time( 
                    $open_hour_start * 60 
                ) 
            );
            $open_end = strtotime( 
                format_minutes_to_time( 
                    $open_hour_end * 60 
                )
            );

            $is_in_open_hours = true;

            if ( 
                !is_between( $seance_start_time, $open_start, $open_end ) ||
                !is_between( $seance_end_time, $open_start, $open_end ) 
            ) {
                $is_in_open_hours = false;
                return FALSE;
            } 
            

            foreach ($seances as $key => $seance) {
                $startTime = strtotime($seance['time']);
                $endTime = $startTime + strval( $seance['length'] ) * 60;

                if ( is_between( $seance_start_time, $startTime, $endTime ) )
                    return FALSE;
                if ( is_between( $startTime, $seance_start_time, $seance_end_time ) )
                    return FALSE;
            }

            return TRUE;
        } else {
            return FALSE;
        }


        

        # code...
    }

?>