<?php

namespace App\Classes;

use App\Models\PlacedTile;
use App\Models\PlacedSubtile;
use App\Enums\Rotation;
use SplQueue;

class SubtileGraph
{
    /**
     * Create a new class instance.
     */
    public function __construct($boardId)
    {
        $this->subtileNodes = [];
        $subtiles = PlacedSubtile::whereIn('placed_tile_id', PlacedTile::where('board_id', $boardId)->pluck('id'))->get();

        foreach ($subtiles as $subtile) {
            $subtileNode = new SubtileNode($subtile);
            array_push($this->subtileNodes, $subtileNode);
        }

        $this->setupAdjacencies();
    }

    public function findAvailablePlacementsWithBFS() {
        $availablePlacements = [];

        $nodeQueue = new SplQueue();
        $nodeQueue->enqueue($this->getNodeByCoordinate(new Coordinate(0, 0)));

        while (count($nodeQueue) > 0) {
            $currentNode = $nodeQueue->dequeue();
            $currentNode->visited = true;

            foreach ($currentNode->adjacentNodes as $adjacentNode) {
                $node = $this->getNodeByCoordinate($adjacentNode);
                if ($node === null) {
                    array_push($availablePlacements, $adjacentNode);
                }
                else if (!$node->visited) {
                    $nodeQueue->enqueue($this->getNodeByCoordinate($adjacentNode));
                }
            }
        }

        \Log::info($availablePlacements);

        return $availablePlacements;
    }

    private function setupAdjacencies() {
        foreach ($this->subtileNodes as $index => $subtileNode) {
            $adjacentNodes = [];
            $adjacentCoordinates = [];
            $adjacentDirections = Rotation::getAdjacencies($subtileNode->rotation, $subtileNode->pathType);

            foreach ($adjacentDirections as $adjacentDirection) {
                array_push($adjacentCoordinates, Rotation::getCoordinateRelativeToDirection($subtileNode->coordinate, $adjacentDirection));
            }

            $subtileNode->adjacentNodes = $adjacentCoordinates;
        }
    }

    private function getNodeByCoordinate(Coordinate $coordinate) {
        return array_find($this->subtileNodes, fn($node) => $node->coordinate == $coordinate);
    }
}
