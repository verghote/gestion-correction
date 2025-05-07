<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// Contrôle de la transmission du paramètre attendu : id
if (!isset($_GET['id']) ) {
    Erreur::envoyerReponse("Le numéro de l'annonce n'est pas transmis", 'global');
}

// Contrôle du format de l'identifiant : un entier
$id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
if ($id === false) {
    Erreur::envoyerReponse("La valeur transmise n'est pas du type attendu", 'system');
}

// Contrôle de la validité de l'identifiant : doit être présent dans la table annonce
$ligne = Annonce::getById($id);
if (!$ligne) {
    Erreur::envoyerReponse("Cette annonce n'existe pas", 'global');
}

// alimentation de l'interface
$titre = "Modification d'une annonce";

// intervalle accepté pour la date de l'événement : +- un an
$min = date('Y-m-d', strtotime("-1 year"));
$max = date("Y-m-d", strtotime("+1 year"));

// l'annonce à modifier
$data = json_encode($ligne);
// chargement des ressources spécifiques de l'interface :Ckeditor Version 4 afin de pouvoir modifier le contenu de l'annonce directement en HTML

$head = <<<EOD

<script>
       let data = $data;
       let min = '$min';
       let max = '$max';
</script>
EOD;

// chargement des composants
$head .= "<script src='https://verghote.github.io/composant/ckeditor/ckeditor.js'></script>";

// chargement de la page
require RACINE . '/include/interface.php';

