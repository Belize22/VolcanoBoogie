import { Dispatch, SetStateAction } from 'react';
import ControlPane from '@/components/play-game/control-pane'

type Props = {
    zoomFactor: number;
    setZoomFactor: Dispatch<SetStateAction<number>>;
};

export default function Sidebar({
    zoomFactor,
    setZoomFactor
}: Props) {
    return (
        <div className="fixed inset-y-0 right-0 w-2/10 bg-stone-900 border-l shadow-lg">
            Current Zoom Factor: {zoomFactor}
            <ControlPane
                setZoomFactor={setZoomFactor}
            />
        </div>
    );
}