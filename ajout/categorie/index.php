<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface :
$titre = "Nouvelle catégorie";

// récupération des catégories afin de permettre tous les contrôles côté client
$lesCategories = json_encode(Categorie::getListe());

$head = <<<HTML
<script>
    let lesCategories = $lesCategories;
</script>
HTML;

// chargement de l'interface
require RACINE . "/include/interface.php";

