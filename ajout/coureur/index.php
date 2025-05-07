<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Nouveau licencié";

// récupérer les clubs pour alimenter la zone de liste des clubs
$data = json_encode(Club::getListe());

$head = <<<EOD
<script>
       let data = $data;
</script>
EOD;

// chargement de l'interface
require RACINE . "/include/interface.php";
