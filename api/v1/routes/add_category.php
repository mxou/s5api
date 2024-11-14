<?php
require_once '../controllers/CategoryController.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$categoryController = new CategoryController();

if (isset($input['nom'])) {
    $result = $categoryController->addCategory($input['nom']);
    echo json_encode($result);
} else {
    echo json_encode(['error' => 'Nom de catégorie manquant']);
}