"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from "/composant/fonction/ajax.js";
import {configurerFormulaire, donneesValides, filtrerLaSaisie, } from "/composant/fonction/controle.js";
import {getAge} from '/composant/fonction/date.js';

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

// récupération des éléments de l'interface

const licence = document.getElementById('licence');
const nom = document.getElementById('nom');
const prenom = document.getElementById('prenom');
const sexe = document.getElementById('sexe');
const dateNaissance = document.getElementById('dateNaissance');
const nomClub = document.getElementById('nomClub');
const idCategorie = document.getElementById('idCategorie');
const age = document.getElementById('age');

// -----------------------------------------------------------------------------------
// Procédures évènementielles
// -----------------------------------------------------------------------------------

licence.onchange = () => {
    if (donneesValides()) {
        rechercher(licence.value);
    }
};

// Efface le champ de saisie quand celui-ci est sélectionné
licence.onfocus = effacer;

// Lancement de la recherche
function rechercher(licence) {
    appelAjax({
        url: 'ajax/getbylicence.php',
         data: {
            licence: licence,
        },
        success: (data) => {
                afficher(data);
        }
    });
}

function afficher(coureur) {
    nom.innerText = coureur.nom;
    prenom.innerText = coureur.prenom;
    sexe.innerText = coureur.sexe;
    dateNaissance.innerText = coureur.dateNaissanceFr;
    nomClub.innerText = coureur.nomClub;
    idCategorie.innerText = coureur.idCategorie;
    age.innerText = getAge(coureur.dateNaissanceFr) + ' ans';
    licence.blur(); // retire le focus du champ de saisie
}

/**
 * Efface les valeurs affichées dans les balises div de class fiche-value.
 */
function effacer() {
    document.querySelectorAll('.fiche-value').forEach(el => {
        const input = el.querySelector('input');
        if (input) {
            input.value = ''; // efface juste le contenu du champ input
        } else {
            el.innerText = ''; // efface le contenu textuel des autres champs
        }
    });
}



// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

// filtrage de la saisie
filtrerLaSaisie('licence', /[0-9]/);

configurerFormulaire();