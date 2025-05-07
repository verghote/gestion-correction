<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";


// alimentation de l'interface
$titre = "Modification ou suppression d'un licencié";

// récupérer les clubs pour alimenter la zone de liste des clubs
$lesClubs = json_encode(Club::getListe());

// récupération de l'intervalle concernant la date de naissance fixée à partir des catégories
$intervalle = json_encode(Categorie::getIntervalle());

// Récupération la liste des  des coureurs
$lesCoureurs = json_encode(Coureur::getListe());

// Récupération de la liste des coureurs : licence, nom et prenom
$data = json_encode(Coureur::getListe());
$head = <<<EOD
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/easy-autocomplete/1.3.5/easy-autocomplete.min.css">
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/easy-autocomplete/1.3.5/easy-autocomplete.themes.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/easy-autocomplete/1.3.5/jquery.easy-autocomplete.min.js"></script>
<script>
    let data = $data;
    let lesClubs = $lesClubs;
    let lesCoureurs = $lesCoureurs;
    let intervalle = $intervalle;
</script>
EOD;

// chargement de l'interface
require RACINE . "/include/interface.php";