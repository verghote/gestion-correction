"use strict";

import {
    afficherDansConsole, afficherErreur, genererMessage
} from 'https://verghote.github.io/composant/fonction.js';

/* global lesCategories, lesClubs, Tabulator */
// lesCatégories : Tableau permettant de remplir la zone de liuste des catégories
// lesClubs : Tableau permettant de remplir la zone de liste des clubs

// récupération des éléments de l'interface
const idCategorie = document.getElementById('idCategorie');
const idClub = document.getElementById('idClub');
const sexe = document.getElementById('sexe');
const msg = document.getElementById('msg');

// initialisation du composant Tabulator
const options = {
    layout: "fitColumns",
    placeholder: "Aucun enregistrement ne correspond à votre recherche",
    responsiveLayout: "hide", // Active la gestion des colonnes en mode responsive
    columns: [
        {
            title: 'Licence',
            field: 'licence',
            hozAlign: "center",
            headerHozAlign: "center",
            width: 100,
            responsive: 2
        },
        {
            title: 'Nom',
            field: 'nom',
            minWidth: 150,
        },
        {
            title: 'Prénom',
            field: 'prenom',
            minWidth: 150,
        },
        {
            title: 'Sexe',
            field: 'sexe',
            hozAlign: "center",
            headerHozAlign: "center",
            width: 80,

            responsive: 2 // Priorité de masquage (2 = masqué après les colonnes ayant priorité 1)
        },
        {
            title: 'Né(e) le',
            field: 'dateNaissanceFr',
            hozAlign: "center",
            headerHozAlign: "center",
            width: 90,
            responsive: 2 // Priorité de masquage
        },
        {
            title: 'Cat.',
            field: 'idCategorie',
            hozAlign: "center",
            headerHozAlign: "center",
            width: 80,
            responsive: 2
        },
        {
            title: 'Club',
            field: 'nomClub',
            minWidth: 150,
            responsive: 2 // Priorité de masquage
        }
    ],
    tooltips: true,
    pagination: 'local',
    paginationSize: 20,
    paginationSizeSelector: [20, 50, 100],
    movableColumns: true,
    initialSort: [
        {column: 'licence', dir: 'asc'}
    ],
    rowFormatter: function (row) {
        row.getElement().style.backgroundColor = "#FFF";
    },
};
const table = new Tabulator('#tableau', options);


// alimentation de la zone de liste des catégories
for (const element of lesCategories) {
    idCategorie.appendChild(new Option(element.nom, element.id));
}

// alimentation de la zone de liste des clubs
for (const element of lesClubs) {
    idClub.add(new Option(element.nom, element.id));
}

// gestionnaire d'évènement sur le changement de valeurs dans les zones de liste
idCategorie.onchange = filtrer;
idClub.onchange = filtrer;
sexe.onchange = filtrer;

// fonction de filtrage
function filtrer() {
    $.ajax({
        url: 'ajax/getlescoureurs.php',
        type: 'POST',
        dataType : 'json',
        data: {
            idCategorie: idCategorie.value,
            idClub: idClub.value,
            sexe: sexe.value
        },
        success: function (data) {
            if (data.error) {
                msg.innerHTML = genererMessage(data.error.global, 'orange');
                table.replaceData([]);
            } else {
                msg.innerHTML = '';
                table.setData(data);
            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
            afficherDansConsole(reponse.responseText);
        }
    });
}

