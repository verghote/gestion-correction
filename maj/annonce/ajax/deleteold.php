<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

echo json_encode(Annonce::deleteOld());

