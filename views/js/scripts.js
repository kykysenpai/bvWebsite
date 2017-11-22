var logged_in;
var ajax = ajax();

function updateLoggedin($val){
	logged_in = $val;
}

$('.menuNav').click(function(){
	afficherPage($(this).attr('id'));
});

$('#Logout').click(function(){
	ajax.deconnexion();
});

function getMonth($month){
	switch($month){
	case "01" :
		return "Janvier";
	case "02" :
		return "Février";
	case "03" :
		return "Mars";
	case "04" :
		return "Avril";
	case "05" :
		return "Mai";
	case "06" :
		return "Juin";
	case "07" :
		return "Juillet";
	case "08" :
		return "Aout";
	case "09" :
		return "Septembre";
	case "10" :
		return "Octobre";
	case "11" :
		return "Novembre";
	case "12" :
		return "Décembre";
	}
}

function afficherPage(idPage) {
	$('.pageAppli').hide();
	$('.pageAppli').prop('disabled', true);
	$('#page' + idPage).show('fade', 600);
	$('#page' + idPage).prop('disabled', false);
}

function chargerDonnees(){
	ajax.chargerAbout();
	ajax.chargerAccueil();
}

function chargerUtilisateur(){
	chargerDonnees();
	afficherPage("Accueil");
	$('.pageUtilisateur').show('fade', 600);
	$('.pageAdministrateur').hide();
}

function chargerAdmin(){
	chargerDonnees();
	afficherPage("Accueil");
	$('.pageAdministrateur').show('fade', 600);
	$('.pageUtilisateur').hide();
}


function recupererValeur(name) {
	var map = {};
	$('form[name=' + name + ']').find(
			'input[type=text],input[type=email],input[type=password],select,textarea')
			.each(function() {
				map[$(this).attr('name')] = $(this).val();
			});
	return map;
}

function recupererFile(name){
	var map = {};
	$('form[name=' + name + ']').find(
	'input[type=file]')
	.each(function(){
		map[$(this).attr('name')] = $(this).prop("files")[0];
	});
	return map;
}

function gererOutput(numero, texte){
	if(typeof texte === 'undefined'){
		switch (numero){
		case "0":
			texte = "Echec !";
			break;
		case "1":
			texte = "Reussite !";
			break;
		case "2":
			texte = "Il y a un problème avec la base de donnée";
			break;
		case "3":
			texte = "Vous devez être connecté pour effectuer cette action";
			break;
		case "4":
			texte = "Le fichier est trop grand, il n'a pas été mis en ligne ; 10Mo maximum !";
			break;
		case "5":
			texte = "Le message est trop long ; 1000 caractères maximum";
			break;
		case "6":
			texte = "Cette combinaison nom d'utilisateur / mot de passe est erronée !";
			break;
		case "7":
			texte = "Le code entré est erroné !"
			break;
		default:
			texte = "Erreur inconnue !";
		}
	} else {
		switch (numero){
		case "0":
			texte += " : Echec !";
			break;
		case "1":
			texte += " : Réussite !";
			break;
		case "2":
			texte += " : Il y a un problème avec la base de donnée";
			break;
		case "3":
			texte += " : Vous devez être connecté pour effectuer cette action";
			break;
		case "4":
			texte += " : Le fichier est trop grand, il n'a pas été mis en ligne ; 10Mo maximum !";
			break;
		case "5":
			texte += " : Le message est trop long ; 1000 caractères maximum";
			break;
		case "6":
			texte += " : Cette combinaison nom d'utilisateur / mot de passe est erronée !";
			break;
		case "7":
			texte += " : Le code entré est erroné !";
			break;
		default :
			texte = "Erreur inconnue !";
		}
	}
	switch (numero){
	case "0":
	case "4":
	case "6":
		toastr["warning"](texte);
		break;
	case "1":
		toastr["success"](texte);
		break;
	case "2":
	case "3":
		toastr["error"](texte);
		break;
	case "5":
	case "7":
		toastr["info"](texte);
		break;
	}

}

$(function() {

	$('.menuNav').hide();
	$('#Logout').hide();
	$('#Accueil').show();
	$('#Fichiers').show();

	ajax.estConnecte();




	$.validator.setDefaults({
		debug : true,
		success : "valid"
	});

	toastr.options = {
			  "closeButton": false,
			  "debug": false,
			  "newestOnTop": false,
			  "progressBar": true,
			  "positionClass": "toast-bottom-right",
			  "preventDuplicates": false,
			  "onclick": null,
			  "showDuration": "300",
			  "hideDuration": "1000",
			  "timeOut": "5000",
			  "extendedTimeOut": "1000",
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
	}
	$('form[name=formLogin]').validate({
		rules : {
//
		},
		messages : {
//
		},
		submitHandler : function(form) {
			ajax.seConnecter(recupererValeur(form.name));
		}
	});
	$('form[name=changeAbout]').validate({
		rules : {
//
		},
		messages : {
//
		},
		submitHandler : function(form) {
			ajax.changeAbout(recupererValeur(form.name));
		}
	});
	$('form[name=commitPost]').validate({
		rules : {
//
		},
		messages : {
//
		},
		submitHandler : function(form) {
			ajax.commitPost(recupererValeur(form.name), recupererFile(form.name));
		}
	});
	$('form[name=sentMessage]').validate({
		rules : {
//
		},
		messages : {
//
		},
		submitHandler : function(form) {
			ajax.sentMessage(recupererValeur(form.name));
		}
	});
	$('form[name=formChangeCode]').validate({
		rules : {
//
		},
		messages : {
//
		},
		submitHandler : function(form) {
			ajax.changeCode(recupererValeur(form.name));
		}
	});
});
