<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Nouvelle annonce";
$retour = "../index.php";

// intervalle accepté pour la date de l'événement : dans l'année à venir
$min = date('Y-m-d');
$max = date("Y-m-d", strtotime("+1 year"));
$value = date("Y-m-d", strtotime("+1 month"));

// chargemnt de CkEditor version 5
$head = <<<EOD
    <script>
           let min = '$min';
           let max = '$max';
           let value = '$value';
    </script>
EOD;

// chargement des composants
$head .= "<script src='https://verghote.github.io/composant/ckeditor/ckeditor.js'></script>";

// chargement de la page
require RACINE . '/include/interface.php';

