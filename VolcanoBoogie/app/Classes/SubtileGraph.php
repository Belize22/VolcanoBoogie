<?php

namespace App\Classes;

use App\Models\Tile;
use App\Models\PlacedTile;
use App\Models\PlacedSubtile;
use App\Enums\Rotation;
use App\Enums\TileType;
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
        
        //West and east wing tiles act as basis of board boundaries!
        $wingSubtiles = PlacedSubtile::whereIn(
            'placed_tile_id', PlacedTile::whereIn(
                'tile_id', Tile::whereIn('tile_type', [TileType::WEST_WING, TileType::EAST_WING])->get()->pluck('id')
            )->get()->pluck('id')
        )->get();

        $this->minX = $wingSubtiles->min('x_coordinate');
        $this->maxX = $wingSubtiles->max('x_coordinate');
        $this->minY = $wingSubtiles->min('y_coordinate');

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
                if ($this->isWithinBounds($adjacentNode)) {
                    if ($node === null) {
                        array_push($availablePlacements, $adjacentNode);
                    }
                    else if (!$node->visited) {
                        $nodeQueue->enqueue($this->getNodeByCoordinate($adjacentNode));
                    }
                }
            }
        }

        $availablePlacements = array_unique($availablePlacements, SORT_REGULAR); //No duplicates.
        return $availablePlacements;
    }

    public function findOpenConnectionPositionsToMapWithBFS($highestYCoordinate) {
        $emptyTiles = [];      //Mark visited empty tiles.
        $connectingTiles = []; //Coordinates that connect the empty area to the tile-formed map.
        $directions = array_column(Rotation::cases(), 'value');

        \Log::info($directions);

        $coordinateQueue = new SplQueue();

        //highestY + 1 guaranteed to be an empty spot that isn't closed off by
        //the tile formed map.
        $coordinateQueue->enqueue(new Coordinate(0, $highestYCoordinate + 1));

        while (count($coordinateQueue) > 0) {
            $currentSpot = $coordinateQueue->dequeue();

            foreach($directions as $direction) {
                $adjacentSpot = Rotation::getCoordinateRelativeToDirection($currentSpot, Rotation::from($direction));

                if ($this->isWithinBounds($adjacentSpot) && $currentSpot->y <= $highestYCoordinate + 1) {
                    //If not already part of the collection and is not an occupied tile.
                    if (!in_array($adjacentSpot, $emptyTiles)) {
                        if ($this->getNodeByCoordinate($adjacentSpot) === null) {
                            $coordinateQueue->enqueue($adjacentSpot);
                            array_push($emptyTiles, $currentSpot);
                        }
                        else {
                            $node = $this->getNodeByCoordinate($adjacentSpot);
                            $adjacencies = Rotation::getAdjacencies($node->rotation, $node->pathType);
                            foreach ($adjacencies as $adjacency) {
                                if ($adjacency === Rotation::flip(Rotation::from($direction))) {
                                    array_push($connectingTiles, $currentSpot);
                                }
                            }
                        }
                    }
                }
            }
        }

        $connectingTiles = array_unique($connectingTiles, SORT_REGULAR); //No duplicates;
        return $connectingTiles;
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

    private function isWithinBounds(Coordinate $coordinate) {
        return $coordinate->x >= $this->minX && $coordinate->x <= $this->maxX && $coordinate->y >= $this->minY;
    }
}
