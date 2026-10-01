import { Play } from 'lucide-react';

type Props = {

}

export default function GamePane({

}: Props) {
    const items = ['Game 1', 'Game 2', 'Game 3', 'Game 4', 'Game 5', 'Game 6', 'Game 7', 'Game 8', 'Game 9', 'Game 10'];

    return (
        <div className="flex justify-center bg-stone-700 border-l shadow-lg rounded-xl p-1 m-1 w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-1 w-4/5">
                {items.map((item, index) => (
                    <div key={index} className="flex flex-col items-center bg-stone-500 p-2 rounded-lg">
                        <p className="p-1 text-lg">{item}</p>
                        <button className="flex items-center justify-center gap-2 p-2 bg-green-600 rounded-lg hover:scale-110">
                            <Play/>
                            <p>Continue Game</p>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}