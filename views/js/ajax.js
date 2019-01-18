function ajax(){
	var self = {};

	self.deconnexion = function(){
		$.ajax({
			url: '/controllers/Ajax.php',
			data: {action: 'logout'},
			type: 'POST',
			success: function(output){
				gererOutput(output, "Deconnexion");
				if(output === "1"){
					chargerUtilisateur();
				}
				updateLoggedin(false);
			},
			error: function(output){
				gererOutput(output, "Deconnexion");
			}
		});
	}

	self.sentMessage = function(map){
		$.ajax({
			url: '/controllers/Ajax.php',
			data: {action: 'sentMessage', infos: JSON.stringify(map)},
			type: 'POST',
			success: function(output){
				gererOutput(output,"Envoi de message");
				chargerUtilisateur();
			},
			error : function(output){
				gererOutput(output, "Envoi de message");
			}
		});
	}

	self.chargerAbout = function(){
		$.ajax({
			url: '/controllers/Ajax.php',
			data: {action: 'chargerAbout'},
			type: 'POST',
			success: function(output){
				gererOutput(output, "Chargement de la page \"about\"");
				if(output.length > 1){
					$map = JSON.parse(output);
					$texte = $map['texte'];
					$('#aboutUtilisateur').html($texte);
					if(logged_in){
						$('#texteareaAboutAdmin').val($texte);
					}
				}
			},
			error: function(output){
				gererOutput(output, "Chargement de la page \"about\"");
			}
		});
	}

	self.changeCode = function($map){
		$.ajax({
			url: '/controllers/Ajax.php',
			data: {action:'changeCode', infos: JSON.stringify($map)},
			type: 'POST',
			success: function(output){
				gererOutput(output, "Changement du code de téléchargement");
				chargerAdmin();
			},
			error: function(output){
				gererOutput(output, "Changement du code de téléchargement");
			}
		})
	}

	self.chargerDownloadFile = function(code, fichier){
		$.ajax({
			url: '/controllers/Ajax.php',
			data: {action:'chargerDownloadFile', code: code},
			type: 'POST',
			success: function(output){
				gererOutput(output, "Chargement du lien vers le fichier");
				if(output === "1"){
					$('#formDownloadFile').html("<a href=\"" + fichier + "\" target=\"_blank\">Appuyez ici pour accéder au fichier</a>");
				}
			},
			error: function(output){
				gererOutput(output, "Chargement du lien vers le fichier");
			}
		})
	}

	self.chargerPost = function(id){
		$.ajax({
			url: '/controllers/Ajax.php',
			data: {action: 'chargerPost', id: id},
			type: 'POST',
			success: function(output){
				gererOutput(output,"Chargement d'un poste spécifique");
				if(output.length > 1){
					$map = JSON.parse(output);
					$texte = "<h1>" + $map['title'] + "</h1>";
					$texte += $map['text'];
					if($map['fichier']){ // un fichier
						$texte += "<p></p>";
//						$texte += "<a href=\"" + $map['fichier'] + "\" target=\"_blank\">Appuyez ici pour accéder au fichier</a>";
						if(!logged_in){
							$texte += "<div id=\"formDownloadFile\">";
							$texte += "<div class=\"row control-group\">";
							$texte += "<div class=\"form-group col-xs-12 floating-label-form-group controls\">";
							$texte += "<label>Code</label>";
							$texte += "<input type=\"text\" name=\"downloadFile\" class=\"form-control\" placeholder=\"Entrez ici le code de téléchargement\" id=\"downloadFileText\">";
							$texte += "<br/>";
							$texte += "</div>";
							$texte += "</div>";
							$texte += "<button type=\"button\" id=\"downloadFileButton\" name=\"" + id + "\" class=\"btn btn-default\" style=\"float:left;\">Entrer code</button>";
							$texte += "</div>"
						} else {
							$texte += "<a href=\"" + $map['fichier'] + "\" target=\"_blank\">Appuyez ici pour accéder au fichier</a>";
						}
					}
					if(logged_in){
						$texte += "<p></p>";
						$texte += "<div></div>"
	                    $texte += "<div class=\"row\">"
	                    $texte += "<div class=\"form-group col-xs-12\">";
	                    $texte += "<button type=\"submit\" id=\"modifyPost\" name=\"" + id + "\" class=\"btn btn-default\">Modifier</button>";
	                    $texte += "<button type=\"button\" id=\"deletePost\" name=\"" + id + "\" class=\"btn btn-default\" style=\"float:right;\">Supprimer ce poste</button>";
	                    $texte += "</div>";
	                    $texte += "</div>";
					}
					$('#contenantPostUnique').html($texte);

					if(!logged_in){
						$('#downloadFileButton').click(function(){
							ajax.chargerDownloadFile($('#downloadFileText').val(), $map['fichier']);
						});
					}

					if(logged_in){
						$('#modifyPost').click(function(){
	                    	ajax.loadModifyPost($(this).attr('name'));
	    					afficherPage("ModifyPost");
	                    });
						$('#deletePost').click(function(){
							var confirmResult = confirm("Are you sure you want to delete this post ?");
							if (confirmResult) {
									ajax.deletePost($(this).attr('name'));
							}
						});
					}


				}
			},
			error: function(output){
				gererOutput(output, "Chargement d'un poste spécifique");
			}
		});
	}

	self.deletePost = function(id){
		$.ajax({
			url: '/controllers/Ajax.php',
			data: {action: 'deletePost', id: id},
			type: 'POST',
			success: function(output){
				gererOutput(output,"Suppression d'un poste");
				chargerAdmin();
			},
			error: function(output){
				gererOutput(output, "Suppression d'un poste");
			}
		});
	}

	self.loadModifyPost = function(id){
		$.ajax({
			url: '/controllers/Ajax.php',
			data: {action: 'loadModifyPost', id: id},
			type: 'POST',
			success: function(output){
				gererOutput(output,"Chargement de la modification d'un poste spécifique");
				if(output.length > 1){
					$map = JSON.parse(output);
					$titre = $map['title'];
					$valeur = $map['text'];
					$sousTitre = $map['subtitle'];
					$fichier = null;
					if($map['fichier']){ // un fichier
						$fichier = $map['fichier'];
					}

					$texte = "<p></p>";
					$texte += "<form name=\"commitModifyPost\" id=\"commitModifyPostForm\" novalidate>";
					$texte += "<div class=\"row control-group\">";
					$texte += "<div class=\"form-group col-xs-12 floating-label-form-group controls\">";
					$texte += "<label>Titre</label>";
					$texte += "<input type=\"text\" name=\"titreBlog\" class=\"form-control\" placeholder=\"Title\" id=\"titleBlogModify\" required data-validation-required-message=\"Please enter a title.\">";
					$texte += "<p class=\"help-block text-danger\"></p>";
					$texte += "</div>";
					$texte += "</div>";
					$texte += "<div class=\"row control-group\">";
					$texte += "<div class=\"form-group col-xs-12 floating-label-form-group controls\">";
					$texte += "<label>Sous-Titre</label>";
					$texte += "<input type=\"text\" name=\"sousTitreBlog\" class=\"form-control\" placeholder=\"Subtitle\" id=\"subTitleBlogModify\" required data-validation-required-message=\"Please enter a subtitle.\">";
					$texte += "<p class=\"help-block text-danger\"></p>";
					$texte += "</div>";
					$texte += "</div>";
					$texte += "<div class=\"row control-group\">";
					$texte += "<div class=\"form-group col-xs-12 floating-label-form-group controls\">";
					$texte += "<label>Texte</label>";
					$texte += "<textarea rows=\"20\" id=\"textBlogModify\" style=\"width:100%\" name=\"texte\" placeholder=\"Entrez le texte ici\"></textarea>";
					$texte += "<p class=\"help-block text-danger\"></p>";
					$texte += "</div>";
					$texte += "</div>";
					if($fichier){
						$texte += "<div class=\"row control-group\">";
						$texte += "<div class=\"form-group col-xs-12 floating-label-form-group controls\">";
						$texte += "<label>Fichier</label>";
						$texte += "<input type=\"file\" name=\"file\" class=\"form-control\" id=\"fileBlogModify\" />";
						$texte += "<p class=\"help-block text-danger\"></p>";
						$texte += "</div>";
						$texte += "</div>";
					}
					$texte += "<input type=\"text\" name=\"idPoste\" style=\"display: none;\" value=\"" + id + "\">";
                    $texte += "<br>";
                    $texte += "<div id=\"success\"></div>";
                    $texte += "<div class=\"row\">";
                    $texte += "<div class=\"form-group col-xs-12\">";
                    $texte += "<select name=\"prioritaire\">";
                    $texte +="<option value=\"none\">Normal</option>";
                    $texte +="<option value=\"pinned\">Prioritaire</option>";
                    $texte +="<\select>";
                    $texte += "<button type=\"submit\" class=\"btn btn-default\">Appliquer les modifications</button>";
                    $texte += "</div>";
                    $texte += "</div>";
                    $texte += "</form>";

					$('#contenantPostUniqueModify').html($texte);

					$('#titleBlogModify').val($titre);
					$('#textBlogModify').val($valeur);
					$('#subTitleBlogModify').val($sousTitre);

					$('form[name=commitModifyPost]').validate({
						rules : {
//
						},
						messages : {
//
						},
						submitHandler : function(form) {
							ajax.commitModifyPost(recupererValeur(form.name), recupererFile(form.name));
						}
					});


				}
			},
			error: function(output){
				gererOutput(output, "Chargement de la modification d'un poste spécifique");
			}
		});
	}

	self.chargerAccueil = function(){
		$.ajax({
			url: '/controllers/Ajax.php',
			data: {action: 'chargerAccueil'},
			type: 'POST',
			success: function(output){
				gererOutput(output, "Chargement de l'accueil");
				if(output.length > 1){
					$map = JSON.parse(output);
					$htmlFichiers = "<p></p>";
					$htmlAccueil = "<p></p>";
					$htmlNews = "<p></p>";
					$show = "block";
					$class = "";
					for(var poste in $map){
						/*if(poste > 3) $show = "none";
						if($map[poste]['pinned'] == 1){
							$class = "pinnedBlog";
						} else $class= "";*/
						if($map[poste].news){
							$htmlNews += "<div class=\"post-preview allPosts " + $class + "\" style=\"display:" + $show + "\"><a href=\"#\" id=" + $map[poste]['id'] + " class=\"posteCliquable\"><h2 class=\"post-title\">";
							$htmlNews += $map[poste]['title'];
							$htmlNews += "</h2>";
							$htmlNews += "<h3 class=\"post-subtitle\">";
							$htmlNews += $map[poste]['subtitle'];
							$htmlNews += "</h3>";
							$htmlNews += "</a><p class=\"post-meta\">Posté le " + $map[poste]['date'].substring(8, 10) + " " + getMonth($map[poste]['date'].substring(5, 7)) + " " + $map[poste]['date'].substring(0, 4) + "</p>";
							$htmlNews += "</div>";
						} else if($map[poste].fichier) {
							$htmlFichiers += "<div class=\"post-preview allPosts " + $class + "\" style=\"display:" + $show + "\"><a href=\"#\" id=" + $map[poste]['id'] + " class=\"posteCliquable\"><h2 class=\"post-title\">";
							$htmlFichiers += $map[poste]['title'];
							$htmlFichiers += "</h2>";
							$htmlFichiers += "<h3 class=\"post-subtitle\">";
							$htmlFichiers += $map[poste]['subtitle'];
							$htmlFichiers += "</h3>";
							$htmlFichiers += "</a><p class=\"post-meta\">Posté le " + $map[poste]['date'].substring(8, 10) + " " + getMonth($map[poste]['date'].substring(5, 7)) + " " + $map[poste]['date'].substring(0, 4) + "</p>";
							$htmlFichiers += "</div>";
						} else {
							$htmlAccueil +="<div class=\"post-preview allPosts " + $class + "\" style=\"display:" + $show + "\"><a href=\"#\" id=" + $map[poste]['id'] + " class=\"posteCliquable\"><h2 class=\"post-title\">";
							$htmlAccueil += $map[poste]['title'];
							$htmlAccueil += "</h2>";
							$htmlAccueil += "<h3 class=\"post-subtitle\">";
							$htmlAccueil += $map[poste]['subtitle'];
							$htmlAccueil += "</h3>";
							$htmlAccueil += "</a><p class=\"post-meta\">Posté le " + $map[poste]['date'].substring(8,10) + " " + getMonth($map[poste]['date'].substring(5,7)) + " " + $map[poste]['date'].substring(0,4) + "</p>";
							$htmlAccueil += "</div>";
						}
					}

					$htmlFichiers += "<hr>";
					/*
					$htmlFichiers += "<ul class=\"pager\" id=\"ulShowOlderPosts\">";
					$htmlFichiers += "<li class=\"next\">";
					$htmlFichiers += "<a id=\"showOlderPosts\">Entrées plus anciennes &rarr;</a>";
					$htmlFichiers += "</li>";
					$htmlFichiers += "</ul>";
					*/


					$htmlAccueil += "<hr>";
					/*
					$htmlAccueil += "<ul class=\"pager\" id=\"ulShowOlderPosts\">";
					$htmlAccueil += "<li class=\"next\">";
					$htmlAccueil += "<a id=\"showOlderPosts\">Entrées plus anciennes &rarr;</a>";
					$htmlAccueil += "</li>";
					$htmlAccueil += "</ul>";
					*/

					$htmlNews += "<hr>";

					$('#accueilPosts').html($htmlAccueil);
					$('#fichiersPosts').html($htmlFichiers);
					$('#fnewsPosts').html($htmlNews);


					$('.posteCliquable').click(function(){
						ajax.chargerPost($(this).attr('id'));
						afficherPage("Post");
					});

					$('#showOlderPosts').click(function(){
						$('#ulShowOlderPosts').hide();
						$('.allPosts').show();
					});

				}

			},
			error: function(output){
				gererOutput(output, "Chargement de l'accueil");
			}
		});
	}

	self.commitModifyPost = function(map, files){

		var file_data = files['file'];
		var form_data = new FormData();
		form_data.append('file', file_data);
		form_data.append('action', "commitModifyPost");
		form_data.append('infos', JSON.stringify(map));

		$.ajax({
			url: '/controllers/Ajax.php',
			data: form_data,
			type: 'POST',
			contentType: false,
			processData: false,
			success: function(output){
				gererOutput(output, "Modification d'un poste");
				chargerAdmin();
			},
			error : function(output){
				gererOutput(output, "Modification d'un poste");
			}
		});
	}

	self.commitPost = function(map, files){

		var file_data = files['file'];

		var form_data = new FormData();
		form_data.append('file', file_data);
		form_data.append('action', "commitPost");
		form_data.append('infos', JSON.stringify(map));

		$.ajax({
			url: '/controllers/Ajax.php',
			data: form_data,
			type: 'POST',
			contentType: false,
			processData: false,
			success: function(output){
				gererOutput(output, "Creation d'un nouveau poste");
				chargerAdmin();
			},
			error : function(output){
				gererOutput(output, "Creation d'un nouveau poste");
			}
		});
	}

	self.changeAbout = function(map){
		$.ajax({
			url: '/controllers/Ajax.php',
			data: {action: 'changeAbout', infos: JSON.stringify(map)},
			type: 'POST',
			success: function(output){
				gererOutput(output, "Changement du \"about\"");
				chargerAdmin();
			},
			error : function(output){
				gererOutput(output, "Changement du \"about\"");
			}
		});

	}

	self.seConnecter = function(map){
		$.ajax({
			url: '/controllers/Ajax.php',
			data: {action: 'login', infos: JSON.stringify(map)},
			type: 'POST',
			success: function(output){
				gererOutput(output,"Authentification");
				if(output === "1"){
					chargerAdmin();
					updateLoggedin(true);
				}
			},
			error : function(output){
				gererOutput(output, "Authentification");
			}
		});
	}

	self.estConnecte = function(){
		$.ajax({
			url: '/controllers/Ajax.php',
			data : {
				action : 'checkConnexion'},
			type: 'POST',
			success: function(output){
				if(output === "1"){
					updateLoggedin(true);
				} else {
					updateLoggedin(false);
				}
				if(logged_in){
					chargerAdmin();
				} else {
					chargerUtilisateur();
				}
			},
			error : function(output){
				gererOutput(output, "Verification de l'authentification");
			}
		});
	}

	return self;
}
