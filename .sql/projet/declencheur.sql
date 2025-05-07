USE gestion;
SET NAMES utf8mb4 COLLATE utf8mb4_0900_ai_ci;

drop trigger if exists avantAjoutProjet;
drop trigger if exists avantMajProjet;
drop trigger if exists avantAjoutCompetenceProjet;
drop trigger if exists avantMajCompetenceProjet;

create trigger avantAjoutProjet
    before insert
    on Projet
    for each row
begin

    # mise en forme et vérification du nom
    set new.nom = TRIM(REGEXP_REPLACE(new.nom, '\\s+', ' '));

    if length(new.nom) not between 10 and 150 then
        signal sqlstate '45000' set message_text = "#Le nom du projet doit comporter entre 10 et 150 caractères";
    end if;

    if exists(select 1 from projet where nom = new.nom) then
        signal sqlstate '45000' set message_text = "#Ce projet existe déjà";
    end if;
end;

create trigger avantAjoutCompetenceProjet
    before insert
    on competenceprojet
    for each row
begin

    -- contrôle sur idCompetence
    if new.idCompetence NOT REGEXP '^[0-9]{1,2}$' THEN
        SET @message = CONCAT('#Le format de la compétence avec l''ID ', new.idCompetence, ' est invalide.');
        signal SQLSTATE '45000' set message_text = @message;
    end if;

    -- Seules les compétences du bloc 1 sont à indiquer dans un projet
    if not exists(select 1 from competence where id = new.idCompetence and idBloc = 1) then
        SET @message = CONCAT('#La compétence ', new.idCompetence, ' n''existe pas ou ne fait pas partie des compétences du bloc 1.');
        signal SQLSTATE '45000' set message_text = @message;
    end if;

    -- controle sur idProjet
    if not exists(select 1 from projet where id = new.idProjet) then
        signal sqlstate '45000' set message_text = "#Ce projet n''existe pas";
    end if;
end;


