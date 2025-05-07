"use strict";

import {
    afficherErreur, afficherDansConsole, genererMessage
} from 'https://verghote.github.io/composant/fonction.js';

/* global data, Tabulator */

// récupération des données de l'interface
const idBloc = document.getElementById('idBloc');
const idDomaine = document.getElementById('idDomaine');
const msg = document.getElementById('msg');

// initialisation du composant Tabulator
const options = {
    layout: "fitDataStretch",
    columns: [
        {
            title: "Code",
            field: "code",
            width: 100
        },
        {
            title: "Libellé",
            field: "libelle",
            formatter: function(cell) {
                return `<div class="wrap-text">${cell.getValue()}</div>`; // Ajout d'une div avec la classe wrap-text
            },
        }
    ],
    pagination: false,
    movableColumns: true, // Déplacement des colonnes
    resizableColumns: true, // Redimensionnement des colonnes
    rowFormatter: function (row) {
        row.getElement().style.backgroundColor = "#FFF";
    },
};
const table = new Tabulator("#tableau", options);


// remplir la zone de liste des blocs
for (const bloc of data) {
    idBloc.appendChild(new Option(bloc.libelle, bloc.id));
}

// gestionnaire d'événement sur les zones de liste idBloc
idBloc.onchange = function() {
    getLesDomaines(this.value);
};

// gestionnaire d'événement sur la zone de liste idDomaine
idDomaine.onchange = function() {
    getLesCompetences(idBloc.value, this.value);
};

// Lancer la fonction getLesdomaines() avec l’id du bloc sélectionné
getLesDomaines(idBloc.value);

function getLesDomaines(idBloc) {
    $.ajax({
        url: 'ajax/getlesdomaines.php',
        method: 'post',
        data: {
            idBloc: idBloc,
        },
        dataType: 'json',
        success: traiterReponse,
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
            afficherDansConsole(reponse.responseText);
        }
    });
}

function traiterReponse(data) {
    if (data.error) {
        msg.innerHTML = genererMessage(data.error.global, 'orange');
    } else {
        // réinitialisation de la liste des domaines
        idDomaine.innerHTML = '';
        // ajout de l'option 'Tous les domaines'
        idDomaine.add(new Option('Tous les domaines', '*'), 0);
        // ajout des domaines contenant dans data
        for (const domaine of data) {
            idDomaine.add(new Option(domaine.libelle, domaine.idDomaine));
        }
        // récupération des compétences du bloc et du domaine sélectionnés
        getLesCompetences(idBloc.value, idDomaine.value);
    }
}

function getLesCompetences(idBloc, idDomaine) {
    $.ajax({
        url: 'ajax/getlescompetences.php',
        type: 'post',
        data: {
            idBloc: idBloc,
            idDomaine: idDomaine,
        },
        dataType: 'json',
        success: data => {
            if (data.error) {
                msg.innerHTML = genererMessage(data.error.global, 'orange');
            } else {
                table.setData(data);
            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
            afficherDansConsole(reponse.responseText);
        }
    });
}




