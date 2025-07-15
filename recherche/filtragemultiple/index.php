<?php
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Filtrer sur plusieurs critères";

// alimentation des listes déroulantes
$lesCategories = json_encode(Categorie::getListe());
$lesClubs = json_encode(Club::getListe());

$data = json_encode(Coureur::getAll());

$head = <<<HTML
<script>
       let lesCategories = $lesCategories;
       let lesClubs = $lesClubs;
         let data = $data;
</script>
HTML;



// chargement de l'interface
require RACINE . "/include/interface.php";