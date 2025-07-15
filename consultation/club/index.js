"use strict";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------
/* global lesClubs, repertoire */

const lesCartes = document.getElementById('lesCartes');

// -----------------------------------------------------------------------------------
// Génération dynamique du CSS spécifique aux cartes club
// -----------------------------------------------------------------------------------

function injecterStyleCarteClub() {
    const style = document.createElement('style');
    style.textContent = `
        .carte-grille {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
            padding: 1rem;
        }

        .carte-club {
            height: 100%;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .carte-club:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .carte-club .card-body {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
        }

        .carte-club img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            aspect-ratio: 1 / 1;
        }
    `;
    document.head.appendChild(style);
}

// Injecter les styles au démarrage
injecterStyleCarteClub();

// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------

/**
 * Crée une carte pour afficher les informations d'un club
 * @param {Object} element - Données du club
 * @returns {HTMLDivElement}
 */
function creerCarte(element) {
    // Création de la carte avec classe spécifique
    const carte = document.createElement('div');
    carte.classList.add('card', 'carte-club', 'shadow-sm');

    // En-tête
    const entete = document.createElement('div');
    entete.classList.add('card-header', 'text-center');
    entete.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color-header').trim();
    entete.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color-header').trim();
    entete.innerText = element.nom;

    // Corps
    const corps = document.createElement('div');
    corps.classList.add('card-body');

    if (element.present) {
        const img = document.createElement('img');
        img.src = repertoire + element.fichier;
        img.alt = `${element.nom} logo`;
        img.classList.add('img-fluid');
        corps.appendChild(img);
    }

    // Pied
    const pied = document.createElement('div');
    pied.classList.add('card-footer', 'text-muted', 'text-center');
    pied.innerText = `${element.nb} licenciés`;

    // Assembler
    carte.appendChild(entete);
    carte.appendChild(corps);
    carte.appendChild(pied);

    return carte;
}

// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

// Création du conteneur grille
const grille = document.createElement('div');
grille.classList.add('carte-grille');

// Création des cartes
for (const element of lesClubs) {
    const carte = creerCarte(element);
    grille.appendChild(carte);
}

// Ajout dans la page
lesCartes.appendChild(grille);
