<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";


// alimentation de l'interface :
$titre = "Nouveau club";
$lesParametres = json_encode(Club::getConfig());

$head = <<<HTML
    <script>
        let lesParametres = $lesParametres;
    </script>
HTML;

// chargement de l'interface
require RACINE . "/include/interface.php";
