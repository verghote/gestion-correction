"use strict";
/* global Sortable */

// Créez un nouvel objet Sortable sur le conteneur de la row
new Sortable(document.getElementById('draggable-container'), {
    animation: 150, // Durée de l'animation en ms lors du glisser/déposer
    handle: '.card-header', // Permet de déplacer chaque carte en utilisant l'en-tête
    draggable: '.col-md-6', // Permet de faire glisser les colonnes
    swapThreshold: 0.65, // Sensibilité du déplacement de l'élément
});