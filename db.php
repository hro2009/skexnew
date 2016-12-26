<?php

	$servername = "localhost";
	$username = "foupawee_hro2009";
	$password = "hayastan1986";
	$dbname = "foupawee_skeleton";
	// Create connection
	$conn = mysqli_connect($servername, $username, $password, $dbname);
	// Check connection
	if (!$conn) {
		die("Connection failed: " . mysqli_connect_error());
	}
