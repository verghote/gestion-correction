<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Les coureurs";

// Récupération des coureurs : licence, nom prenom, sexe, dateNaissanceFr au format fr, idCategorie, nomClub
$data = json_encode(Coureur::getAll());
$head = <<<EOD
    <script>
        let data = $data;
    </script>
EOD;

// chargement de l'interface
require RACINE . "/include/interface.php";
