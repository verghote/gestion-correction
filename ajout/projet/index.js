"use strict";

import {
    configurerFormulaire,
    donneesValides,
    afficherErreur,
    afficherDansConsole,
    effacer,
    afficherSucces, genererMessage,
} from 'https://verghote.github.io/composant/fonction.js';

/* global data */

// tableau pour conserver les compétences sélectionnées
let lesCompetencesDuProjet = [];

// récupération des données de l'interface
const idCompetence = document.getElementById('idCompetence');
const btnAjouterCompetence = document.getElementById('btnAjouterCompetence');
const lesLignes = document.getElementById('lesLignes');
const nom = document.getElementById('nom');
const btnEnregistrer = document.getElementById('btnEnregistrer');
const msg = document.getElementById('msg');

// Alimentation de la zone de liste des compétences
for (const element of data) {
    idCompetence.add(new Option(element.libelle, element.id));
}

// contrôle automatique sur le nom
configurerFormulaire(true);

// traitement associé aux boutons
btnAjouterCompetence.onclick = ajouterCompetence;


btnEnregistrer.onclick = () => {
    // vérification sur le champ nom
    if (!donneesValides()) {
        return false;
    }
    // il faut au moins une compétence
    if (lesCompetencesDuProjet.length === 0) {
        afficherErreur('Il faut associer au moins une compétence au projet');
        return false;
    }
    enregistrer();
};

/**
 * Ajoute la compétence dans le tableau lesCompetencesDuProjet si elle n'est pas déjà présente
 * Met à jour l'interface en ajoutant une ligne dans la balise table affichant les compétences sélectionnées
 */
function ajouterCompetence() {
    // contrôle d'unicité
    if (lesCompetencesDuProjet.findIndex(x => x === idCompetence.value) >= 0) {
        afficherErreur('Cette compétence est déjà présente');
        return;
    }
    // mise à jour du tableau
    lesCompetencesDuProjet.push(idCompetence.value);

    // mise à jour de l'interface attention : Il faut que le paramètre corresponde à une variable locale
    // Ajout d'une ligne sur l'interface
    const tr = lesLignes.insertRow();
    const id = idCompetence.value;
    tr.id = id;
    const i = document.createElement('i');
    i.classList.add('bi', 'bi-x', 'text-danger');
    // déclenchenchement de la suppression sur le clic : attention nécessite une variable locale
    i.onclick = () => supprimerCompetence(id);
    tr.insertCell().appendChild(i);
    // la seconde colonne doit envoyerReponse le nom de la compétence (propriété text de l'élément sélectionné dans la liste)
    tr.insertCell().innerText = idCompetence[idCompetence.selectedIndex].text;
}

function supprimerCompetence(id) {
    // mise à jour du tableau
    const index = lesCompetencesDuProjet.findIndex(x => x === id);
    lesCompetencesDuProjet.splice(index, 1);

    // mise à jour de l'interface
    const ligne = document.getElementById(id);
    ligne.parentNode.removeChild(ligne);
}

/**
 * Demande d'enregistrement du projet avec ses compétences
 */
function enregistrer() {
    msg.innerHTML = '';
    $.ajax({
        url: 'ajax/enregistrer.php',
        method: 'POST',
        data: {
            nom: nom.value,
            lesCompetences: JSON.stringify(lesCompetencesDuProjet)
        },
        dataType: 'json',
        success: (data) => {
            if (data.error) {
                // détection du type d'erreur
                if (data.error.system) {
                    console.error(data.error.system);
                    afficherErreur('Une erreur est survenue lors de l\'ajout du projet');
                } else if (data.error.global) {
                    msg.innerHTML = genererMessage(data.error.global, 'rouge');
                } else {
                    msg.innerHTML = genererMessage(data.error.nom, 'orange' );
                }
            } else {
                afficherSucces('Projet enregistré');
                // mise à jour du tableau
                lesCompetencesDuProjet = [];
                // mise à jour de l'interface
                nom.value = '';
                effacer('lesLignes');

            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
           afficherDansConsole(reponse.responseText);
        }
    });
}
