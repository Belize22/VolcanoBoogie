import { 
    Bomb,
    Pickaxe,
    Shield,
    Crosshair,
    BookOpenText,
    Dices,
    Footprints,
    MapPin,
    Cross,
    HeartOff,
    Heart
} from 'lucide-react'
import { Player } from '@/interfaces/player';

type Props = {
    player: Player;
}

export default function ExplorerOverviewCard({
    player
}: Props) {
    function formHealthUI() {
        const healthTokens = [];

        for (let i = 0; i < player.max_health; i++) {
            if (i < player.current_health) {
                healthTokens.push(
                    <div className="bg-stone-400 rounded-xl p-1 mx-1"><Heart className="size-4 text-stone-900"/></div>
                )
            }
            else {
                healthTokens.push(
                    <div className="bg-stone-400 rounded-xl p-1 mx-1 opacity-50"><HeartOff className="size-4 text-stone-900"/></div>
                )
            }
        }

        return healthTokens;
    }

    return (
        <div className="bg-stone-700 border-l shadow-lg rounded-xl p-2 my-1">
            <div>
                <p className="text-lg">
                    {`Player ${player.turn_order}: ${player.explorer_role[0].toUpperCase() + player.explorer_role.slice(1)}`}
                </p>
                <p className="text-md my-1">
                    {`Status: ${player.player_status[0].toUpperCase() + player.player_status.slice(1)}`}
                </p>
                <div className="flex items-center">
                    {formHealthUI()}
                </div>
            </div>
        </div>
    )
}