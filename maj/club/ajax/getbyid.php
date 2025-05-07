<?php
// chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// vérification du paramètre attendu
if (!isset($_POST['id']) ) {
    Erreur::envoyerReponse("L'identifiant du club n'est pas transmis", 'global');
}

// Récupération du club
$id = $_POST['id'];

if (!preg_match('/^[0-9]{6}$/', $id)) {
    Erreur::envoyerReponse("L'identifiant du club ne respecte pas le format attendu", 'global');
}

echo json_encode(Club::getById($id));
