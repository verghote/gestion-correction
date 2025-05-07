"use strict";

import {
    configurerFormulaire,
    decoderDate,
    confirmer,
    filtrerLaSaisie,
    afficherErreurSaisie,
    afficherSucces,
    afficherDansConsole,
    afficherErreur, enleverAccent,
    avertir,
} from 'https://verghote.github.io/composant/fonction.js';

/* global intervalle, lesClubs, lesCoureurs */

// récupération des éléments de l'interface
const nom = document.getElementById('nom');
const prenom = document.getElementById('prenom');
const sexe = document.getElementById('sexe');
const dateNaissance = document.getElementById('dateNaissance');
const idClub = document.getElementById('idClub');
const ffa = document.getElementById('ffa');
const email = document.getElementById('email');
const telephone = document.getElementById('telephone');
const licence = document.getElementById('licence');
const formulaire = document.getElementById('formulaire');

const nomR = document.getElementById('nomR');

const btnSupprimer = document.getElementById('btnSupprimer');

const msg = document.getElementById('msg');
const info = document.getElementById('info');


// intervalle sur la date de naissance
dateNaissance.min = intervalle.dateMin;
dateNaissance.max = intervalle.dateMax;

// définition du contenu dynamique de la popover associé à la date de naissance
info.setAttribute('data-bs-title', 'Il faut être né entre le ' + decoderDate(intervalle.dateMin) + ' et le ' + decoderDate(intervalle.dateMax));

// alimentation de la zone de liste des clubs
for (const club of lesClubs) {
    idClub.add(new Option(club.nom, club.id));
}

nomR.onfocus = () => {
    nomR.value = '';
    formulaire.style.display = 'none';
};

nom.onchange = function ()  {
    this.value = enleverAccent(this.value).toUpperCase();
    afficherErreurSaisie(this.id);
    if (this.checkValidity()) {
        modifierColonne(this.id, this);
    }
};

prenom.onchange = function () {
    this.value = enleverAccent(this.value).toUpperCase();
    afficherErreurSaisie(this.id);
    if (this.checkValidity()) {
        modifierColonne(this.id, this);
    }
};

sexe.onchange = () => modifierColonne('sexe', sexe);

dateNaissance.onchange = function () {
    afficherErreurSaisie(this.id);
    if (this.checkValidity()) {
        modifierColonne(this.id, this);
    }
};

idClub.onchange = () => modifierColonne('idClub', idClub);

ffa.onchange = () => modifierFfa(licence.value);

email.onchange = function() {
    if (this.value !== '') {
        afficherErreurSaisie(this.id);
        if (this.checkValidity()) {
            modifierColonne(this.id, this);
        }
    } else {
        effacerColonne(this.id);
    }
};

telephone.onchange = function() {
    if (this.value !== '') {
        afficherErreurSaisie(this.id);
        if (this.checkValidity()) {
            modifierColonne(this.id, this);
        }
    } else {
        effacerColonne(this.id);
    }
};



// le bouton 'btnSupprimer'
btnSupprimer.onclick = () => confirmer(supprimer);


function modifierColonne(colonne, input) {
    $.ajax({
        url: '/ajax/modifiercolonne.php',
        method: 'POST',
        data: {
            table: 'coureur',
            colonne: colonne,
            valeur: input.value,
            id: licence.value
        },
        dataType: "json",
        success: data => {
            if (data.success) {
                afficherSucces("Modification enregistrée");
            } else {
                for (const id in data.error) {
                    const message = data.error[id];
                    if (id === 'system') {
                        console.log(message);
                        afficherErreur('Une erreur est survenue lors de l\'ajout');
                    } else if (id === 'global') {
                        afficherErreur(message);
                    } else {
                        afficherErreurSaisie(id, message);
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


function modifierFfa() {
    $.ajax({
        url: '/ajax/modifiercolonne.php',
        method: 'POST',
        data: {
            table: 'coureur',
            colonne: 'ffa',
            valeur: ffa.checked ? 1 : 0,
            id: licence.value
        },
        dataType: "json",
        success: data => {
            if (data.success) {
                afficherSucces("Modification enregistrée");
            } else {
                for (const id in data.error) {
                    const message = data.error[id];
                    if (id === 'system') {
                        console.log(message);
                        afficherErreur('Une erreur est survenue lors de l\'ajout');
                    } else if (id === 'global') {
                        afficherErreur(message);
                    } else {
                        afficherErreurSaisie(id, message);
                    }
                }
                ffa.checked = !ffa.checked;
            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
           afficherDansConsole(reponse.responseText);
        }
    });
}

function effacerColonne(colonne) {
    $.ajax({
        url: 'ajax/clearcolonne.php',
        method: 'POST',
        data: {
            colonne: colonne,
            licence: licence.value
        },
        dataType: "json",
        success: data => {
            if (data.success) {
                afficherSucces("Modification enregistrée");
            } else {
                for (const key in data.error) {
                    const message = data.error[key];
                    if (key === 'system') {
                        console.log(message);
                        afficherErreur('Une erreur est survenue lors de l\'ajout');
                    } else if (key === 'global') {
                        afficherErreur(message);
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



/**
 * Demande de suppression du coureur actuellement affiché
 */
function supprimer() {
    $.ajax({
        url: '/ajax/supprimer.php',
        type: 'POST',
        data: {
            table: 'coureur',
            id: licence.value
        },
        dataType: 'json',
        success: data => {
            if (data.success) {
                avertir('Suppression réalisée');
                // vider la zone de recherche
                formulaire.style.display = 'none';
                nomR.focus();
                nomR.value = '';
                licence.value = '';
                nom.value = '';
                prenom.value = '';
                sexe.value = '';
                dateNaissance.value = '';
                idClub.value = '';
                ffa.checked = false;
                email.value = '';
                telephone.value = '';
            } else {
                for (const key in data.error) {
                    const message = data.error[key];
                    if (key === 'system') {
                        console.error(message);
                        afficherErreur('Une erreur est survenue lors de la suppression');
                    } else if (key === 'global') {
                        afficherErreur(message);
                    } else { // ne doit jamais arriver
                        afficherErreur(message);
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


//  ------------------------------------------------------------------------------------------
//     Traitements associés à la zone de recherche
// -------------------------------------------------------------------------------------------


// récupération de la balise nomR sous la forme d'un objet jQuery
const $nomR = $('#nomR');
// definition des paramètres du composant dans un objet javascript (cle : valeur)
const option = {
    // la source de données
    data : lesCoureurs,
    // valeur alimentant la zone d'auto-complétion
    getValue: 'nomPrenom',
    //	propriété décrivant le fonctionnement du composant
    list: {
        maxNumberOfElements: 10,
        hideOnEmptyPhrase: true,
        match: {
            // limite les valeurs affichées
            enabled: true,
            // les noms affichés doivent commencer par les lettres saisies
            method: (element, phrase) => element.indexOf(phrase) === 0
        },
        // en cas de sélection par l'utilisateur
        onChooseEvent: () => {
           const valeur = $nomR.getSelectedItemData().licence;
            rechercher(valeur);

        },
        // à chaque saisie d'un caractère
        onLoadEvent: () => {
            nomR.style.color = '';
            const lesValeurs = $nomR.getItems();
            const nb = lesValeurs.length;
            if (nb === 0) {
                nomR.style.color = 'red';
            } else if (nb === 1) {
                nomR.value = lesValeurs[0].nomPrenom;
                rechercher(lesValeurs[0].licence);
            }
        }
    },
    theme: 'round'
};
$nomR.easyAutocomplete(option);

// contrôle des données saisies toujours après le système d'autocomplétion qui vient ajouter ses propres balises
configurerFormulaire();
filtrerLaSaisie('telephone', /[0-9]/);
filtrerLaSaisie('nom', /[A-Za-z ]/);
filtrerLaSaisie('nomR', /[A-Za-z ]/);
filtrerLaSaisie('prenom', /[A-Za-z ]/);

// Récupération des coordonnées du coureur
function rechercher(licence) {

    formulaire.style.display = 'none';
    nomR.blur();
    $.ajax({
        url: 'ajax/getbylicence.php',
        method: 'POST',
        data: {
            licence: licence
        },
        dataType: 'json',
        success: data => {
            if (data) {
                nomR.value = '';
                afficher(data);
            } else {
                afficherErreur("Ce licencié n'est pas dans la base");
            }
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
           afficherDansConsole(reponse.responseText);
        }
    });
}

/**
 * affichage des coordonnées du coureur contenues dans le paramètre implicite data
 * On conserve les coordonnées du coureur dans l'objet coureur afin de détecter une modification
 * @param data
 */
function afficher(data) {
    formulaire.style.display = 'block';
    licence.value = data.licence;
    nom.value = data.nom;
    prenom.value = data.prenom;
    sexe.value = data.sexe;
    dateNaissance.value = data.dateNaissance;
    idClub.value = data.idClub;
    ffa.checked = data.ffa === 1;
    // pour les champs optionnels la valeur null est transformée en chaine vide ''
    email.value = data.email;
    telephone.value = data.telephone;

}



