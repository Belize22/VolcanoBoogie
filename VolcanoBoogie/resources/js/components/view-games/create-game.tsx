type Props = {
}

export default function CreateGame({

}: Props) {
    return (
        <div className="flex justify-center">
            <div className="bg-stone-700 text-center p-2 mx-2 rounded-xl">
                <p className="text-xl">Select Number of Explorers</p>
                <div className="flex justify-center rounded-xl py-2">
                    <button className="bg-stone-500 p-2 px-3 m-1 rounded-lg">3</button>
                    <button className="bg-stone-500 p-2 px-3 m-1 rounded-lg">4</button>
                    <button className="bg-stone-500 p-2 px-3 m-1 rounded-lg">5</button>
                    <button className="bg-stone-500 p-2 px-3 m-1 rounded-lg">6</button>
                </div>
            </div>
            <div className="bg-stone-700 text-center p-2 mx-2 rounded-xl">
                <p className="text-xl">Select Difficulty</p>
                <div className="flex justify-center rounded-xl py-2">
                    <button className="bg-green-900 p-2 m-1 rounded-lg">Beginner</button>
                    <button className="bg-yellow-900 p-2 m-1 rounded-lg">Intermediate</button>
                    <button className="bg-red-900 p-2 m-1 rounded-lg">Advanced</button>
                    <button className="bg-purple-900 p-2 m-1 rounded-lg">Expert</button>
                </div>
            </div>
        </div>
    );
}