import ActionMenu from '@/components/play-game/action-menu';

type Props = {
    gameId: number
    updateGameState: <TArgs extends any[], TReturn>(serviceFunction: (...parameters: TArgs) => Promise<any>, ...parameters: TArgs) => Promise<void>;
};

export default function Footer({
    gameId,
    updateGameState
}: Props) {
    return (
        <div className="fixed inset-x-0 bottom-0 right-0 h-1/10 bg-stone-700 border-l shadow-lg">
            <ActionMenu
                gameId={gameId}
                updateGameState={updateGameState}
            />
        </div>
    );
}