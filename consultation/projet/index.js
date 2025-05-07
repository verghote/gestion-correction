"use strict";

import {
    afficherDansConsole,
    genererMessage, afficherErreur
} from 'https://verghote.github.io/composant/fonction.js';

/* global lesProjets, Tabulator */

// Récupération des éléments de l'interface
const idProjet = document.getElementById('idProjet');
const tableau = document.getElementById('tableau');
const msg = document.getElementById('msg');

// Sur le changement de valeur sélectionnée dans la zone de liste, récupérer les compétences associées
idProjet.onchange = () => {
    if (idProjet.value !== '0') {
        chargerLesCompetencesDuProjet(idProjet.value);
    }
};

// Alimenter la zone de liste des projets
for (const projet of lesProjets) {
    idProjet.add(new Option(projet.nom, projet.id));
}

// Initialiser Tabulator pour afficher les compétences
let table = new Tabulator(tableau, {
    layout: "fitDataStretch",
    columns: [
        {
            title: "Code",
            field: "code",
            headerHozAlign: "center",
            width: 70,
        },
        {   title: "Libellé",
            field: "libelle",
            headerHozAlign: "left",
            formatter: function(cell) {
                return `<div class="wrap-text">${cell.getValue()}</div>`; // Ajout d'une div avec la classe wrap-text
            },

        }
    ],
    placeholder: "Aucune compétence à afficher",
    rowFormatter: function(row) {
        row.getElement().style.backgroundColor = "#FFF";
    },
});


/**
 * Récupération des compétences du projet sélectionné
 */
function chargerLesCompetencesDuProjet(idProjet) {
    $.ajax({
        url: 'ajax/getlescompetences.php',
        method: 'POST',
        data: {
            idProjet: idProjet
        },
        dataType: 'json',
        success: data => {
            if (data.error) {
                msg.innerHTML = genererMessage(data.error.global, 'orange');
            } else {
                msg.innerHTML = '';
                table.setData(data); // Met à jour le tableau avec les données reçues
            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
            afficherDansConsole(reponse.responseText);
        }
    });
}
