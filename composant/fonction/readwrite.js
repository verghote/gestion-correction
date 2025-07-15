"use strict";

// Version 2025.3
// Date version : 27/06/2025

// ------------------------------------------------------------
// fonctions sur les champs de saisie
// ------------------------------------------------------------

/**
 * Retourne la valeur d'un champ de saisie
 * @param {string} inputId attribut id de la balise input
 * @returns {string | boolean | number | null} valeur saisie
 */
export function read(inputId) {
    let valeur;
    const input = document.getElementById(inputId);
    if (input) {
        // s'agit-il d'une balise input ?
        if (input instanceof HTMLInputElement) {
            // Récupération type de l'input : text, checkbox, radio, number
            const type = input.type.toLowerCase();
            if (type === 'checkbox' || type === 'radio') {
                valeur = input.checked ? 1 : 0;
            } else if (type === 'number') {
                // Vérifier si la valeur est un entier ou un nombre à virgule
                const value = input.value;
                if (Number.isInteger(value)) {
                    valeur = parseInt(value);
                } else {
                    valeur = parseFloat(value);
                }
            } else {
                valeur = input.value.trim();
                // détermination du type de la valeur
                if (valeur === '') {
                    valeur = null;
                } else if (!isNaN(valeur)) {
                    if (Number.isInteger(valeur)) {
                        valeur = parseInt(valeur);
                    } else {
                        valeur = parseFloat(valeur);
                    }
                }
            }
        } else if (input instanceof HTMLTextAreaElement) {
            valeur = input.value;
        } else if (input instanceof HTMLSelectElement) {
            valeur = input.value;
            if (!isNaN(valeur)) {
                if (Number.isInteger(valeur)) {
                    valeur = parseInt(valeur);
                } else {
                    valeur = parseFloat(valeur);
                }
            }
        } else {
            valeur = input.innerText;
        }
    } else {
        console.error(`L'élément ${inputId} n'existe pas`);
    }
    return valeur;
}

/**
 * Ecrit la valeur dans la balise identifiée par id
 * @param {string} inputId attribut id de la balise input
 * @param {string| boolean| number} valeur valeur à écrire dans la balise
 * @param {string | null} format - Le format de la valeur (facultatif) '€' ou '%'.
 */
export function write(inputId, valeur, format = null) {
    const input = document.getElementById(inputId);
    if (input) {
        // s'agit-il d'une balise input ?
        if (input instanceof HTMLInputElement) {
            const type = input.type.toLowerCase();
            if (type === 'checkbox' || type === 'radio') {
                input.checked = valeur;
            } else {
                if (format) {
                    if (format === '€') {
                        input.value = valeur.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                        }).replace(',', '.');
                    } else if (format === '%') {
                        input.value = valeur.toLocaleString('fr-FR', {style: 'percent'});
                    } else {
                        input.value = valeur;
                    }
                } else {
                    input.value = valeur;
                }
            }
        } else if (input instanceof HTMLTextAreaElement) {
            input.value = valeur;
        } else if (input instanceof HTMLSelectElement) {
            input.value = valeur;
        } else if (input.tagName === 'DIV') {
            const p = document.createElement('p');
            p.innerHTML = valeur;
            input.appendChild(p);
        } else if (input.tagName === 'SPAN') {
            input.innerHTML = valeur;
        } else if (input.tagName === 'IMG') {
            input.src = valeur;
        } else {
            input.innerText = valeur;
        }
    } else {
        console.error(`L'élément ${inputId} n'existe pas`);
    }
}


/**
 * Efface le contenu de la balise dont l'id est passé en paramètre
 * @param {string} inputId attribut id de la balise input
 */
export function effacer(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        // s'agit-il d'une balise input ?
        if (input instanceof HTMLInputElement) {
            const type = input.type.toLowerCase();
            if (type === 'checkbox') {
                input.checked = false;
            } else if (type === 'number' || type === 'text') {
                input.value = '';
            }
        } else if (input instanceof HTMLSelectElement) {
            while (input.options.length > 0) {
                input.remove(0);
            }

        } else if (input.tagName === 'IMG') {
            input.src = '';
        } else {
            input.innerHTML = '';
        }
    } else {
        console.error(`L'élément ${inputId} n'existe pas`);
    }
}