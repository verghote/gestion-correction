<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Consultation des projets";

// récupération de tous les projets
$lesProjets = Projet::getAll();

// Si aucun projet n'est enregistré dans la base de données, on envoie une erreur

if (count($lesProjets) === 0) {
   Erreur::envoyerReponse("Aucun projet n'est enregistré dans la base de données.", 'global');
}

$lesProjets = json_encode($lesProjets);

$head =<<<EOD
    <script>
        let lesProjets = $lesProjets;
    </script>
EOD;

// chargement de l'interface
require RACINE . "/include/interface.php";

