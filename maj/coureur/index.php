<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";


// alimentation de l'interface
$titre = "Modification ou suppression d'un licencié";

// récupérer les clubs pour alimenter la zone de liste des clubs
$lesClubs = json_encode(Club::getListe());

// récupération de l'intervalle des dates de naissance possible
$dateMin = json_encode(Categorie::getDateNaissanceMin());
$dateMax = json_encode(Categorie::getDateNaissanceMax());

// Récupération de la liste des coureurs : licence, nom et prenom
$lesCoureurs = json_encode(Coureur::getListe());

$head = <<<HTML
    <script src="/composant/autocomplete/autocomplete.min.js"></script>
    <link rel="stylesheet" href="/composant/autocomplete/autocomplete.css">
    <script>
        const lesClubs = $lesClubs;
        const lesCoureurs = $lesCoureurs;
        const dateMin = $dateMin;
        const dateMax = $dateMax;
</script>
HTML;

// chargement de l'interface
require RACINE . "/include/interface.php";