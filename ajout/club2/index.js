"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from "/composant/fonction/ajax.js";
import {configurerFormulaire, filtrerLaSaisie, donneesValides, fichierValide, verifierDimensionsImage, effacerLesErreurs} from "/composant/fonction/controle.js";
import {afficherSousLeChamp, retournerVersApresConfirmation} from "/composant/fonction/afficher.js";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

/* global lesParametres */

// récupération des éléments de l'interface
let id = document.getElementById('id');
let nom = document.getElementById('nom');

const fichier = document.getElementById('fichier');
const nomFichier = document.getElementById('nomFichier');
const cible = document.getElementById('cible');

let btnAjouter = document.getElementById('btnAjouter');

// fichier téléversé
let leFichier = null;


// -----------------------------------------------------------------------------------
// Procédures évènementielles
// -----------------------------------------------------------------------------------
// demande d'ajout d'un club
btnAjouter.onclick = () => {
    if (donneesValides()) {
        ajouter();
    }
};


// Déclencher le clic sur le champ de type file lors d'un clic dans la zone cible
cible.onclick = () => fichier.click();

// // ajout du glisser déposer dans la zone cible
cible.ondragover = (e) => e.preventDefault();
cible.ondrop = (e) => {
    e.preventDefault();
    controlerFichier(e.dataTransfer.files[0]);
};

// Lancer la fonction controlerFichier si un fichier a été sélectionné dans l'explorateur
fichier.onchange = () => {
    if (fichier.files.length > 0) {
        controlerFichier(fichier.files[0]);
    }
};

// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------

function ajouter() {
    const formData= new FormData();
    formData.append('table', 'club');
    formData.append('id', id.value);
    formData.append('nom', nom.value);
    // la photo n'est pas obligatoire
    if (leFichier !== null) {
        formData.append('fichier', leFichier);
    }
    appelAjax({
        url: '/ajax/ajouter.php',
        data: formData,
        success: () => {
            retournerVersApresConfirmation("Le club a été ajouté", '/consultation/club');
        }
    });
}

/**
 * Contrôle le fichier sélectionné au niveau de son extension et de sa taille
 * Contrôle les dimensions de l'image
 * Affiche le nom du fichier ou un message d'erreur
 * @param file {object} fichier à ajouter
 */

function controlerFichier(file) {
    // Vérification de taille et d'extension
    if (!fichierValide(file, lesParametres)) {
        return;
    }
    verifierDimensionsImage(file, lesParametres, {
        onSuccess: (file, img) => {
            nomFichier.innerText = file.name;
            leFichier = file;
            cible.appendChild(img);
        },
        onErreur: (msg) => afficherSousLeChamp('fichier', msg)
    });
}

// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

configurerFormulaire();
filtrerLaSaisie('nom', /[A-Za-zÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ '-.]/);

// activation infobulle de type popover
let option = {
    trigger: "hover",
    placement: "right",
    html: true,
    content: `Cliquer ou faire glisser la nouvelle photo ici<br>
              Formats acceptés : png, jpg, webp, avif. <br>Dimension maximale acceptée : 500 * 500</p>`
};
new bootstrap.Popover(cible, option);

document.querySelectorAll('[data-bs-toggle="popover"]').forEach(element => new bootstrap.Popover(element));
