<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Recherche sur nom, prénom ou club";

// Récupération des coureurs : licence, nom prenom, sexe, dateNaissanceFr au format fr, idCategorie, nomClub
$data = json_encode(Coureur::getAll());
$head = <<<HTML
<script>
    let data = $data;
</script>
HTML;

// chargement de l'interface
require RACINE . "/include/interface.php";

