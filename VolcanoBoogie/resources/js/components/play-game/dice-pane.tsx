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

type Props = {

}

export default function ControlPane({
}: Props) {
    function retrieveHazardDice() {
        const hazardDiceIcon = retrieveHazardDiceIcon();

        return (
            <div className="flex bg-orange-600 rounded-lg border-2 border-stone-800 p-2 mx-1">
                {hazardDiceIcon}
            </div>
        );
    }

    function retrieveNumericalDice() {
        const numericalDiceIcon = retrieveNumericalDiceIcon();

        return (
            <div className="flex bg-stone-800 rounded-md">
                {numericalDiceIcon}
            </div>
        );
    }

    function retrieveHazardDiceIcon() {
        return (
            <Landmark
                className="text-stone-800"
            />
        );

        //Specific configurations for guardians spawn icon.
        return (
            <Swords
                className="text-stone-800"
                strokeDasharray="1 3"
            />
        );
    }

    function retrieveNumericalDiceIcon() {
        return (
            <Dice1
                size={30}
                className="text-stone-100"
            />
        );
    }

    return (
        <div className="flex items-center justify-center bg-stone-700 border-l shadow-lg rounded-xl p-2 m-1">
            {retrieveHazardDice()}
            {retrieveNumericalDice()}
        </div>
    )
}