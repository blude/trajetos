<?php

ini_set( 'display_errors', true );
error_reporting( E_ALL );

define( 'SELF', $_SERVER['REQUEST_URI'] );

function partial( $names, $page = array() ) {
	if ( (bool) $names ) {
		foreach ( $names as $name ) { 
			include "$name.php";
		}
	}
}

$json = file_get_contents( 'data/itineraries.json' );
$data = json_decode( $json );

function getItinerary( $line = null, $bound_to = null ) {
	global $data;
	$id = 1;
	foreach ( $data->points as $point ) {
		$type = $point->type;
		$pid = str_pad( (int) $id, 4, "0", STR_PAD_LEFT );
		include "points/$type.php";
		$id++;
	}
}

function streetView( $lat, $lon, $fov, $heading = 330, $pitch = 5 ) {
	echo '<img src="http://maps.googleapis.com/maps/api/streetview?size=416x312&fov=' .$fov. '&location=' .$lat. '%20' .$lon. '&heading=' .$heading. '&pitch=' .$pitch. '&sensor=false" alt="" width="208" height="156">';
}

/*
{
    "121": {
        "sentido": {
            "Jardim Camburi": {},
            "Mario Cypreste": {
                "pontos": [
                    {
                        "type": "oioi",
                        "category": "hehehe",
                        "numero": 1234
                    },
                    {}
                ]
            }
        }
    },
    "211": "opa"
}
 */
?>