"use strict";

// Version 2025.3
// Date version : 09/07/2025
// Correction de l'affichage des messages d'erreur sous les champs input
// Suppression du paramètre 'onInput' de la fonction configurerFormulaire
// ajout fonction configurerDate pour renseigner les propriétés min, max et value d'un champ input de type date

import {afficherSousLeChamp} from '/composant/fonction/afficher.js';

/**
 * Création d'un style 'messageErreur' et Ajout après chaque balise input d'une balise div utilisant ce style
 * Prise en compte de conteneur .champ afin d'ajouter le message d'erreur après le conteneur
 * Cette balise div sera utilisée pour afficher le message d'erreur
 */
export function configurerFormulaire() {
    // Ajout du style une seule fois
    if (!document.getElementById('style-message-erreur')) {
        const style = document.createElement('style');
        style.id = 'style-message-erreur';
        style.textContent = `
            .messageErreur {
                font-size: 0.8rem;
                color: #c00;
                font-style: italic;
                margin : 0;
            }

            @media (max-width: 600px) {
                .messageErreur {
                    margin-left: 0 !important;
                    padding-left: 0 !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Parcours de tous les champs de formulaire
    const elements = document.querySelectorAll('input, select, textarea');

    for (const element of elements) {
        const parent = element.parentElement;
        let conteneurChamp = null;

        // Vérifie si l'élément est contenu dans une div.champ
        if (parent && parent.classList.contains('champ')) {
            conteneurChamp = parent;
        }

        // Détermine si un message d'erreur existe déjà (pour éviter les doublons)
        let messageDejaPresent = false;

        if (conteneurChamp !== null) {
            const elementSuivant = conteneurChamp.nextElementSibling;
            if (elementSuivant && elementSuivant.classList.contains('messageErreur')) {
                messageDejaPresent = true;
            }
        } else {
            const elementSuivant = element.nextElementSibling;
            if (elementSuivant && elementSuivant.classList.contains('messageErreur')) {
                messageDejaPresent = true;
            }
        }

        if (messageDejaPresent) {
            continue;
        }

        // Création du conteneur du message
        const divMessage = document.createElement('div');
        divMessage.classList.add('messageErreur');

        // Insertion du message après le champ ou après le conteneur .champ
        if (conteneurChamp !== null) {
            conteneurChamp.insertAdjacentElement('afterend', divMessage);
        } else {
            element.insertAdjacentElement('afterend', divMessage);
        }
    }
}

/**
 * Configure un champ de date HTML avec des bornes et un label explicatif.
 *
 * @param {HTMLInputElement} inputDate - Élément <input type="date"> à configurer (obligatoire)
 * @param {Object} [options] - Options de configuration
 * @param {string} [options.min] - Date minimale (format YYYY-MM-DD)
 * @param {string} [options.max] - Date maximale (format YYYY-MM-DD)
 * @param {string|null} [options.valeur] - Valeur initiale à définir (sinon min ou vide)
 */
export function configurerDate(inputDate, {min = null, max = null, valeur = null} = {}) {
    if (!inputDate || !(inputDate instanceof HTMLInputElement)) {
        console.error("Le paramètre fourni n'est pas un élément <input type='date'> valide.");
        return;
    }

    // Cas limite : ni min ni max → on ne fait rien
    if (!min && !max) {
        console.warn(`Aucune contrainte min/max spécifiée pour ${inputDate.id} — configuration ignorée.`);
        return;
    }

    if (min) {
        inputDate.min = min;
    }
    if (max) {
        inputDate.max = max;
    }
    inputDate.value = valeur || '';

    const formatFr = {day: '2-digit', month: '2-digit', year: 'numeric'};
    const minFr = min ? new Date(min).toLocaleDateString('fr-FR', formatFr) : null;
    const maxFr = max ? new Date(max).toLocaleDateString('fr-FR', formatFr) : null;

    let commentaire = '';
    if (min && max) {
        commentaire = `La date doit être comprise entre le ${minFr} et le ${maxFr}`;
    } else if (min) {
        commentaire = `La date ne peut être antérieure au ${minFr}`;
    } else if (max) {
        commentaire = `La date ne peut excéder le ${maxFr}`;
    }

    const label = document.querySelector(`label[for="${inputDate.id}"]`);
    if (label && commentaire) {
        // Supprimer un éventuel ancien commentaire pour éviter les doublons
        const ancienCommentaire = label.querySelector('.commentaire');
        if (ancienCommentaire) {
            ancienCommentaire.remove();
        }

        // Créer et injecter un nouveau commentaire
        const span = document.createElement('span');
        span.className = 'commentaire';
        span.textContent = ` (${commentaire})`;
        label.appendChild(span);
    }
}


/**
 * Filtre les caractères autorisés lors de la saisie
 * @param {string} idInput attribut id de la balise input
 * @param {RegExp} regExp expression régulière contenant les caractères autorisés
 */
export function filtrerLaSaisie(idInput, regExp) {
    const input = document.getElementById(idInput);
    if (input) {
        input.addEventListener('keydown', (e) => {
            // Autoriser le passage des touches spéciales
            if (e.key.length > 1) {
                return;
            }
            // Vérifier si la touche est un chiffre
            if (!regExp.test(e.key)) {
                e.preventDefault(); // Empêcher la saisie de caractères non contenus dans l'expression régulière
            }
        });
    } else {
        console.error(`L'élément d'entrée ${idInput} n'existe pas.`);
    }
}

/**
 * Contrôle la valeur saisie
 * En cas d'erreur un message d'erreur sous la balise input correspondante est affiché
 * La classe 'erreur' est ajouté au niveau de la balise ce qui ajoute une image à la fin du champ
 * à condition d'avoir défini le style 'input.erreur' dans la feuille de style
 * @param {string} idInput attribut id de la balise input
 * @return {boolean} true si la valeur saisie est valide
 */
export function controler(idInput) {
    const input = document.getElementById(idInput);
    if (input) {
        afficherSousLeChamp(idInput);
        if (input.checkValidity()) {
            input.classList.remove('erreur');
            return true;
        } else {
            input.classList.add('erreur');
            return false;
        }
    } else {
        console.error(`L'élément d'entrée ${idInput} n'existe pas.`);
    }
}

/**
 * Contrôle la valeur saisie
 * En cas d'erreur la couleur de la bordure change de couleur (rouge)
 * @param {object} input balise input
 * @returns {boolean} true si la valeur saisie est valide
 */
export function verifier(input) {
    input.title = input.validationMessage;
    if (input.checkValidity()) {
        input.style.borderColor = '';
        return true;
    } else {
        input.style.borderColor = 'red';
        return false;
    }
}

import {conversionOctet} from './format.js';

/**
 * Valide un fichier en vérifiant sa taille et son extension, et affiche éventuellement un message d'erreur.
 *
 * @param {File} file - Le fichier à valider.
 * @param {Object} options - Options de validation.
 * @param {number} [options.maxSize] - Taille maximale autorisée en octets.
 * @param {string[]} [options.extensions] - Extensions autorisées (ex: ['pdf', 'docx']).
 * @returns {boolean} - true si le fichier est valide, false sinon.
 */
export function fichierValide(file, options = {}) {
    // extraction depuis l'objet options de trois propriétés
    const {maxSize, extensions} = options;
    let message = '';

    if (!file) {
        message = 'Aucun fichier transmis';
    } else if (maxSize && file.size > maxSize) {
        const size = conversionOctet(file.size, 'Ko');
        const taille = conversionOctet(maxSize, 'Ko');
        message = `La taille du fichier (${size}) dépasse la taille autorisée (${taille})`;
    } else if (extensions) {
        const extension = file.name.split('.').pop().toLowerCase();
        if (!extensions.includes(extension)) {
            message = `Extension ${extension} non acceptée`;
        }
    }
    // affiche le message sous le champ 'fichier' ou dans une fenêtre modale s'il n'existe pas
    if (message !== '') {
        afficherSousLeChamp('fichier', message);
    }
    return message === '';
}

/**
 * Vérifie les dimensions d’une image si un contrôle est requis.
 * @param {File} file - Le fichier image à tester.
 * @param {Object} dimensions - Paramètres de taille max .
 * @param {number} dimensions.width - Largeur max en pixels.
 * @param {number} dimensions.height - Hauteur max en pixels.
 * @param {Function} onSuccess - Callback si les dimensions sont valides.
 * @param {Function} onErreur - Callback si les dimensions sont incorrectes ou si ce n’est pas une image.
 */
export function verifierDimensionsImage(file, dimensions, { onSuccess, onErreur } = {}) {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
        let message = null; // Variable pour stocker le message d'erreur si nécessaire

        // Cas 1 : Les deux dimensions (largeur et hauteur) sont renseignées
        if (dimensions.width !== 0 && dimensions.height !== 0) {
            if (img.width > dimensions.width || img.height > dimensions.height) {
                message = `Les dimensions de l'image (${img.width}×${img.height}) dépassent la limite autorisée (${dimensions.width}×${dimensions.height})`;
            }
        }
        // Cas 2 : Seule la largeur est renseignée
        else if (dimensions.width !== 0) {
            if (img.width > dimensions.width) {
                message = `La largeur de l'image (${img.width}) dépasse la limite autorisée (${dimensions.width})`;
            }
        }
        // Cas 3 : Seule la hauteur est renseignée
        else if (dimensions.height !== 0) {
            if (img.height > dimensions.height) {
                message = `La hauteur de l'image (${img.height}) dépasse la limite autorisée (${dimensions.height})`;
            }
        }
        // Cas 4 : Aucune dimension n'est renseignée (pas de vérification nécessaire)
        // Dans ce cas, 'message' restera null

        // Traitement final basé sur le résultat de la vérification
        if (message) {
            onErreur?.(message);
        } else {
            onSuccess?.(file, img);
        }

        // Nettoyage de l'URL temporaire
        URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
        onErreur?.("Le fichier n'est pas une image valide.");
        URL.revokeObjectURL(img.src); // Nettoyer aussi en cas d'erreur de chargement
    };
}

/**
 * Contrôle tous les champs input et textarea et select
 * chaque champ xxx doit être suivi d'une balise <div class='messageErreur'></div> pour afficher le message d'erreur : méthode configurerFormulaire
 * @param {Node} [zone=document] - La zone dans laquelle les champs doivent être contrôlés.
 * @returns {boolean} true si tous les champs respectent les contraintes définies dans leurs attributs pattern, minlength, maxlength, required, min, max ...
 */
export function donneesValides(zone = document) {
    let valide = true;

    // Sélectionner tous les éléments input et select qui sont required et non désactivés
    const lesInputs = zone.querySelectorAll('input[required]:not([disabled]), select[required]:not([disabled])');

    // Parcourir et traiter les éléments sélectionnés
    lesInputs.forEach(x => {
        afficherSousLeChamp(x.id);
        if (!x.checkValidity()) {
            valide = false;
        }
    });

    // Vérifier séparément les champs non-required qui ont une valeur
    const champsNonRequired = zone.querySelectorAll('input:not([required]):not([disabled]), select:not([required]):not([disabled])');
    champsNonRequired.forEach(x => {
        if (x.value !== '') {
            afficherSousLeChamp(x.id);
            if (!x.checkValidity()) {
                valide = false;
            }
        }
    });
    return valide;
}

/**
 * Controle la validité de la date saisie (format jj/mm/aaaa) dans la balise input dont l'id est trasnmis en paramètre
 * @param {string} idInput attribut id de la balise input
 * @returns {boolean} true si la date est valide
 */
export function dateValide(idInput) {
    const input = document.getElementById(idInput);

    if (input) {
        // Vérifier le format jj/mm/aaaa avec une expression régulière
        const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (!dateRegex.test(input.value)) {
            afficherSousLeChamp(idInput, 'Cette date ne respecte pas le format attendu (jj/mm/aaaa)');
            return false; // Le format n'est pas correct
        }

        // Récupération des éléments de la date
        const [jour, mois, annee] = input.value.split('/').map(Number);

        // création d'un objet Date avec les éléments de la date
        const date = new Date(annee, mois - 1, jour);

        // La date est valide si l'année, le mois et le jour sont identiques à ceux de l'objet Date
        if (date.getFullYear() === annee && date.getMonth() === mois - 1 && date.getDate() === jour) {
            return true;
        } else {
            afficherSousLeChamp(idInput, 'Cette date n\'est pas valide');
            return false;
        }
    } else {
        console.error(`L'élément d'entrée ${idInput} n'existe pas.`);
    }
}

/**
 * Vide les champs de formulaire (input et textarea) dans une zone spécifiée.
 *
 * @param {Node} [zone=document] - La zone dans laquelle les champs doivent être vidés.
 * Par défaut, il s'agit du document entier.
 */
export function effacerLesChamps(zone = document) {
    for (const input of zone.querySelectorAll('input, textarea')) {
        input.value = '';
    }
}

/**
 * Efface les messages d'erreur sous chaque champ de saisie et dans la zone d'afficher.js des messages 'msg'
 */
export function effacerLesErreurs() {
    for (const div of document.getElementsByClassName('messageErreur')) {
        div.innerText = '';
    }
    const msg = document.getElementById('msg');
    if (msg) {
        msg.innerHTML = "";
    }
}


