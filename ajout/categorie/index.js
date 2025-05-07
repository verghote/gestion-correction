"use strict";

import {
    configurerFormulaire,
    filtrerLaSaisie,
    donneesValides,
    ucWord,
    afficherErreur,
    afficherErreurSaisie,
    afficherSucces,
    genererMessage,
    afficherDansConsole,
    viderLesChamps
} from 'https://verghote.github.io/composant/fonction.js';


// récupération des éléments de l'interface
const id = document.getElementById('id');
const nom = document.getElementById('nom');
const ageMin = document.getElementById('ageMin');
const ageMax = document.getElementById('ageMax');
let msg = document.getElementById('msg');
const btnAjouter = document.getElementById('btnAjouter');

// Données de test
id.value = 'BE';
nom.value = 'Benjamin';
ageMin.value = 11;
ageMax.value = 13;

configurerFormulaire();
filtrerLaSaisie('nom', /[A-Za-z0-9 ]/);
filtrerLaSaisie('id', /[A-Za-z0-9]/);
// un champ de type number accepte le 'e'
filtrerLaSaisie('ageMin', /[0-9]/);
filtrerLaSaisie('ageMax', /[0-9]/);

// demande d'ajout d'une catégorie
btnAjouter.onclick = () => {
    msg.innerHTML = '';
    id.value = id.value.trim().toUpperCase();
    nom.value = ucWord(nom.value.trim());
    if ( donneesValides()) {
        ajouter();
    }
};

function ajouter() {
    $.ajax({
        url: '/ajax/ajouter.php',
        method: 'POST',
        async: false,
        data: {
            table : 'categorie',
            id: id.value,
            nom: nom.value,
            ageMin : ageMin.value,
            ageMax : ageMax.value
        },
        dataType: "json",
        success: data => {
            if (data.success) {
                afficherSucces("Ajout enregistrée");
                viderLesChamps();
            } else {
                for (const key in data.error) {
                    const message = data.error[key];
                    if (key === 'system') {
                        console.log(message);
                        afficherErreur('Une erreur est survenue lors de l\'ajout');
                    } else if (key === 'global') {
                        msg.innerHTML = genererMessage(message);
                    } else {
                        afficherErreurSaisie(key, message);
                    }
                }
            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
           afficherDansConsole(reponse.responseText);
        }
    });
}


