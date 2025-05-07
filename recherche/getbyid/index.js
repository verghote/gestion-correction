"use strict";

import {
    afficherErreur,
    getAge,
    filtrerLaSaisie,
    afficherErreurSaisie,
    afficherDansConsole,
    configurerFormulaire,
    donneesValides
} from 'https://verghote.github.io/composant/fonction.js';


// récupération des éléments de l'interface

const licenceR = document.getElementById('licenceR');
const licence = document.getElementById('licence');
const nom = document.getElementById('nom');
const prenom = document.getElementById('prenom');
const sexe = document.getElementById('sexe');
const dateNaissance = document.getElementById('dateNaissance');
const nomClub = document.getElementById('nomClub');
const idCategorie = document.getElementById('idCategorie');
const age = document.getElementById('age');

// filtrage de la saisie
filtrerLaSaisie('licenceR', /[0-9]/);

configurerFormulaire();

// gestion des événements
licenceR.onchange = () => {
    effacer();
    if (donneesValides()) {
        rechercher(licenceR.value);
    }
};

licenceR.onfocus = () => {
    licenceR.value = '';
}

// Lancement de la recherche
function rechercher(licence) {
    $.ajax({
        url: 'ajax/getbylicence.php',
        method: 'post',
        data: {
            licence: licence,
        },
        dataType: 'json',
        success: (data) => {
            if (data.error) {
                afficherErreurSaisie('licenceR', data.error.licenceR);
            } else {
                afficher(data);
            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
            afficherDansConsole(reponse.responseText);
        }
    });
}

function afficher(coureur) {
    licenceR.value = '';
    licence.innerText = coureur.licence;
    nom.innerText = coureur.nom;
    prenom.innerText = coureur.prenom;
    sexe.innerText = coureur.sexe;
    dateNaissance.innerText = coureur.dateNaissanceFr;
    nomClub.innerText = coureur.nomClub;
    idCategorie.innerText = coureur.idCategorie;
    age.innerText = getAge(coureur.dateNaissanceFr) + ' ans';
}

function effacer() {

    licence.innerText = '';
    nom.innerText = '';
    prenom.innerText = '';
    sexe.innerText = '';
    dateNaissance.innerText = '';
    nomClub.innerText = '';
    idCategorie.innerText = '';
    age.innerText = '';
}