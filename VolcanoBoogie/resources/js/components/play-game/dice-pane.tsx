import { 
    Flame, 
    TriangleAlert, 
    HeartOff, 
    Landmark, 
    Swords,
    Dice1,
    Dice2,
    Dice3,
    Dice4,
    Dice5,
    Dice6
} from 'lucide-react';
import { Hazard } from '@/enums/hazard';
import { Dice } from '@/interfaces/dice';

type Props = {
    diceTray: Dice[]
}

export default function ControlPane({
    diceTray
}: Props) {
    console.log("DICE TRAY");
    console.log(diceTray);

    function retrieveHazardDice(hazard: Hazard) {
        const hazardDiceIcon = retrieveHazardDiceIcon(hazard);

        return (
            <div className="flex bg-orange-600 rounded-lg border-2 border-stone-800 p-2 mx-1">
                {hazardDiceIcon}
            </div>
        );
    }

    function retrieveNumericalDice(value: number) {
        const numericalDiceIcon = retrieveNumericalDiceIcon(value);

        return (
            <div className="flex bg-stone-800 rounded-md mx-1">
                {numericalDiceIcon}
            </div>
        );
    }

    function retrieveHazardDiceIcon(hazard: Hazard) {
        if (hazard === Hazard.FIRE) {
            return (
                <Flame
                    className="text-stone-800"
                />
            )
        }

        if (hazard === Hazard.TRIGGER_TRAPS) {
            return (
                <TriangleAlert
                    className="text-stone-800"
                />
            )
        }

        if (hazard === Hazard.STUMBLE) {
            return (
                <HeartOff
                    className="text-stone-800"
                />
            )
        }

        if (hazard === Hazard.CAVE_IN) {
            return (
                <Landmark
                    className="text-stone-800"
                />
            )
        }        
        
        if (hazard === Hazard.SPAWN_GUARDIAN) {
            return (
                <Swords
                    className="text-stone-800"
                    strokeDasharray="1 3"
                />
            )
        }

        //MOVE GUARDIAN
        return (
            <Swords
                className="text-stone-800"
            />
        )
    }

    function retrieveNumericalDiceIcon(value: number) {
        if (value === 1) {
            return (
                <Dice1
                    size={30}
                    className="text-stone-100"
                />
            );
        }        
        if (value === 2) {
            return (
                <Dice2
                    size={30}
                    className="text-stone-100"
                />
            );
        }        
        if (value === 3) {
            return (
                <Dice3
                    size={30}
                    className="text-stone-100"
                />
            );
        }        
        if (value === 4) {
            return (
                <Dice4
                    size={30}
                    className="text-stone-100"
                />
            );
        }        
        if (value === 5) {
            return (
                <Dice5
                    size={30}
                    className="text-stone-100"
                />
            );
        }

        //6
        return (
            <Dice6
                size={30}
                className="text-stone-100"
            />
        );
    }

    return (
        <div className="flex items-center justify-center bg-stone-700 border-l shadow-lg rounded-xl p-2 m-1">
            {diceTray.map((dice) => (
                dice.hazard_dice !== null 
                    ? retrieveHazardDice(dice.hazard_dice.hazard) 
                    : dice.numerical_dice !== null ? retrieveNumericalDice(dice.numerical_dice.value) : <></>
            ))}
        </div>
    )
}