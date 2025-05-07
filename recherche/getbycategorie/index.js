"use strict";

import {
    afficherDansConsole,
    afficherErreur
} from 'https://verghote.github.io/composant/fonction.js';

/* global data, Tabulator */


// récupération des éléments de l'interface
const idCategorie = document.getElementById('idCategorie');

// Initialisation du composant Tabulator
const options = {
    layout: "fitColumns",
    responsiveLayout: "hide", // Active la gestion des colonnes en mode responsive
    placeholder: "Aucun coureur dans cette catégorie",
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
    // Utilisation du français dans la zone de pagination
    locale: true,
    langs: {
        "fr-fr": {
            "pagination": {
                "first": "Première",
                "first_title": "Première page",
                "last": "Dernière",
                "last_title": "Dernière page",
                "prev": "Précédente",
                "prev_title": "Page précédente",
                "next": "Suivante",
                "next_title": "Page suivante",
                "page_size": "Taille de page"
            }
        }
    }

};
const table = new Tabulator('#tableau', options);

// alimentation de la zone de liste des catégories
for (const element of data) {
    idCategorie.add(new Option(element.nom, element.id));
}

// gestionnaire d'évènement
idCategorie.onchange = () => {
    if (idCategorie.value !== "0") {
        getLesCoureurs(idCategorie.value);
    }
};

function getLesCoureurs(idCategorie) {
    $.ajax({
        url: 'ajax/getlescoureurs.php',
        method: 'post',
        data: {idCategorie: idCategorie},
        dataType: 'json',
        success: data => {
           table.setData(data);
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
           afficherDansConsole(reponse.responseText);
        }
    });
}

