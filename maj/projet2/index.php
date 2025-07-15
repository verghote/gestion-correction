<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Gestion des projets";

// récupération de tous les projets
$lesProjets = Projet::getAll();

if (count($lesProjets) === 0) {
    Erreur::afficherReponse("Aucun projet n'est enregistré dans la base de données.", 'global');
} else {
    $lesProjets = json_encode($lesProjets);
}

// récupération de toutes les compétences du bloc 1 pour générer les cases à cocher
$lesCompetences = json_encode(Competence::getLesCompetences(1));

$head = <<<HTML
<script>
    const lesCompetences = $lesCompetences;
    const lesProjets =  $lesProjets;
</script>
HTML;

// chargement de l'interface
require RACINE . "/include/interface.php";

