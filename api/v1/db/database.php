<?php
class Database {
    private $pdo;

    public function __construct() {
        $this->connect();
    }

    private function connect() {
        $dbPath = __DIR__ . '/skate_tricks'; // Assure-toi que le chemin du fichier SQLite est correct
        try {
            $this->pdo = new PDO("sqlite:" . $dbPath);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }

    public function getPdo() {
        return $this->pdo;
    }
}