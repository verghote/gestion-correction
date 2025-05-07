<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// Récupération la liste des  des coureurs
echo json_encode(json_encode(Coureur::getListe()));
