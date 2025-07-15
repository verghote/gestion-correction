"use strict";

// Version 2025.3
// Date version : 06/07/2025

/**
 * retourne la date courante dans le format aaaa-mm-jj
 * @returns {string}
 */
export function getDateCourante() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}


/**
 * Vérifie si une chaîne est au format jj/mm/aaaa
 * @param str
 * @returns {boolean}
 */
export function isDateFR(str) {
    return /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str);
}

/**
 * Conversion d'une chaine de format jj/mm/aaaa au format aaaa-mm-jj
 * @param {string} date au format jj/mm/aaaa
 * @return {string} Chaîne au aaaa-mm-jj
 */
export function encoderDate(date) {
    // la solution ci-dessous pose un problème si le format d'entrée est j/m/aaaa
    // return date.substring(6) + '-' + date.substring(3, 6) + '-' + date.substring(0, 2);
    // il faut plutôt découper la chaine et inverser les parties 1 et 3 en ajoutant éventuellement un 0 sur j et m
    // pour éviter l'usage d'une structure conditionnelle, on ajoute toujours un 0 au début
    // et on ne conserve que les deux derniers caractères en appelant la méthode slice(-2)
    const lesElements = date.split('/');
    return lesElements[2] + '-' + '0'.concat(lesElements[1]).slice(-2) + '0'.concat(lesElements[0]).slice(-2);
}

/**
 * Conversion d'une chaine de format aaaa-mm-jj  au format jj/mm/aaaa
 * @param {string} date au format aaaa-mm-jj
 * @return {string} Chaîne au jj/mm/aaaa
 */
export function decoderDate(date) {
    // return date.substring(8) + '/' + date.substring(5, 7) + '/' + date.substring(0, 4);
    return date.split('-').reverse().join('/');
}

/**
 * retourne la date passée en paramètre dans le format jj/mm/aaaa
 * équivalent à decoderDate conservé pour la compatibilité
 * @param dateIso date au format ISO (aaaa-mm-jj)
 * @returns {string}
 */
export function convertirDateIsoEnDateFr(dateIso) {
    return dateIso.split('-').reverse().join('/');
}

/**
 * Convertit une date au format jj/mm/aaaa en une date au format aaaa-mm-jj
 * équivalent à encoderDate conservé pour la compatibilité
 * @param dateFr
 * @returns {string}
 */
export function convertirDateFrEnDateIso(dateFr) {
    return dateFr.split('/').reverse().join('-');
}

/**
 * Convertit une date et une heure au format ISO en une date et une heure au format français
 * @param dateHeureIso
 * @returns {string}
 */
export function convertirDateHeureIsoEnDateHeureFr(dateHeureIso) {
    // Séparer la date et l'heure
    const [datePart, timePart] = dateHeureIso.split('T');

    // Formater la date
    const [year, month, day] = datePart.split('-');
    const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;

    // Formater l'heure
    const [hours, minutes, seconds] = timePart.split(':');
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

    // Retourner la date et l'heure formatées
    return `${formattedDate} à ${formattedTime}`;
}

/**
 * Calcule une date relative à aujourd'hui selon une unité et un décalage donné.
 *
 * @param {'jour'|'mois'|'annee'|'semaine'} unite - L'unité de temps (en français)
 * @param {number} delta - Le nombre d'unités à ajouter (positif) ou retirer (négatif)
 * @returns {string} La date résultante au format 'YYYY-MM-DD'
 */
export function getDateRelative(unite, delta) {
    const date = new Date(); // aujourd'hui

    switch (unite) {
        case 'jour':
            date.setDate(date.getDate() + delta);
            break;
        case 'semaine':
            date.setDate(date.getDate() + delta * 7);
            break;
        case 'mois':
            date.setMonth(date.getMonth() + delta);
            break;
        case 'annee':
            date.setFullYear(date.getFullYear() + delta);
            break;
        default:
            throw new Error(`Unité "${unite}" non reconnue (utilise : jour, semaine, mois, annee)`);
    }

    return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

/**
 * Retourne l'âge en tableau.js de la date de naissance passée en paramètre
 * @param {string} dateNaissance au format jj/mm/aaaa
 * @returns {number}
 */
export function getAge(dateNaissance) {
    // Séparer la date en jour, mois et année
    const dateParts = dateNaissance.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Les mois dans JavaScript commencent à 0 (janvier est 0)
    const year = parseInt(dateParts[2], 10);

    const birthDate = new Date(year, month, day);
    const currentDate = new Date();

    // Comparer les mois et jours
    const hasBirthdayOccurred = (
        currentDate.getMonth() > birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate())
    );

    // Calculer l'âge en tableau.js de la comparaison
    return currentDate.getFullYear() - birthDate.getFullYear() - (hasBirthdayOccurred ? 0 : 1);
}

/**
 * déterminer l'année de référence pour une saison spécifique (l'année scolaire ou universitaire qui commence en septembre par exemple).
 * @param {number} mois
 * @returns {number|number}
 */
export function getSaisonCourante(mois = 9) {
    // Obtenir le mois actuel (en chiffres, par exemple 3 pour mars)
    let moisCourant = new Date().getMonth() + 1;

    // Obtenir l'année actuelle (en chiffres, par exemple 2023)
    let annee = new Date().getFullYear();

    // Utiliser l'opérateur ternaire pour vérifier si nous sommes dans la deuxième moitié de l'année
    // Si c'est le cas, alors l'année de référence sera l'année actuelle + 1, sinon elle sera l'année actuelle
    annee = (moisCourant >= mois) ? annee + 1 : annee;

    // Retourner l'année de référence
    return annee;
}

/**
 * déterminer l'année de référence pour une saison spécifique (l'année scolaire ou universitaire qui commence en septembre par exemple).
 * @returns {number|number}
 * @param {Date} date
 * @param {int} mois
 */
export function getSaison(date, mois = 9) {
    // Obtenir le mois
    let moisCourant = date.getMonth() + 1;

    // Utiliser l'opérateur ternaire pour vérifier si nous sommes dans la deuxième moitié de l'année
    // Si c'est le cas, alors l'année de référence sera l'année + 1, sinon elle sera l'année
    return (moisCourant >= mois) ? date.getFullYear() + 1 : date.getFullYear();
}