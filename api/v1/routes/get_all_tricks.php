<?php
header("Content-Type: application/json");

require_once '../db/database.php';
require_once '../controllers/TrickController.php';

// Initialiser la base de données et la connexion PDO
$database = new Database();
$pdo = $database->getPdo();

// Initialiser le contrôleur
$trickController = new TrickController($pdo);

// Récupérer les tricks, slides et grinds en tant que tableaux PHP
$tricksData = $trickController->getTricks();  // Renvoie un tableau associatif
$slidesData = $trickController->getSlides();  // Renvoie un tableau associatif
$grindsData = $trickController->getGrinds();  // Renvoie un tableau associatif

// Regrouper toutes les données dans un tableau
$finalData = [
    'tricks' => $tricksData,
    'slides' => $slidesData,
    'grinds' => $grindsData
];

// Afficher le JSON de manière lisible
echo json_encode($finalData, JSON_PRETTY_PRINT);
?>