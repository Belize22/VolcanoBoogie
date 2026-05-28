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