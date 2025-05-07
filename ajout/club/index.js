"use strict";

import {
    configurerFormulaire,
    donneesValides,
    filtrerLaSaisie,
    afficherErreurSaisie,
    afficherSucces,
    afficherErreur,
    afficherDansConsole,
    genererMessage, viderLesChamps
} from 'https://verghote.github.io/composant/fonction.js';

// récupération des éléments de l'interface
let id = document.getElementById('id');
let nom = document.getElementById('nom');
let msg = document.getElementById('msg');
let btnAjouter = document.getElementById('btnAjouter');

configurerFormulaire();
filtrerLaSaisie('nom', /[A-Za-zÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ '-.]/);


// demande d'ajout d'un club
btnAjouter.onclick = () => {
    if (donneesValides()) {
        ajouter();
    }
};

function ajouter() {
    $.ajax({
        url: '/ajax/ajouter.php',
        method: 'POST',
        async: false,
        data: {
            table : 'club',
            id: id.value,
            nom: nom.value
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
