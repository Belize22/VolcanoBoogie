import { Player } from '@/interfaces/player'

type Props = {
    player: Player;
}


export default function ExplorerOverviewCard({
    player
}: Props) {
    return (
        <div className="flex justify-center bg-stone-700 border-l shadow-lg rounded-xl p-2 my-1">
            <p>{`Player ${player.turn_order}: ${player.explorer_role[0].toUpperCase() + player.explorer_role.slice(1)}`}</p>
        </div>
    )
}