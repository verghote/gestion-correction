<?php
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Recherche sur plusieurs critères";

// alimentation des listes déroulantes
$lesCategories = json_encode(Categorie::getListe());
$lesClubs = json_encode(Club::getListe());

$data = json_encode(Coureur::getAll());

$head = <<<EOD
<script>
       let lesCategories = $lesCategories;
       let lesClubs = $lesClubs;
</script>
EOD;



// chargement de l'interface
require RACINE . "/include/interface.php";