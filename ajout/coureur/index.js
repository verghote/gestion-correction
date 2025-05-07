"use strict";
// Ajout d'un coureur

import {
    configurerFormulaire,
    donneesValides,
    filtrerLaSaisie,
    viderLesChamps,
    afficherErreurSaisie,
    afficherSucces,
    afficherErreur,
    afficherDansConsole,
    enleverAccent,
    supprimerEspace, genererMessage
} from 'https://verghote.github.io/composant/fonction.js';

// variables globales

/* global data */

// récupération des éléments sur l'interface
const licence = document.getElementById('licence');
const nom = document.getElementById('nom');
const prenom = document.getElementById('prenom');
const sexe = document.getElementById('sexe');
const dateNaissance = document.getElementById('dateNaissance');
const idClub = document.getElementById('idClub');
const ffa = document.getElementById('ffa');
const email = document.getElementById('email');
const telephone = document.getElementById('telephone');
const msg = document.getElementById('msg');
const btnAjouter = document.getElementById('btnAjouter');

// Données de test
nom.value = 'Dupont';
prenom.value = 'Hervé';
dateNaissance.value = '2001-01-01';
licence.value = '000000';

// alimentation du formulaire
for (const element of data) {
    idClub.add(new Option(element.nom, element.id));
}

// contrôle des données
configurerFormulaire();
filtrerLaSaisie('telephone', /[0-9]/);
filtrerLaSaisie('licence', /[0-9]/);
filtrerLaSaisie('nom', /[A-Za-z '-]/);
filtrerLaSaisie('prenom', /[A-Za-zÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ '-]/);

// Lancement des traitements
btnAjouter.onclick = () => {
    // mise en forme des données
    nom.value = enleverAccent(supprimerEspace(nom.value)).toUpperCase();
    prenom.value = enleverAccent(supprimerEspace(prenom.value)).toUpperCase();
    // contrôle des champs de saisie
    msg.innerHTML = "";
    if (donneesValides()) {
        ajouter();
    }
};

nom.focus();

function ajouter() {
    // Alimentation de l'objet formData pour le transfert des données
    const monFormulaire = new FormData();
    monFormulaire.append('table', 'coureur');
    monFormulaire.append('nom', nom.value);
    monFormulaire.append('prenom', prenom.value);
    monFormulaire.append('sexe', sexe.value);
    monFormulaire.append('dateNaissance', dateNaissance.value);
    monFormulaire.append('licence', licence.value);
    monFormulaire.append('idClub', idClub.value);
    monFormulaire.append('ffa', ffa.checked ? '1' : '0');

    // prise en compte des champs optionnels
    if (email.value.length > 0) {
        monFormulaire.append('email', email.value);
    }
    if (telephone.value.length > 0) {
        monFormulaire.append('telephone', telephone.value);
    }

    //  demande d'ajout dans la base de données
    $.ajax({
        url: '/ajax/ajouter.php',
        method: 'POST',
        async: false,
        data: monFormulaire,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                // Mise à jour de l'interface
                viderLesChamps();
                afficherSucces(data.success);
            } else {
                for (const key in data.error) {
                    const message = data.error[key];
                    if (key === 'system') {
                        console.log(message);
                        afficherErreur('Une erreur système est survenue lors de l\'opération ');
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
