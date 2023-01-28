<?php

    // allow cross domain requests
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET");
    header('Content-type: application/json');
    
    $results_prefix = "results/";

    $json = file_get_contents("php://input");
    $contents = json_decode($json, true);

    if (isset($contents['ratings'])) {
	    //$testresults = trim($contents['ratings']);
	    //$username = trim($contents['name']);

        $id = $contents['id'];
	    
   	    $filename = "results/R_".$id."_".date("md-Hi").".json";
            //$filename = "results/RESULTS.txt";
    	
	    // write data
	    $err1 = file_put_contents($filename, $json."\n", FILE_APPEND);	
	
	    if ($err1===false) {
            	$return['error'] = "true";
            	$return['message'] = "Error writing data!".$json;    
	    } else {
            	$return['error'] = "false";
            	$return['message'] = "Data is saved!";    
	    }
    } else {
        $return['error'] = true;
        $return['message'] = "Invalid data sent!".$json;    
    }
    
    
    // return 
    echo json_encode($return);

?>
