type Props = {
    zoomFactor: number
};

export default function InformationPane({
    zoomFactor
}: Props) {
    return (
        <div className="flex justify-center bg-stone-700 border-l shadow-lg rounded-2xl p-4 my-1">
            <p>Zoom Factor: {zoomFactor}</p>
        </div>
    )
}