"use strict";

/* global data */

// Fonction pour créer une carte
function creerCarte(element) {
    // Créer la carte
    const carte = document.createElement('div');
    carte.classList.add('card', 'mb-1');

    // Créer l'entête
    const entete = document.createElement('div');
    entete.classList.add('card-header', 'text-white', 'text-center');
    // récupération de la couleur de fond définie dans le fichier CSS
    entete.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color-table').trim();
    entete.style.minHeight = '75px';
    entete.innerText = element.nom;

    // Créer le corps avec le logo
    const corps = document.createElement('div');
    corps.classList.add('card-body', 'text-center', 'logo-club');

    if (element.present) {
        const img = document.createElement('img');
        img.src = `../../data/club/${element.fichier}`;
        img.alt = `${element.nom} logo`;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        corps.appendChild(img);
    }

    // Créer le pied
    const pied = document.createElement('div');
    pied.classList.add('card-footer', 'text-muted', 'text-center');
    pied.innerText = `${element.nb} licenciés`;

    // Assembler la carte
    carte.appendChild(entete);
    carte.appendChild(corps);
    carte.appendChild(pied);

    return carte;
}

// Générer les cartes dans une ligne responsive
function afficherCartes(data) {
    const row = document.createElement('div');
    row.classList.add('row', 'g-3'); // Ajout d'un espacement entre les colonnes

    for (const element of data) {
        const col = document.createElement('div');
        col.classList.add('col-xl-3', 'col-lg-4', 'col-sm-6');
        col.appendChild(creerCarte(element));
        row.appendChild(col);
    }

    // Insérer la ligne dans l'interface
    const conteneur = document.getElementById('lesCartes');
    conteneur.innerHTML = ""; // Nettoyer avant d'ajouter
    conteneur.appendChild(row);
}


// Affichage des cartes
afficherCartes(data);
