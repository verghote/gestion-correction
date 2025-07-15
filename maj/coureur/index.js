"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax, modifierColonne, supprimerEnregistrement} from "/composant/fonction/ajax.js";
import { confirmer, afficherSousLeChamp, afficherToast} from '/composant/fonction/afficher.js';
import {configurerFormulaire, configurerDate, effacerLesErreurs, filtrerLaSaisie} from "/composant/fonction/controle.js";
import {enleverAccent} from "/composant/fonction/format.js";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------
/* global dateMin, dateMax, lesClubs, lesCoureurs */

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

// -----------------------------------------------------------------------------------
// Procédures évènementielles
// -----------------------------------------------------------------------------------

nomR.onfocus = () => {
    nomR.value = '';
    formulaire.style.display = 'none';
};

nom.onchange = function ()  {
    this.value = enleverAccent(this.value).toUpperCase();
    // on affiche le message d'information sous le champ vide si les règles de validation sont respectées
    afficherSousLeChamp(this.id);
    if (this.checkValidity()) {
        // fonction de rappel en cas de succès
        const success = () => {
            const nomPrenom = this.value + ' ' + prenom.value;
            // on réalise la modification dans le tableau lesCoureurs
            const index = lesCoureurs.findIndex(c => c.licence === licence.value);
            if (index !== -1) {
                lesCoureurs[index].nomPrenom = nomPrenom;
            }

        };
        modifierColonne('coureur', this.id, this.value, licence.value, success);
    }
};

prenom.onchange = function () {
    this.value = enleverAccent(this.value).toUpperCase();
    afficherSousLeChamp(this.id);
    if (this.checkValidity()) {
        // fonction de rappel en cas de succès
        const success = () => {
            const nomPrenom = nom.value + ' ' + this.value;
            // on réalise la modification dans le tableau lesCoureurs
            const index = lesCoureurs.findIndex(c => c.licence === licence.value);
            if (index !== -1) {
                lesCoureurs[index].nomPrenom = nomPrenom;
            }

        };
        modifierColonne('coureur', this.id, this.value, licence.value, success);
    }
};

sexe.onchange = function () {
    modifierColonne('coureur', this.id, this.value, licence.value);
};

dateNaissance.onchange = function () {
    afficherSousLeChamp(this.id);
    if (this.checkValidity()) {
        modifierColonne('coureur', 'dateNaissance', dateNaissance.value, licence.value);
    }
};

idClub.onchange = function () {
    modifierColonne('coureur', this.id, this.value, licence.value);
};

ffa.onchange = () => {
    const valeur = ffa.checked ? 1 : 0;
    modifierColonne('coureur', 'ffa', valeur, licence.value);
};

email.onchange = function() {
    if (this.value !== '') {
        afficherSousLeChamp(this.id);
        if (this.checkValidity()) {
            modifierColonne('coureur', 'email', email.value, licence.value);
        }
    } else {
        effacerColonne(this.id);
    }
};

telephone.onchange = function() {
    if (this.value !== '') {
        afficherSousLeChamp(this.id);
        if (this.checkValidity()) {
            modifierColonne('coureur', this.id, this.value, licence.value);
        }
    } else {
        effacerColonne(this.id);
    }
};

// le bouton 'btnSupprimer'
btnSupprimer.onclick = () => confirmer(supprimer);


// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------


function effacerColonne(colonne) {
    appelAjax({
        url: 'ajax/clearcolonne.php',
        data: {
            colonne: colonne,
            licence: licence.value
        },
        success:() => {
                afficherToast("Modification enregistrée");
        }
    });
}


/**
 * Demande de suppression du coureur actuellement affiché
 */
function supprimer() {
    const success = () => {
        // on supprime le coureur du tableau lesCoureurs
        const index = lesCoureurs.findIndex(c => c.licence === licence.value);
        if (index !== -1) {
            lesCoureurs.splice(index, 1);
        }
        // on masque le formulaire de modification
        formulaire.style.display = 'none';

    };
    supprimerEnregistrement('coureur', licence.value, success);
}

// Récupération des coordonnées du coureur
function rechercher(licence) {
    formulaire.style.display = 'none';
    effacerLesErreurs();
    nomR.blur();
    appelAjax({
        url: 'ajax/getbylicence.php',
        data: {
            licence: licence
        },
        success: data => {
                nomR.value = '';
                afficher(data);
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


// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

// intervalle sur la date de naissance
// La date doit être comprise entre dateMin et dateMax
configurerDate(dateNaissance, {
    min: dateMin,
    max: dateMax,
    valeur: dateMax
});

// alimentation de la zone de liste des clubs
for (const club of lesClubs) {
    idClub.add(new Option(club.nom, club.id));
}

// paramétrage du composant autoComplete
const options = {
    data: {
        src: lesCoureurs,
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
                nom.value = selection.nomPrenom;
                rechercher(selection.licence);
            },
        }
    },
};
new autoComplete(options);

// contrôle des données saisies toujours après le système d'autocomplétion qui vient ajouter ses propres balises
configurerFormulaire();
filtrerLaSaisie('telephone', /[0-9]/);
filtrerLaSaisie('nom', /[A-Za-z ]/);
filtrerLaSaisie('nomR', /[A-Za-z ]/);
filtrerLaSaisie('prenom', /[A-Za-z ]/);