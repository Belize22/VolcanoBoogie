import { Rotation } from '@/enums/rotation';

export function convertRotationToNumeric(rotation: Rotation) {
    if (rotation === Rotation.NORTH) {
        return 0;
    }
    else if (rotation === Rotation.EAST) {
        return 1;
    }
    else if (rotation === Rotation.SOUTH) {
        return 2;
    }
    else { //WEST
        return 3;
    }
}

export function convertNumericToRotation(num: number) {
    if (num === 0) {
        return Rotation.NORTH;
    }
    else if (num === 1) {
        return Rotation.EAST;
    }
    else if (num === 2) {
        return Rotation.SOUTH;
    }
    else { //3
        return Rotation.WEST;
    }
}