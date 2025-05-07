"use strict";


/* global data, Tabulator  */

// Propriété de l'objet data : licence, nom, prenom, sexe, dateNaissanceFr, idCategorie, nomClub
// Colonne du tableau : Licence, Nom, Prénom, Sexe, Date de naissance, Catégorie, Club

// Initialisation du composant Tabulator
let options = {
    data: data,
    layout: "fitColumns",
    responsiveLayout: "hide", // Active la gestion des colonnes en mode responsive
    columns: [
        {
            title: 'Licence',
            field: 'licence',
            hozAlign: "center",
            headerHozAlign: "center",
            headerFilter: "input",
            minWidth: 100,
            responsive: 1
        },
        {
            title: 'Nom',
            field: 'nom',
            headerFilter: "input",
            minWidth: 150,
        },
        {
            title: 'Prénom',
            field: 'prenom',
            headerFilter: "input",
            minWidth: 150,
        },
        {
            title: 'Sexe',
            field: 'sexe',
            hozAlign: "center",
            headerHozAlign: "center",
            headerFilter: "input",
            minWidth: 50,
            responsive: 4 // Priorité de masquage (2 = masqué après les colonnes ayant priorité 1)
        },
        {
            title: 'Né(e) le',
            field: 'dateNaissanceFr',
            hozAlign: "center",
            headerHozAlign: "center",
            headerFilter: "input",
            minWidth: 100,
            responsive: 3 // Priorité de masquage
        },
        {
            title: 'Cat.',
            field: 'idCategorie',
            hozAlign: "center",
            headerHozAlign: "center",
            headerFilter: "input",
            minWidth: 70,
            responsive: 2
        },
        {
            title: 'Club',
            field: 'nomClub',
            headerFilter: "input",
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
let table = new Tabulator('#tableau', options);

// gestion d'événement sur les boutons d'export
document.getElementById("export-csv").onclick = () => table.download("csv", "data.csv");

document.getElementById("export-json").onclick = () => table.download("json", "data.json");

