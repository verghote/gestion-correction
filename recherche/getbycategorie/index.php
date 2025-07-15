<?php
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Les coureurs d'une catégorie";

// récupération des catégories afin d'alimenter la liste déroulante
$data = json_encode(Categorie::getListe());

$head = <<<HTML
<script>
       let data = $data;
</script>
HTML;

// chargement de l'interface
require RACINE . "/include/interface.php";
