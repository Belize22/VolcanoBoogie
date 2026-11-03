import ActionMenu from '@/components/play-game/action-menu';

type Props = {
    endTurn: () => void;
};

export default function Footer({
    endTurn
}: Props) {
    return (
        <div className="fixed inset-x-0 bottom-0 right-0 h-1/10 bg-stone-700 border-l shadow-lg">
            <ActionMenu
                endTurn={endTurn}
            />
        </div>
    );
}