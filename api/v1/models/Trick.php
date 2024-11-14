<?php
class Trick {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getAllTricks() {
        $stmt = $this->pdo->prepare("SELECT * FROM tricks");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}