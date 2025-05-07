"use strict";

import {
    afficherDansConsole, afficherErreur
} from 'https://verghote.github.io/composant/fonction.js';

/* global lesCategories, lesClubs, data, Tabulator */
// lesCatégories : Tableau permettant de remplir la zone de liuste des catégories
// lesClubs : Tableau permettant de remplir la zone de liste des clubs

// récupération des éléments de l'interface
const idCategorie = document.getElementById('idCategorie');
const nomClub = document.getElementById('nomClub');
const sexe = document.getElementById('sexe');

// initialisation du composant Tabulator
let options = {
    data: data,
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
    nomClub.add(new Option(element.nom, element.nom));
}


// gestionnaire d'évènement sur le changement de valeurs dans les zones de liste
idCategorie.onchange = filtrer;
nomClub.onchange = filtrer;
sexe.onchange = filtrer;

// fonction de filtrage
function filtrer() {
    table.setFilter(x =>
        [nomClub.value, idCategorie.value, sexe.value].every((value, index) => value === "*" || x[Object.keys(x)[index]] === value)
    );
}

