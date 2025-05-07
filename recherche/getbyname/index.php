<?php
// activation du chargement dynamique des ressources
require $_SERVER['DOCUMENT_ROOT'] . "/include/autoload.php";

// alimentation de l'interface
$titre = "Recherche sur le nom et prénom";

// Récupération de la liste des coureurs : licence, nom et prenom
$data = json_encode(Coureur::getListe());

// chargement tarekraafat-autocomplete.js
//Simple autocomplete pure vanilla Javascript library.
$head = <<<EOD
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tarekraafat-autocomplete.js/10.2.9/autoComplete.min.js" 
            integrity="sha512-XrL3Rs9COWEjoP35iRugu2ioW5iI6hIiukkaPznl4Ulj+Ty0fpEpI4siUS1u2eP9azD9G/YsXqvoPZISJjj4tw==" 
            crossorigin="anonymous" referrerpolicy="no-referrer">
    </script>
    <link rel="stylesheet" href="https://verghote.github.io/composant/autocomplete2.css">
    <script>
        let data = $data;
    </script>
EOD;

// chargement de l'interface
require RACINE . "/include/interface.php";
