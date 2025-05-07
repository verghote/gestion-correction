"use strict";

import {
    configurerFormulaire,
    donneesValides,
    afficherErreurSaisie,
    genererMessage,
    afficherErreur,
    afficherDansConsole,
    retournerVers
} from 'https://verghote.github.io/composant/fonction.js';

/*global data, min, max, CKEDITOR */

// variable stockant l'objet CKEditor
let editor;

// récupération des élements de l'interface
let nom = document.getElementById('nom');
let date = document.getElementById('date');
let description = document.getElementById('description');
let btnModifier = document.getElementById('btnModifier');
let msg = document.getElementById('msg');

// alimentation des champs sur le formulaire
date.value = data.date;
nom.value = data.nom;
description.value = data.description;

// Contrôle dynamique sur les champs de saisi
date.min = min;
date.max = max;

btnModifier.onclick = () => {
    // récupération de la valeur du composant CkEditor
    description.value = CKEDITOR.instances.description.getData();
    if ( donneesValides()) {
        modifier();
    }
};

// mise en place du composant ckEditor
CKEDITOR.replace('description');

// Mise en place des balises div de class 'messageErreur' sur chaque champ de saisie
configurerFormulaire();

function modifier() {
    msg.innerHTML = '';
    // transmission des paramètres
    let modif = false;
    const lesValeurs = {};
    if (nom.value !== data.nom) {
        lesValeurs.nom = nom.value;
        modif = true;
    }
    if (description.value !== data.description) {
        lesValeurs.description = description.value;
        modif = true;
    }
    if (date.value !== data.date) {
        lesValeurs.date = date.value;
        modif = true;
    }
    if (modif === false)  {
        afficherErreur("aucune modification constatée !");
        return;
    }
    $.ajax({
        url: '/ajax/modifier.php',
        method: 'post',
        dataType: 'json',
        async: false,
        data: {
            table : 'annonce',
            id : data.id,
            lesValeurs : JSON.stringify(lesValeurs)
        },
        success: data => {
            if (data.success) {
                retournerVers(data.success, 'index.php');
            } else if (data.error) {
                for (const key in data.error) {
                    const message = data.error[key];
                    if (key === 'system') {
                        console.log(message);
                        afficherErreur('Une erreur est survenue lors de la modification');
                    } else if (key === 'global') {
                        msg.innerHTML =  genererMessage(message);
                    } else  {
                        afficherErreurSaisie(key, message );
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