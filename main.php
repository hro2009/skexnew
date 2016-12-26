<?php

	//require_once("db.php");
	if(isset($_POST['imgDataUrl'])){
		
		$data =  $_POST['imgDataUrl'];
		$desc =  $_POST['desc'];
		$today = date('mdy');
		list($type, $data) = explode(';', $data);
		list(, $data)      = explode(',', $data);
		$data = base64_decode($data);
		
		$im = imagecreatefromstring($data);
		imagealphablending($im, false);
		$transparency = imagecolorallocatealpha($im, 0, 0, 0, 127);
		imagefill($im, 0, 0, $transparency);
		imagesavealpha($im, true);


		if ($im !== false) {
		   imagepng($im, 'simple.png');

		// Free up memory
		imagedestroy($im);
		}

		/*$imagePath = 'productImages/';
		$imageName = $today.'.png';
		$res = file_put_contents($imagePath.$imageName, $data);
		
		$sql = "SELECT * FROM invoicelines WHERE DATE(datetime)=CURDATE()";
		$result = $conn->query($sql);
		if ($result->num_rows > 0) {
			$row = $result->fetch_assoc();
		  	echo 2;
		} else {
		   $sql = "INSERT INTO invoicelines (description, image) VALUES ('".$desc."', '".$imageName."')";
			if ($conn->query($sql) === TRUE) {
			    echo 1;
			} else {
			    echo 0;
			}
		}*/
	}