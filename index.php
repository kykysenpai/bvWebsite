<?php

	ini_set('display_errors', 1);

	#function to write in the console
	function debug_to_console( $data ) {
		$output = $data;
		if ( is_array( $output ) )
			$output = implode( ',', $output);

			echo "<script>console.log( 'Debug Objects: " . $output . "' );</script>";
	}


	#definition of the autoload of classes (models and controllers)
	function loadClass($classe) {
		$sources = array("controllers/$classe.php");
		foreach($sources as $source){
			if(file_exists($source)){
				require $source;
			}
		}
	}
	spl_autoload_register('loadClass');

	require_once('views/header.php');

	$login = new LoginController();
	$accueil = new AccueilController();
	$about = new AboutController();
	$contact = new ContactController();
	$posts = new PostsController();
	$fichiers = new FichiersController();
	$news = new NewsController();

	$accueil->run();
	$about->run();
	$contact->run();
	$posts->run();
	$login->run();
	$fichiers->run();
	$news->run();

	require_once('views/footer.php');

?>
