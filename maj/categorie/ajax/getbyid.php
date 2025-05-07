<?php
// chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// vérification du paramètre attendu
if (!isset($_POST['id']) ) {
    Erreur::envoyerReponse("L'identifiant  de la catégorie n'est pas transmis", 'global');
}

// Récupération du club
$id = $_POST['id'];

if (!preg_match('/^[A-za-z][A-za-z0-9]{1,2}$/', $id)) {
    Erreur::envoyerReponse("L'identifiant de la catégorie ne respecte pas le format attendu", 'global');
}

// envoi des informations sur la catégorie demandée
echo json_encode(Categorie::getById($id));


