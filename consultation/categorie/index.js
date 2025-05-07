"use strict";

/* global data, Tabulator */

// colonnes de data : id, nom, ageMin, ageMax, dateMax, dateMin
// colonne du tableau affiché : Code, Nom, Âge, Année de naissance,

// application du composant tabulator
let options = {
    data: data,
    layout: "fitDataTable",
    columns: [
        {
            title: 'Code',
            field: 'id',
            hozAlign: "center",
            headerHozAlign: "center"
        },
        {
            title: 'Nom',
            field: 'nom'
        },
        {
            title: 'Âge',
            field: 'age',
            hozAlign: "center",
            headerHozAlign: "center"
        },
        {
            title: 'Année de naissance',
            field: 'annee',
            hozAlign: "center",
            headerHozAlign: "center"
        }
    ],
    tooltips: true,
    movableColumns: true,
    resizableRows: true,
    initialSort: [
        {column: 'id', dir: 'asc'}
    ],
    rowFormatter: function (row) {
        row.getElement().style.backgroundColor = "#FFF";
    },
};
new Tabulator('#tableau', options);


