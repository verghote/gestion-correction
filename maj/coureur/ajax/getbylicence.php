<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// Récupération du coureur
echo json_encode(Coureur::getByLicence($_POST['licence']));
