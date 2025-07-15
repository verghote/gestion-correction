"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from "/composant/fonction/ajax.js";
import {afficherSousLeChamp, retournerVers} from "/composant/fonction/afficher.js";
import {filtrerLaSaisie, configurerFormulaire, donneesValides } from "/composant/fonction/controle.js";
import {ucFirst} from '/composant/fonction/format.js';
import {comparerSansAccentEtSansCasse} from "../../composant/fonction/util";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

/* global lesCategories */

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

// demande d'ajout d'une catégorie
btnAjouter.onclick = () => {
    msg.innerHTML = '';
    id.value = id.value.trim().toUpperCase();
    nom.value = ucFirst(nom.value.trim());
    if ( donneesValides()) {
        let valide = true;
        // const min = parseInt(ageMin.value);
        // const max = parseInt(ageMax.value);
        const min = ageMin.valueAsNumber;
        const max = ageMax.valueAsNumber;
        // véficication de l'unicité de l'identifiant
        if (!idUnique(id.value)) {
            afficherSousLeChamp('id', "L'identifiant de la catégorie doit être unique");
            valide = false;
        }
        // vérification de l'unicité du nom
        if (!nomUnique(nom.value)) {
            afficherSousLeChamp('nom', "Le nom de la catégorie doit être unique");
            valide = false;
        }
        // vérification de l'intervale d'âge
        if (min >= max) {
            afficherSousLeChamp('ageMin', "L'âge minimum doit être inférieur à l'âge maximum");
            valide = false;
        } else {
            // vérification de la plage d'âge
            if (!plageValide(min, max)) {
                afficherSousLeChamp('ageMin', "La plage d'âge doit être cohérente avec les autres catégories");
                valide = false;
            }
        }
        if (valide) {
            ajouter();
        }
    }
};

// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------

/**
 * Contrôle si l'identifiant de la catégorie est unique
 * Les identifiants sont forcément en majuscule la comparaison avec === est donc suffisante
 * @param {string} id
 * @returns {boolean}
 */
function idUnique(id) {
    return lesCategories.findIndex(x => x.id === id) >= 0;
}

/**
 * Contrôle si le nom de la catégorie est unique
 * Par sécurité, nous utilisons une comparaison insensible aux accents et à la casse
 * @param {string} nom
 * @returns {boolean}
 */
function nomUnique(nom) {
    // return lesCategories.findIndex(x => x.nom === nom) === -1;
    // return lesCategories.findIndex(x => x.nom.toLowerCase() === nom.toLowerCase()) === -1;
    return lesCategories.findIndex(x => comparerSansAccentEtSansCasse(x.nom, nom)) === -1;
}

/**
 * Vérifie si la plage d'âge est valide et ne chevauche pas les autres catégories
 * Il n'y a pas chevauchement si max est avant ageMin ou min est après ageMax (il suffit d'inverser la condition pour trouver un chevauchement)
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
function plageValide(min, max) {
    return !lesCategories.find(x => max >= x.ageMin && min <= x.ageMax);
}

function ajouter() {
    appelAjax({
        url: '/ajax/ajouter.php',
        data: {
            table : 'categorie',
            id: id.value,
            nom: nom.value,
            ageMin : ageMin.valueAsNumber,
            ageMax : ageMax.valueAsNumber
        },
        success: () => {
                retournerVers("Catégorie enregistrée", "/consultation/categorie");
        }
    });
}

// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------
configurerFormulaire();
filtrerLaSaisie('nom', /[A-Za-z0-9 ]/);
filtrerLaSaisie('id', /[A-Za-z0-9]/);
// un champ de type number accepte le 'e'
filtrerLaSaisie('ageMin', /[0-9]/);
filtrerLaSaisie('ageMax', /[0-9]/);

