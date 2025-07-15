<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Recherche sur des critères imbriqués";


$data = json_encode(Competence::getLesBlocs());

$head = <<<HTML
<script>
    let data = $data;
</script>
HTML;

// chargement de l'interface
require RACINE . "/include/interface.php";
