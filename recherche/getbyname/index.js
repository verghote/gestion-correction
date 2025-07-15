"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from "/composant/fonction/ajax.js";
import {getAge} from '/composant/fonction/date.js';

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

// récupération des éléments de l'interface


/* global autoComplete, lesCoureurs */

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


// Efface le champ de saisie quand celui-ci est sélectionné
nom.onfocus = effacer;

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
    licence.innerText = coureur.licence;
    prenom.innerText = coureur.prenom;
    sexe.innerText = coureur.sexe;
    dateNaissance.innerText = coureur.dateNaissanceFr;
    nomClub.innerText = coureur.nomClub;
    idCategorie.innerText = coureur.idCategorie;
    age.innerText = getAge(coureur.dateNaissanceFr) + ' ans';
    nom.value = coureur.nom; // met à jour le champ de saisie avec le nom
    nom.blur(); // retire le focus du champ de saisie
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

// paramétrage du composant autoComplete
const options = {
    data: {
        src: lesCoureurs,
        keys: ["nomPrenom"]
    },
    selector: "#nom",
    resultItem: {
        highlight: true,
    },
    theme: 'round',
    resultsList: {
        element: (list, data) => {
            const info = document.createElement("p");
            info.style.padding = "2px 2px";
            info.style.fontStyle = "italic";
            info.style.fontSize = "0.8em";
            const nb = data.matches.length;
            if (nb > 1) {
                info.innerHTML = nb + " licenciés trouvés";
            } else if (nb === 1) {
                info.innerHTML = "Un licencié correspondant";
            } else {
                info.innerHTML = "Aucun licencié correspondant";
            }
            list.append(info);
        },
        noResults: true,
        maxResults: 10,
    },
    events: {
        input: {
            // lorsque l'utilisateur clique sur un élément de la liste affichée
            selection: (event) => {
                const selection = event.detail.selection.value;
                nom.value = selection.nomPrenom;
                rechercher(selection.licence);
            },
        }
    },
};
new autoComplete(options);