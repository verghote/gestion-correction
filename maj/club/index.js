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
    genererMessage, retournerVersApresConfirmation
} from 'https://verghote.github.io/composant/fonction.js';

// récupération des éléments de l'interface
const id = document.getElementById('id');
const nom = document.getElementById('nom');
const msg = document.getElementById('msg');
const btnModifier = document.getElementById('btnModifier');
const btnSupprimer = document.getElementById('btnSupprimer');
const nb = document.getElementById('nb');


configurerFormulaire(true);
filtrerLaSaisie('nom', /[A-Za-zÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ '-.]/);

// sur le changement de club, il faut récupérer les informations du club
id.onchange = charger;

// demande de modification d'un club
btnModifier.onclick = () => {
    if (donneesValides()) {
        modifier();
    }
};

// demande de suppression  du club
btnSupprimer.onclick = function () {
    confirmer(supprimer);
};

// alimentation de la zone de liste des clubs
for (const element of data) {
    id.add(new Option(element.nom, element.id));
}

// charger les informations du club actuellement sélectionné
charger();

// charger et afficher les informations sur le club
function charger() {
    $.ajax({
        url: 'ajax/getbyid.php',
        method: 'POST',
        data: {
            id: id.value
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
    nb.innerText = data.nb + " licencié(s)";
    btnSupprimer.style.display = data.nb === 0 ? 'block' : 'none';
}

function modifier() {
    $.ajax({
        url: '/ajax/modifiercolonne.php',
        method: 'POST',
        data: {
            table: 'club',
            colonne: 'nom',
            valeur: nom.value,
            id: id.value
        },
        dataType: "json",
        success: data => {
            if (data.success) {
                afficherSucces("Modification enregistrée");
                // modifier le libellé de la zone de liste
                id.options[id.selectedIndex].text = nom.value.toUpperCase();
            } else {
                for (const id in data.error) {
                    const message = data.error[id];
                    if (id === 'system') {
                        console.log(message);
                        afficherErreur('Une erreur est survenue lors de l\'ajout');
                    } else if (id === 'global') {
                        msg.innerHTML = genererMessage(message);
                    } else {
                        afficherErreurSaisie(id, message);
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
        data: {
            table: 'club',
            id: id.value
        },
        dataType: "json",
        success: (data) => {
            if (data.success) {
                retournerVersApresConfirmation("Club supprimé", "/");
            } else {
                for (const id in data.error) {
                    const message = data.error[id];
                    if (id === 'system') {
                        console.error(message);
                        afficherErreur('Une erreur est survenue lors de la suppression');
                    } else if (id === 'global') {
                        msg.innerHTML = genererMessage(message);
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


