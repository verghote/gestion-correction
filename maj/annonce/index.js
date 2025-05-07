"use strict";

import {
    confirmer,
    afficherSucces,
    genererMessage,
    afficherDansConsole,
    afficherErreur, corriger, retournerVersApresConfirmation
} from 'https://verghote.github.io/composant/fonction.js';

/* global data */

// récupération des élements sur l'interface
const lesLignes = document.getElementById('lesLignes');
const msg = document.getElementById('msg');
const deleteOld = document.getElementById('deleteOld')

// Demande de suppression des anciennes annonces
deleteOld.onclick= () => confirmer(() => delOld());

// Inserttion des annonces dans la balise tbody
for (const element of data) {
    const id = element.id;
    const tr = lesLignes.insertRow();
    tr.id = id;
    tr.style.verticalAlign = 'middle';

    // Colonne permettant de demander la suppression ou la modification de la course
    let td = tr.insertCell();

    let i = document.createElement('i');
    i.classList.add('bi', 'bi-x', 'text-danger', 'm-1');
    i.style.cursor = 'pointer';
    i.onclick = () => confirmer(() => supprimer(id));
    td.appendChild(i);

    i = document.createElement('i');
    i.classList.add('bi', 'bi-pencil', 'text-warning', 'm-1');
    i.style.cursor = 'pointer';
    i.onclick = () => location.href = 'maj.php?id=' + id;
    td.appendChild(i);

    // Colonne date
    tr.insertCell().innerText = element.dateFr;

    // colonne nom
    tr.insertCell().innerText = element.nom;

    // colonne active contenant une case à cocher
    td = tr.insertCell();
    td.style.textAlign = 'center';
    const inputActif = document.createElement('input');
    inputActif.type = 'checkbox';
    inputActif.classList.add('form-check-input');
    inputActif.checked = element.actif === 1;
    inputActif.onchange = () => modifier(inputActif, id);
    td.appendChild(inputActif);
}


/**
 * Demande de suppression
 * @param {int} id id de l'enregistrement
 */
function supprimer(id) {
    $.ajax({
        url: '/ajax/supprimer.php',
        method: 'POST',
        data: {
            table : 'annonce',
            id: id
        },
        dataType: 'json',
        success: data => {
            if (data.success) {
                afficherSucces(data.success);
                // Mise à jour de l'interface
                const ligne = document.getElementById(id);
                ligne.parentNode.removeChild(ligne);
            } else {
                for (const key in data.error) {
                    const message = data.error[key];
                    if (key === 'global') {
                        msg.innerHTML =  genererMessage(message);
                    } else  {
                        afficherErreur('Une erreur est survenue lors de la suppression');
                        console.error(message);
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

/**
 * Demande de modification de la valeur du champ actif  représentée par une case à cocher
 * @param {object} input de type case à cocher
 * @param {int} id identifiant de l'annonce à modifier
 */
function modifier(input, id) {
    const valeur = input.checked ? 1 : 0;
    $.ajax({
        url: '/ajax/modifiercolonne.php',
        method: 'post',
        data: {
            table : 'annonce',
            colonne: 'actif',
            valeur: valeur,
            id: id,
        },
        dataType: 'json',
        success: data => {
            if (data.success) {
                afficherSucces(data.success);
            } else  {
                for (const key in data.error) {
                    const message = data.error[key];
                   if (key === 'global') {
                       corriger(input, message);
                    } else  {
                        console.log(message);
                       corriger(input, 'Une erreur interne est survenue');
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

function delOld() {
    msg.innerText = "";
    $.ajax({
        url: 'ajax/deleteold.php',
        method: 'POST',
        dataType: 'json',
        success: data => {
            if (data === 0) {
                afficherErreur('Aucune annonce supprimée');
            } else if (data === 1) {
                retournerVersApresConfirmation( 'Une seule annonce supprimée','index.php')
            }  else {
                retournerVersApresConfirmation(data + ' annonces supprimées', 'index.php')
            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
           afficherDansConsole(reponse.responseText);
        }
    });
}
