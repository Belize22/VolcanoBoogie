import { RotateCcw, RotateCw, Check } from 'lucide-react'

type Props = {
    confirmTileRotation: () => void;
    rotateTile: (isClockwise: boolean) => void;
};

export default function RotationPane({
    confirmTileRotation,
    rotateTile
}: Props) {
    const ROTATION_BUTTON_STYLE = "mx-1 bg-stone-400 rounded-xl size-8 hover:scale-110";
    const CONFIRMATION_BUTTON_STYLE = "mx-1 bg-green-400 rounded-xl size-8 hover:scale-110";
    const ICON_STYLE = "mx-1 text-stone-900";

    return (
        <div className="flex justify-center bg-stone-700 border-l shadow-lg rounded-xl p-2 my-1">
            <button className={ROTATION_BUTTON_STYLE}>
                <RotateCcw
                    className={ICON_STYLE}
                    onClick={() => rotateTile(false)}
                />
            </button>
            <button className={ROTATION_BUTTON_STYLE}>
                <RotateCw
                    className={ICON_STYLE}
                    onClick={() => rotateTile(true)}
                />
            </button>
            <button className={CONFIRMATION_BUTTON_STYLE}>
                <Check
                    className={ICON_STYLE}
                    onClick={confirmTileRotation}
                />
            </button>
        </div>
    );
}