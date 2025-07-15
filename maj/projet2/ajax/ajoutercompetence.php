<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// Vérification de la transmission des paramètres
if (Std::existe('idProjet', 'idCompetence') === false) {
    Erreur::envoyerReponse("Paramètres manquants", 'global');
}

if (!is_numeric($_POST['idProjet']) || !is_numeric($_POST['idCompetence'])) {
    Erreur::envoyerReponse("Paramètres invalides.", 'global');
}

$idProjet = filter_var($_POST['idProjet'], FILTER_VALIDATE_INT);
$idCompetence = filter_var($_POST['idCompetence'], FILTER_VALIDATE_INT);

if (!Projet::getById($idProjet)) {
    Erreur::envoyerReponse("Projet inexistant.", 'global');
}

if (!Competence::getById($idCompetence)) {
    Erreur::envoyerReponse("Compétence inexistante.", 'global');
}


// Ajouter une compétence dans un projet
Projet::ajouterCompetence($_POST['idProjet'], $_POST['idCompetence']);

echo json_encode(['success' => "Compétence ajoutée"]);