"use strict";

/* global data */

import {
    configurerFormulaire,
    donneesValides,
    filtrerLaSaisie,
    confirmer,
    afficherErreurSaisie,
    afficherSucces,
    afficherErreur,
    afficherDansConsole,
    retournerVersApresConfirmation,
    ucWord,
    donneesModifiees, genererMessage
} from 'https://verghote.github.io/composant/fonction.js';

// objet global contenant les informations sur la catégorie sélectionnée
let element;

// récupération des éléments de l'interface
const idR = document.getElementById('idR');

const nom = document.getElementById('nom');
const ageMin = document.getElementById('ageMin');
const ageMax = document.getElementById('ageMax');
const nb = document.getElementById('nb');
const msg = document.getElementById('msg');

const btnModifier = document.getElementById('btnModifier');
const btnSupprimer = document.getElementById('btnSupprimer');

configurerFormulaire(true);
filtrerLaSaisie('nom', /[A-Za-z0-9 ]/);
filtrerLaSaisie('ageMin', /[0-9]/);
filtrerLaSaisie('ageMax', /[0-9]/);

// sur le changement de catégorie, il faut récupérer les informations de la catégorie
idR.onchange = charger;

// demande de modification d'une catégorie
btnModifier.onclick = () => {
    nom.value = ucWord(nom.value.trim());
    if ( donneesModifiees(element) && donneesValides()) {
        modifier();
    }
};

// demande de suppression  de la catégorie
btnSupprimer.onclick =  () => confirmer(supprimer);

// alimentation de la zone de liste des catégories
for (const element of data) {
    idR.add(new Option(element.nom + ' (' + element.id + ')', element.id));
}

// charger les informations de la catégorie actuellement sélectionnée
charger();

// charger et afficher les informations sur la catégorie
function charger() {
    $.ajax({
        url: 'ajax/getbyid.php',
        method: 'POST',
        data: {
            id: idR.value
        },
        dataType: "json",
        success: data => {
            if (data.error) {
                for (const key in data.error) {
                    const message = data.error[key];
                    if (key === 'system') {
                        console.log(message);
                        afficherErreur('Une erreur est survenue lors de l\'ajout');
                    } else if (key === 'global') {
                        afficherErreur(message);
                    } else {
                        afficherErreurSaisie(key, message);
                    }
                }
            } else {
                element = data;
                afficher(data);
            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
           afficherDansConsole(reponse.responseText);
        }
    });
}

function afficher(data) {
    nom.value = data.nom;
    ageMin.value = data.ageMin;
    ageMax.value = data.ageMax;
    nb.innerText = data.nb + " licencié(s) dans cette catégorie";
    // activation / désactivation du bouton
    btnSupprimer.style.display = data.nb === 0 ? 'block' : 'none';
}

function modifier() {
    // transmission des paramètres
    const lesValeurs = {};
    if (nom.value !== element.nom) {
        lesValeurs.nom = nom.value;
    }
    if (ageMin.value !== element.ageMin) {
        lesValeurs.ageMin = ageMin.value;
    }
    if (ageMax.value !== element.ageMax) {
        lesValeurs.ageMax = ageMax.value;
    }
    $.ajax({
        url: '/ajax/modifier.php',
        method: 'POST',
        async: false,
        data: {
            table : 'categorie',
            id: idR.value,
            lesValeurs : JSON.stringify(lesValeurs)
        },
        dataType: "json",
        success: data => {
            if (data.success) {
                afficherSucces("Modification enregistrée");
                // modifier le libellé de la zone de liste
                idR.options[idR.selectedIndex].text = nom.value.toUpperCase();
            } else {
                for (const key in data.error) {
                    const message = data.error[key];
                    if (key === 'system') {
                        console.log(message);
                        afficherErreur('Une erreur est survenue lors de l\'ajout');
                    } else if (key === 'global') {
                        msg.innerHTML = genererMessage(message);
                    } else {
                        afficherErreurSaisie(key, message);
                    }
                }
            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
           afficherDansConsole(reponse.responseText);
        }
    });
}

function supprimer() {
    $.ajax({
        url: '/ajax/supprimer.php',
        type: 'POST',
        async: false,
        data: {
            table : 'categorie',
            id: idR.value
        },
        dataType: "json",
        success: (data) => {
            if (data.success) {
                retournerVersApresConfirmation("Catégorie supprimée", "/");
            } else {
                for (const key in data.error) {
                    const message = data.error[key];
                    if (key === 'system') {
                        console.error(message);
                        afficherErreur('Une erreur est survenue lors de la suppression');
                    } else if (key === 'global') {
                        afficherErreur(message);
                    } else { // ne doit jamais arriver
                        afficherErreur(message);
                    }
                }
            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
           afficherDansConsole(reponse.responseText);
        }
    });
}
