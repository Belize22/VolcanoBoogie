<?php

namespace App\Classes;

use App\Models\PlacedTile;
use App\Models\PlacedSubtile;
use App\Enums\Rotation;

class SubtileGraph
{
    /**
     * Create a new class instance.
     */
    public function __construct($boardId)
    {
        $this->subtileNodes = [];
        $subtiles = PlacedSubtile::whereIn('id', PlacedTile::where('board_id', $boardId)->pluck('id'))->get();

        foreach ($subtiles as $subtile) {
            $subtileNode = new SubtileNode($subtile);
            array_push($this->subtileNodes, $subtileNode);
        }

        $this->setupAdjacencies();
    }

    private function getNodeByCoordinate(Coordinate $coordinate) {
        return array_find($this->subtileNodes, fn($node) => $node->coordinate == $coordinate);
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
}
