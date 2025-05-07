"use strict";

// ajout d'une annonce

import {
    configurerFormulaire,
    donneesValides,
    afficherErreurSaisie,
    genererMessage,
    afficherErreur,
    afficherDansConsole,
    viderLesChamps,
} from 'https://verghote.github.io/composant/fonction.js';

/*global min, max, value, CKEditor */

// récupération des élements de l'interface
let nom = document.getElementById('nom');
let date = document.getElementById('date');
let description = document.getElementById('description');
let btnAjouter = document.getElementById('btnAjouter');
let msg = document.getElementById('msg');

// Données de test
nom.value = 'COURSE SOLIDAIRE FEMININE';
description.value = `La 14ème édition de la Course Solidaire Féminine se déroulera dans le cadre de la Journée Internationale des Droits de la Femme, le dimanche 10 mars 2024, au parc de la Hotoie d’Amiens.
Cette course est organisée par l’US Camon Athlétisme.
L’objectif de cette course est d’encourager la pratique du sport chez les femmes. Pour cette raison, la distance est volontairement limitée à 5 km afin que les débutantes puissent en faire un premier objectif atteignable en un temps de préparation raisonnable.`;

CKEDITOR.replace('description', {uiColor: '#42a4b9', height: '300px'});

// Contrôle dynamique sur les champs de saisi
date.min = min;
date.max = max;
date.value = value;



btnAjouter.onclick = () => {
    // récupération de la valeur du composant CkEditor
    description.value = CKEDITOR.instances.description.getData();
    if (donneesValides()) {
        ajouter();
    }
};


// Mise en place des balises div de class 'messageErreur' sur chaque champ de saisie
configurerFormulaire();

function ajouter() {
    $.ajax({
        url: '/ajax/ajouter.php',
        method: 'post',
        dataType: 'json',
        data  : {
            table : 'annonce',
            nom : nom.value,
            description : description.value,
            date : date.value
        },
        success: (data) => {
            if (data.success) {
                msg.innerHTML = genererMessage("L'annonce est enregistrée, elle apparaitra sur la page d'accueil après validation par le webmaster", "vert");
                document.getElementById('formulaire').style.display = "none";
                viderLesChamps();
            } else if (data.error) {
                for (const key in data.error) {
                    const message = data.error[key];
                    if (key === 'system') {
                        console.log(message);
                        afficherErreur('Une erreur inattendue est survenue');
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