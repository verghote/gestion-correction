<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Les coureurs - utilisation de tableau.js";

// Récupération des coureurs : licence, nom prenom, sexe, dateNaissanceFr au format fr, idCategorie, nomClub
$lesCoureurs = json_encode(Coureur::getAll());

$head = <<<EOD
<script>
    let lesCoureurs = $lesCoureurs;
</script>
EOD;

// chargement de l'interface
require RACINE . "/include/interface.php";
