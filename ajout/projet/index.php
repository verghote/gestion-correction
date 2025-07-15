<?php

// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . '/include/autoload.php';

$titre = "Nouveau projet";

// récupération de toutes les compétences du bloc 1 pour générer les cases à cocher
$lesCompetencesBloc1 = json_encode(Competence::getLesCompetences(1));

$head = <<<HTML
    <script>
        const lesCompetencesBloc1 = $lesCompetencesBloc1;
    </script>
HTML;

// chargement de l'interface
require RACINE . "/include/interface.php";