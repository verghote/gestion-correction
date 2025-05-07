"use strict";

/* global data, Tabulator */

// récupération des données de l'interface
const search = document.getElementById('search');

// gestionnaire d'évènement
search.onfocus = () => {
    search.value = '';
};

// sur chaque caractère saisi dans le champ de recherche
search.oninput = filtrer;

// Initialisation du composant Tabulator
const table = new Tabulator('#tableau', {
    data : data,
    layout: "fitColumns",
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
});

function filtrer() {
    table.setFilter(x => Object.values(x).some(value => value.toString().toLowerCase().includes(search.value.toLowerCase())));
}



