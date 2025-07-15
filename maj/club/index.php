<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface :
$titre = "Modification ou suppression d'un club";

// récupération des clubs pour alimenter la zone de liste
$lesClubs = json_encode(Club::getListe());

$head = <<<HTML
<script>
    let lesClubs = $lesClubs;
</script>
HTML;

// chargement de l'interface
require RACINE . "/include/interface.php";

