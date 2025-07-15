<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Liste des catégories";

// Récupération des catégories avec l'intervalle des années
$lesCategories = json_encode(Categorie::getAll());

$head = <<<HTML
    <script src="/composant/html2pdf/html2pdf.bundle.min.js"></script>
    <script>
        let lesCategories = $lesCategories;
    </script>
HTML;

// chargement de l'interface
require RACINE . "/include/interface.php";
