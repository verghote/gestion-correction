<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Gestion des Annonces";

// récupération des annonces
$data = json_encode(Annonce::getAll());
$head = <<<EOD
<script>
    let data = $data;
</script>
EOD;

// chargement de l'interface
require RACINE . "/include/interface.php";
