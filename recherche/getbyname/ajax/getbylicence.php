<?php
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// vérification du paramètre attendu
if (!isset($_POST['licence'])) {
    Erreur::envoyerReponse("Numéro de licence non transmis", 'global');
}

// vérification du format de la licence
if (!preg_match('/^[0-9]{6,7}$/', $_POST['licence'])) {
    Erreur::envoyerReponse("Numéro de licence non conforme", 'global');
}

// Récupération du coureur
$licence = $_POST['licence'];

// Récupération du coureur
$ligne = Coureur::getByLicence($licence);
// Si le coureur n'existe pas, on envoie une erreur
if (!$ligne) {
    Erreur::envoyerReponse("Numéro de licence inexistant", 'global  ');
}

echo json_encode($ligne);
