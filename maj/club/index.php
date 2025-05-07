<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface :
$titre = "Modification ou suppression d'un club";

// récupération des clubs pour alimenter la zone de liste
$data = json_encode(Club::getListe());

$head = <<<EOD
<script>
    let data = $data;
</script>
EOD;

// chargement de l'interface
require RACINE . "/include/interface.php";

