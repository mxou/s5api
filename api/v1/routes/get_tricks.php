<?php
// /api/routes/get_tricks.php
header("Access-Control-Allow-Origin: *");  // Permet à toutes les origines d'accéder à l'API
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");  // Permet les méthodes HTTP spécifiques
header("Access-Control-Allow-Headers: Content-Type");  // Autorise certains en-têtes


header("Content-Type: application/json");

require_once '../db/database.php';
require_once '../controllers/TrickController.php';

$database = new Database();
$controller = new TrickController($database->getPdo()); // Utilise getPdo() ici pour obtenir la connexion PDO
$tricks = $controller->getTricks();

echo json_encode($tricks);