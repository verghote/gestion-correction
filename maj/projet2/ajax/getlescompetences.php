<?php
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// Vérification de la transmission des paramètres
if (Std::existe('idProjet') === false) {
    Erreur::envoyerReponse("Paramètres manquants", 'global');
}

if (!is_numeric($_POST['idProjet'])) {
    Erreur::envoyerReponse("Paramètre invalide.", 'global');
}

$idProjet = filter_var($_POST['idProjet'], FILTER_VALIDATE_INT);


if (!Projet::getById($idProjet)) {
    Erreur::envoyerReponse("Projet inexistant.", 'global');
}

// récupération des compétences du projet dont l'id est passé en paramètre
echo json_encode(Projet::getLesCompetences($idProjet));
