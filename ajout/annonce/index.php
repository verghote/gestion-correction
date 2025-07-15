<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Nouvelle annonce";

// chargemnt des composants spécifiques de la page
$head = <<<HTML
    <script src="/composant/tinymce/tinymce.min.js" referrerpolicy="origin"></script>
HTML;

// chargement de la page
require RACINE . '/include/interface.php';

