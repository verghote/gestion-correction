SET default_storage_engine = InnoDb;

Set foreign_key_checks = 0;

drop database if exists gestion;

-- jeu de caractères utf8mb4 sur 4 octets intégrant les émoticones
-- collation insensible à la casse et aux accents
create database gestion character set utf8 collate utf8_general_ci;


use gestion;

CREATE TABLE categorie
(
    id     char(3) primary key,
    nom    varchar(20) NOT NULL unique,
    ageMin tinyint     NOT NULL,
    ageMax tinyint     NOT NULL,
    check (ageMin < ageMax)
);

CREATE TABLE club
(
    id  char(6) primary key,
    nom varchar(70) NOT NULL unique,
    fichier varchar(100) null
);

CREATE TABLE coureur
(
    licence       char(7)      NOT NULL primary key,
    nom           varchar(30)  NOT NULL,
    prenom        varchar(30)  NOT NULL,
    sexe          char(1)      NOT NULL DEFAULT 'M',
    dateNaissance date         NOT NULL,
    idCategorie   char(3)      NOT NULL,
    idClub        varchar(6)   NOT NULL,
    ffa           BOOLEAN      NOT NULL DEFAULT FALSE,
    email         varchar(100) null unique,
    telephone     char(10)     null,
    unique (nom, prenom, dateNaissance),
    foreign KEY (idCategorie) references categorie (id) on update cascade,
    foreign KEY (idClub) references club (id)
);

CREATE TABLE IF NOT EXISTS annonce
(
    id          smallint UNSIGNED NOT NULL AUTO_INCREMENT,
    nom         varchar(100)      NOT NULL,
    description text              NOT NULL,
    date        date              NOT NULL,
    actif       tinyint           NOT NULL DEFAULT '0',
    PRIMARY KEY (id)
);


Set foreign_key_checks = 1;
