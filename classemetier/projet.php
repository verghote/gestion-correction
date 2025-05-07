<?php
declare(strict_types=1);

class Projet extends Table
{
    public function __construct()
    {
        parent::__construct('projet');

        // nom
        $input = new inputText();
        $input->Require = true;
        $input->Casse = '';
        $input->SupprimerAccent = false;
        $input->SupprimerEspaceSuperflu = true;
        $input->MinLength = 3;
        $input->MaxLength = 150;
        $this->columns['nom'] = $input;

        // Liste des colonnes modifiables en mode colonne
        $this->listOfColumns->Values = ['nom'];
    }

    /**
     * retourne les projets du portfolio de l'utilisateur
     * @return array
     */
    public static function getAll(): array
    {
        $sql = <<<EOD
            SELECT id, nom
            FROM projet
            order by nom;
EOD;
        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * retourne les compétences du projet
     * @param int $idProjet
     * @return array
     */
    public static function getLesCompetences(int $idProjet): array
    {
        $sql = <<<EOD
            SELECT competence.id, concat('C.', idBloc, '.', idDomaine, '.', competence.idCompetence) as code, libelle
            FROM competenceprojet 
                 join competence on competence.id = competenceprojet.idCompetence  
            where idProjet = :idProjet
            order by libelle;
EOD;
        $select = new Select();
        return $select->getRows($sql, ['idProjet' => $idProjet]);
    }

    public static function getById(int $id): mixed
    {
        $sql = <<<EOD
            SELECT id, nom
            FROM projet
            where id = :id;
EOD;
        $select = new Select();
        return $select->getRow($sql, ['id' => $id]);
    }


    public static function getByName(string $nom): mixed
    {
        $sql = <<<EOD
            SELECT id, nom
            FROM projet
            where nom = :nom;
EOD;
        $select = new Select();
        return $select->getRow($sql, ['nom' => $nom]);
    }


    /**
     * @param int $idProjet
     * @param int $idCompetence
     * @return void
     */
    public static function ajouterCompetence(int $idProjet, int $idCompetence): void
    {
        $sql = <<<EOD
        insert into competenceprojet(idProjet, idCompetence)
                    values(:idProjet, :idCompetence);
EOD;
        $db = Database::getInstance();
        $curseur = $db->prepare($sql);
        $curseur->bindValue('idProjet', $idProjet);
        $curseur->bindValue('idCompetence', $idCompetence);
        $curseur->execute();
    }

    public static function supprimerCompetence(int $idProjet, int $idCompetence): void
    {
        $sql = <<<EOD
        delete from competenceprojet
        where idProjet = :idProjet
        and idCompetence = :idCompetence;   
EOD;
        $db = Database::getInstance();
        $curseur = $db->prepare($sql);
        $curseur->bindValue('idProjet', $idProjet);
        $curseur->bindValue('idCompetence', $idCompetence);
        $curseur->execute();
    }


    public static function enregistrer(string $nom, array $lesCompetences): string
    {
        // enregistrement en utilisant une transaction afin de rendre atomique l'ensemble des ordres insert
        $db = Database::getInstance();

        // Démarrage d'une transaction
        $db->beginTransaction();
        // ajout du projet
        $sql = <<<EOD
            insert into projet(nom) values(:nom);
EOD;
        $curseur = $db->prepare($sql);
        $curseur->bindValue('nom', $nom);
        try {
            $curseur->execute();
        } catch (Exception $e) {
            $db->rollBack();
            return $e->getMessage();
        }
// récupération de l'id attribué au projet
        $idProjet = $db->lastInsertId();

// ajout des compétences du projet
        foreach ($lesCompetences as $idCompetence) {
            $sql = <<<EOD
                insert into competenceprojet(idProjet, idCompetence) values(:idProjet, :idCompetence);
EOD;
            $curseur = $db->prepare($sql);
            $curseur->bindValue('idProjet', $idProjet);
            $curseur->bindValue('idCompetence', $idCompetence);
            try {
                $curseur->execute();
            } catch (Exception $e) {
                $db->rollBack();
                return $e->getMessage();
            }
        }
        $db->commit();
        return "Opération réalisée avec succès";
    }
}