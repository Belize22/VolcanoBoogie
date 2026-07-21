<?php

namespace App\Enums;

use App\Classes\Coordinate;
use App\Enums\PathType;

enum Rotation: string
{
    case NORTH = 'north';
    case EAST = 'east';
    case SOUTH = 'south';
    case WEST = 'west';

    public static function enumToNum(Rotation $rotation) {
        if ($rotation === Rotation::NORTH) {
            return 0;
        }
        if ($rotation === Rotation::EAST) {
            return 1;
        }
        if ($rotation === Rotation::SOUTH) {
            return 2;
        }
        if ($rotation === Rotation::WEST) {
            return 3;
        }
    }

    public static function numToEnum(int $num) {
        if ($num === 0) {
            return Rotation::NORTH;
        }
        if ($num === 1) {
            return Rotation::EAST;
        }
        if ($num === 2) {
            return Rotation::SOUTH;
        }
        if ($num === 3) {
            return Rotation::WEST;
        }
    }

    public static function rotate(Rotation $rotation, bool $isCcw) {
        //add by 3/1, since we go by 90 degree increments.
        //add by 3 instead of -1 (both values are ways to rotate left) to avoid negative mod problem.
        return Rotation::numToEnum((Rotation::enumToNum($rotation) + ($isCcw ? 3 : 1)) % 4);
    }

    public static function flip(Rotation $rotation) {
        //add by 2 since we go by 90 degree increments and 180 degrees essentially
        //"flips" the tile by rotating twice.
        return Rotation::numToEnum((Rotation::enumToNum($rotation) + 2) % 4);
    }

    public static function getAdjacencies(Rotation $rotation, PathType $pathType) {
        $initialAdjacencies;
        $finalAdjacencies = [];

        if ($pathType === PathType::FOUR_WAY) { //Rotation independent!
            return [Rotation::NORTH, Rotation::EAST, Rotation::SOUTH, Rotation::WEST];
        }
        else if ($pathType === PathType::T_JUNCTION) {
            $initialAdjacencies = [Rotation::NORTH, Rotation::EAST, Rotation::SOUTH];
        }
        else if ($pathType === PathType::L_JUNCTION) {
            $initialAdjacencies = [Rotation::NORTH, Rotation::EAST];
        }
        else if ($pathType === PathType::STRAIGHT) {
            $initialAdjacencies = [Rotation::NORTH, Rotation::SOUTH];
        }
        else {
            $initialAdjacencies = [Rotation::NORTH];
        }

        for ($i = 0; $i < count($initialAdjacencies); $i++) {
            //North is the default rotation. If you consider +1 to be a 90 degree rotation clockwise...
            //+1 is east, +2 is south, +3 is west.
            array_push($finalAdjacencies, Rotation::numToEnum((Rotation::enumToNum($initialAdjacencies[$i]) + Rotation::enumToNum($rotation)) % 4));
        }

        return $finalAdjacencies;
    }

    public static function getDirectionRelativeToCoordinates(Coordinate $coordinate1, Coordinate $coordinate2)
    {
        $diffX = $coordinate2->x - $coordinate1->x;
        $diffY = $coordinate2->y - $coordinate1->y;

        //Cardinal directions only.
        if (abs($diffX) > 0 && abs($diffY) > 0) {
            return "invalid";
        }

        //Do not account for tiles not directly adjacent to each other.
        if (abs($diffX) > 1 || abs($diffY) > 1) {
            return "invalid";
        }

        if ($diffY === 1) {
            return Rotation::NORTH;
        }

        if ($diffX === 1) {
            return Rotation::EAST;
        }

        if ($diffY === -1) {
            return Rotation::SOUTH;
        }

        if ($diffX === -1) {
            return Rotation::WEST;
        }
    }

    public static function getCoordinateRelativeToDirection(Coordinate $coordinate, Rotation $rotation) {
        if ($rotation === Rotation::NORTH) {
            return new Coordinate($coordinate->x, $coordinate->y + 1);
        }
        else if ($rotation === Rotation::EAST) {
            return new Coordinate($coordinate->x + 1, $coordinate->y);
        }
        else if ($rotation === Rotation::SOUTH) {
            return new Coordinate($coordinate->x, $coordinate->y - 1);
        }
        else { //WEST
            return new Coordinate($coordinate->x - 1, $coordinate->y);
        }
    }
}
