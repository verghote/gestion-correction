<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Ajout d'un projet";

// récupérer les compétences du bloc 1 pour alimenter la zone de liste des compétences
$data = json_encode(Projet::getLesCompetences(1));

$head = <<<EOD
<script>
       let data = $data;
</script>
EOD;

// chargement de l'interface
require RACINE . "/include/interface.php";
