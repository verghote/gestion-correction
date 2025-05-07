"use strict";

import {
    afficherErreur, afficherDansConsole, getAge, afficherErreurSaisie,
    filtrerLaSaisie, configurerFormulaire
} from 'https://verghote.github.io/composant/fonction.js';

/* global data, autoComplete */

// récupération des éléments de l'interface
const licence = document.getElementById('licence');
const nom = document.getElementById('nom');
const prenom = document.getElementById('prenom');
const sexe = document.getElementById('sexe');
const dateNaissance = document.getElementById('dateNaissance');
const nomClub = document.getElementById('nomClub');
const idCategorie = document.getElementById('idCategorie');
const age = document.getElementById('age');
const nomR = document.getElementById('nomR');

// filtrage de la saisie
filtrerLaSaisie('nomR', /[a-zA-Z ]/);

configurerFormulaire();

nomR.onfocus = () => {
    effacer();
};

// paramétrage du composant autoComplete
const options = {
    data: {
        src: data,
        keys: ["nomPrenom"]
    },
    selector: "#nomR",
    resultItem: {
        highlight: true,
    },
    theme: 'round',
    resultsList: {
        element: (list, data) => {
            const info = document.createElement("p");
            info.style.padding = "2px 2px";
            info.style.fontStyle = "italic";
            info.style.fontSize = "0.8em";
            const nb = data.matches.length;
            if (nb > 1) {
                info.innerHTML = nb + " licenciés trouvés";
            } else if (nb === 1) {
                info.innerHTML = "Un licencié correspondant";
            } else {
                info.innerHTML = "Aucun licencié correspondant";
            }
            list.append(info);
        },
        noResults: true,
        maxResults: 10,
    },
    events: {
        input: {
            // lorsque l'utilisateur clique sur un élément de la liste affichée
            selection: (event) => {
                const selection = event.detail.selection.value;
                nomR.value = selection.nomPrenom;
                rechercher(selection.licence);
            },
        }
    },
};
const auto = new autoComplete(options);


// Lancement de la recherche
function rechercher(licence) {
    $.ajax({
        url: 'ajax/getbylicence.php',
        method: 'post',
        data: {
            licence: licence,
        },
        dataType: 'json',
        success: (data) => {
            if (data.error) {
                afficherErreurSaisie('licenceR', data.error.licenceR);
            } else {
                afficher(data);
            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
            afficherDansConsole(reponse.responseText);
        }
    });
}

function afficher(coureur) {
    nomR.value = '';
    licence.innerText = coureur.licence;
    nom.innerText = coureur.nom;
    prenom.innerText = coureur.prenom;
    sexe.innerText = coureur.sexe;
    dateNaissance.innerText = coureur.dateNaissanceFr;
    nomClub.innerText = coureur.nomClub;
    idCategorie.innerText = coureur.idCategorie;
    age.innerText = getAge(coureur.dateNaissanceFr) + ' ans';
}

function effacer() {
    nomR.value = '';
    licence.innerText = '';
    nom.innerText = '';
    prenom.innerText = '';
    sexe.innerText = '';
    dateNaissance.innerText = '';
    nomClub.innerText = '';
    idCategorie.innerText = '';
    age.innerText = '';
}