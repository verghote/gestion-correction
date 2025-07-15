"use strict";


// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {modifierColonne, supprimerEnregistrement} from "/composant/fonction/ajax.js";
import {confirmer } from '/composant/fonction/afficher.js';
import {enleverAccent} from "../../composant/fonction/format";
import {verifier} from "/composant/fonction/controle.js";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

/* global lesClubs */

const lesLignes = document.getElementById('lesLignes');

// -----------------------------------------------------------------------------------
// Procédures évènementielles
// -----------------------------------------------------------------------------------


// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------


// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

// Insertion des annonces dans la balise tbody
for (const club of lesClubs) {
    const id = club.id;
    const tr = lesLignes.insertRow();
    tr.id = id;
    tr.style.verticalAlign = 'middle';

    // Colonne permettant de demander la suppression du club
    let td = tr.insertCell();

    // Bouton supprimer si l'effectif est à 0
    if (club.nb === 0) {
        const btnSupprimer = document.createElement('span');
        btnSupprimer.textContent = '✘';
        btnSupprimer.style.color = 'red';
        btnSupprimer.style.cursor = 'pointer';
        btnSupprimer.title = 'Supprimer';
        // Fonction de rappel exécutée en cas de succès de la suppression
        let success = (reponse) => {
            document.getElementById(id)?.remove();
        };
        // fonction à lancer si la demande de confirmation est validée
        const supprimer = () => {
            supprimerEnregistrement('club', id, success);
        };

        // demander la confirmation avant de lancer la fonction
        btnSupprimer.onclick = () => confirmer(supprimer);

        td.appendChild(btnSupprimer);
    }


    // Colonne id (non modifiable)
    tr.insertCell().innerText = club.id;

    // colonne nom (modifiable)
    td = tr.insertCell();
    const inputNom = document.createElement('input');
    inputNom.type = 'textbox';
    inputNom.classList.add('form-control');
    inputNom.value = club.nom;
    // réglage des attributs pour la validation HTML5
    inputNom.required = true;
    inputNom.maxlength='70';
    inputNom.pattern="^[A-Za-z]+([ '\-.]?[A-Za-z0-9])*$";
    // sur la modification du nom du club
    inputNom.onchange = function ()  {
        // On enlève les accents et on met en majuscules
        this.value = enleverAccent(this.value).toUpperCase();
        // on vérifie la validité du champ pour lancer la modification
        if (verifier(this)) {
            modifierColonne('club', 'nom', this.value, id);
        }
    };
    td.appendChild(inputNom);

    // Colonne effectif (non modifiable)
    td = tr.insertCell();
    td.style.textAlign = 'right';
    td.style.paddingRight = '10px';
    td.innerText = club.nb;

}