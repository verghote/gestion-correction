<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface :
$titre = "Modification ou suppression d'une catégorie";

// récupération des catégories pour alimenter la zone de liste et le tableau des catégories
$lesCategories = json_encode(Categorie::getListe());

$head = <<<HTML
<script>
    let lesCategories = $lesCategories;
</script>
HTML;

// chargement de l'interface
require RACINE . "/include/interface.php";

