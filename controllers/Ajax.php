<?php

session_start();

if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 3600)) {
	session_unset();
}

if(isset($_POST['action']) && !empty($_POST['action'])) {
	$action = $_POST['action'];
	switch($action){
		case "login" :
			echo connexion(json_decode($_POST['infos'], true));
			return;
		case "chargerAbout" :
 			echo chargerAbout();
			return;
		case "chargerAccueil" :
			echo chargerAccueil();
			return;
		case "chargerPost" :
			echo chargerPost($_POST['id']);
			return;
		case "sentMessage" :
			echo sentMessage(json_decode($_POST['infos'], true));
			return;
		case "chargerDownloadFile" :
			echo chargerDownloadFile($_POST['code']);
			return;
	}
	if(!estConnecte()){
		echo 3;
		return;
	} else {
		$_SESSION['LAST_ACTIVITY'] = time();
	}
	switch($action){
		case "logout" :
			echo deconnexion();
			return;
		case "changeAbout" :
			echo changeAbout(json_decode($_POST['infos'], true));
			return;
		case "commitPost" :
			echo commitPost(json_decode($_POST['infos'], true));
			return;
		case "checkConnexion" :
			echo 1;
			return;
		case "loadModifyPost" :
			echo chargerPost($_POST['id']);
			return;
		case "commitModifyPost" :
			echo commitModifyPost(json_decode($_POST['infos'], true));
			return;
		case "deletePost" :
			echo deletePost($_POST['id']);
			return;
		case "changeCode" :
			echo changeCode(json_decode($_POST['infos'], true));
			return;
	}
}


	function changeCode($map){
		if(($db = getDb()) == 2)
			return $db;

		$code = $map['newCode'];

		$codedb = crypt($code, "JeSuisUnSalt");

		$stmt = prepareQuery('UPDATE blogCode SET code = ? WHERE id = 1', $db);

		$stmt->bindParam(1, $codedb, PDO::PARAM_STR);

		try{
			$stmt->execute();
		} catch (PDOException $e){
			return 0;
		} finally {
			$db = null;
		}

		return 1;

	}

	function getDb(){
		try{
			$db = new PDO('mysql:host=localhost;dbname=bvWebsite',username,password, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
			$db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
			$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_OBJ);
		}
		catch(PDOException $e){
			return 2;
		}
		return $db;
	}

	function prepareQuery($query, $db){

		$stmt = $db->prepare($query);

		return $stmt;
	}

	function chargerDownloadFile($code){
		if(($db = getDb()) == 2)
			return $db;

		$stmt = prepareQuery('SELECT * FROM blogCode WHERE id = 1', $db);

		try{
			$stmt->execute();
		} catch (PDOException $e){
			return 0;
		} finally {
			$db = null;
		}

		$tab = $stmt->fetchAll();
		if(sizeof($tab)==0){
			return 7;
		} else {
			if(crypt($code, "JeSuisUnSalt") === $tab[0]->code){
				return 1;
			}
			return 7;
		}


	}

	function sentMessage($map){
		$nom = $map['nomContact'];
		$email = $map['mailContact'];
		$message = $map['messageContact'];

		$texte = "Received from : " . $nom . "\n";
		$texte .= "Mail of contact : " . $email . "\n";
		$texte .= "Message left : \n\n" . $message;

		$longueur = strlen($texte);

		if($longueur > 1000){
			return 5;
		}

		if(mail('brigittevanatoru@hotmail.com', "Message venant d'un utilisateur du site",$texte))
			return 1;
		return 0;
	}

	function commitModifyPost($map){
		if(($db = getDb()) == 2)
			return $db;

			$db->beginTransaction();

			$id = $map['idPoste'];
			$titre = $map['titreBlog'];
			$texte = $map['texte'];
			$prioritaire = $map['prioritaire'];
			$subtitle = $map['sousTitreBlog'];
			$pinned;

			if(strcmp($prioritaire,"none") == 0){
				$pinned = 0;
			} else $pinned = 1;

			if(isset($_FILES['file'])){
				$target_file = "../files/" . basename($_FILES['file']['name']);
				$stmt = prepareQuery('UPDATE blogs SET title = ?, text = ?, pinned = ?, subtitle = ?, fichier = ? WHERE id = ?', $db);
				$stmt->bindParam(5, $target_file, PDO::PARAM_STR);
				$stmt->bindParam(6, $id, PDO::PARAM_INT);
			} else {
				$stmt = prepareQuery('UPDATE blogs SET title = ?, text = ?, pinned = ?, subtitle = ? WHERE id = ?', $db);
				$stmt->bindParam(5, $id, PDO::PARAM_INT);
			}

			$stmt->bindParam(1, $titre, PDO::PARAM_STR);
			$stmt->bindParam(2, $texte, PDO::PARAM_STR);
			$stmt->bindParam(3, $pinned, PDO::PARAM_BOOL);
			$stmt->bindParam(4, $subtitle, PDO::PARAM_STR);

			try{
				$stmt->execute();
			} catch (PDOException $e){
				$db = null;
				return 2;
			}

			if(!isset($_FILES['file'])){
				$db->commit();
				$db = null;
				return 1;
			}

			if($_FILES['file']['size'] > 1000000){
				$db->rollback();
				$db = null;
				return 4;
			}

			if(file_exists($target_file)){
				unlink($target_file);
			}

			if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
				$db->commit();
				$db = null;
				return 1;
			} else {
				$db->rollBack();
				$db = null;
				return 0;
			}

	}

	function connexion($map){
		if(($db = getDb()) == 2)
			return $db;

		$stmt = prepareQuery('SELECT * FROM admins WHERE nick = ?', $db);

		$nom = $map['username'];
		$password = $map['password'];

		$stmt->bindParam(1, $nom, PDO::PARAM_STR);

		try{
			$stmt->execute();
		} catch (PDOException $e){
			return 0;
		} finally {
			$db = null;
		}


		$tab = $stmt->fetchAll();
		if(sizeof($tab)==0){
			return 6;
		} else {
			if(crypt($password, "JeSuisUnSalt") === $tab[0]->password){
				$_SESSION['name'] = $nom;
				return 1;
			}
			return 6;
		}
	}

	function commitPost($map){
		if(($db = getDb()) == 2)
			return $db;

		$db->beginTransaction();


		$titre = $map['titreBlog'];
		$texte = $map['texte'];
		$subtitle = $map['sousTitreBlog'];

		if(isset($_FILES['file'])){
			$target_file = "../files/" . basename($_FILES['file']['name']);
			$stmt = prepareQuery('INSERT INTO blogs VALUES (DEFAULT, DEFAULT, ?, ?, ?, ?, DEFAULT, DEFAULT)', $db);
			$stmt->bindParam(4, $target_file, PDO::PARAM_STR);
		} else {
			$stmt = prepareQuery('INSERT INTO blogs VALUES (DEFAULT, DEFAULT, ?, ?, ?, DEFAULT, DEFAULT, DEFAULT)', $db);
		}

		$stmt->bindParam(1, $titre, PDO::PARAM_STR);
		$stmt->bindParam(2, $subtitle, PDO::PARAM_STR);
		$stmt->bindParam(3, $texte, PDO::PARAM_STR);

		try{
			$stmt->execute();
		} catch (PDOException $e){
			$db = null;
			return 2;
		}

		if(!isset($_FILES['file'])){
			$db->commit();
			$db = null;
			return 1;
		}

		if($_FILES['file']['size'] > 10000000){
			$db->rollback();
			$db = null;
			return 4;
		}

		if(file_exists($target_file)){
			unlink($targer_file);
		}

		if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
			$db->commit();
			$db = null;
			return 1;
		} else {
			$db->rollBack();
			$db = null;
			return 0;
		}

	}

	function chargerAccueil(){
		if(($db = getDb()) == 2)
			return $db;

		$stmt = prepareQuery('SELECT * FROM blogs WHERE blogs.deleted = FALSE ORDER BY blogs.pinned, blogs.date DESC', $db);

		try{
			$stmt->execute();
		} catch (PDOException $e){
			return 0;
		} finally{
			$db = null;
		}

		$tab = $stmt->fetchAll();
		if(sizeof($tab)==0){
			return 0;
		} else {
			return json_encode($tab);
		}
	}

	function deletePost($id){
		if(($db = getDb()) == 2)
			return $db;

		$stmt = prepareQuery('UPDATE blogs SET deleted=TRUE WHERE id = ?', $db);

		$stmt->bindParam(1, $id, PDO::PARAM_INT);

		try{
			$stmt->execute();
		} catch (PDOException $e){
			return 0;
		} finally {
			$db = null;
		}

		return 1;
	}

	function chargerPost($id){
		if(($db = getDb()) == 2)
			return $db;

		$stmt = prepareQuery('SELECT * FROM blogs WHERE blogs.id = ? AND blogs.deleted = 0', $db);

		$stmt->bindParam(1, $id, PDO::PARAM_INT);

		try{
			$stmt->execute();
		} catch (PDOException $e){
			return 0;
		} finally {
			$db = null;
		}

		$tab = $stmt->fetchAll();
		if(sizeof($tab)==0){
			return 0;
		} else {
			return json_encode($tab[0]);
		}
	}

	function chargerAbout(){
		if(($db = getDb()) == 2)
			return $db;

		$stmt = prepareQuery('SELECT * FROM aPropos WHERE id = 1', $db);

		try{
			$stmt->execute();
		} catch (PDOException $e){
			return 0;
		} finally {
			$db = null;
		}

		$tab = $stmt->fetchAll();

		if(sizeof($tab)==0){
			return 0;
		} else {
			return json_encode($tab[0]);
		}

	}

	function changeAbout($map){

		if(($db = getDb()) == 2)
			return $db;

		$stmt = prepareQuery('UPDATE aPropos SET texte = ? WHERE aPropos.id = 1', $db);

		$texte = $map['texte'];

		$stmt->bindParam(1, $texte, PDO::PARAM_STR);

		try{
			$stmt->execute();
		} catch (PDOException $e){
			return 0;
		} finally {
			$db = null;
		}
		return 1;

	}

	function deconnexion(){
		session_unset();
		return 1;
	}

	function estConnecte(){
		if(isset($_SESSION['name'])){
			return true;
		} else {
			return false;
		}
	}
// }

?>
