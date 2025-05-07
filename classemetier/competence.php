<?php
declare(strict_types=1);

class Competence extends Table
{

    /**
     * retourne les projets du portfolio de l'utilisateur
     * @return array
     */
    public static function getAll(): array
    {
        $sql = <<<EOD
            SELECT concat('C.', idBloc, '.', idDomaine, '.', idCompetence) as code, libelle
            FROM competence
            order by code;
EOD;
        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * retourne les compétences
     * @param string $idBloc
     * @param string $idDomaine
     * @return array
     */
    public static function getLesCompetences(string $idBloc, string $idDomaine = '*'): array
    {
        $lesParametres['idBloc'] = $idBloc;
        $sql = <<<EOD
            SELECT id, concat('C.', idBloc, '.', idDomaine, '.', idCompetence) as code, libelle
            FROM competence
            where idBloc = :idBloc
EOD;
        // prise en compte du domaine si l'idDomaine n'a pas la valeur par défaut
        if ($idDomaine !== '*') {
            $sql .= " and  idDomaine = :idDomaine";
            $lesParametres['idDomaine'] = $idDomaine;
        }

        $select = new Select();
        return $select->getRows($sql, $lesParametres);
    }

    /**
     * retourne les blocs
     * @return array
     */
    public static function getLesBlocs(): array
    {
        $sql = <<<EOD
            SELECT id, libelle
            FROM bloc
            order by libelle;
EOD;
        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * retourne les domaines du bloc
     * @param int $idBloc
     * @return array
     */
    public static function getLesDomaines(int $idBloc): array
    {
        $sql = <<<EOD
            SELECT idDomaine, libelle
            FROM domaine
            Where idBloc = :idBloc
            order by libelle;   
EOD;
        $select = new Select();
        return $select->getRows($sql, ['idBloc' => $idBloc]);
    }


    public static function getById(int $id): mixed
    {
        $sql = <<<EOD
            SELECT id, libelle
            FROM competence
            where id = :id;
EOD;
        $select = new Select();
        return $select->getRow($sql, ['id' => $id]);
    }
}
