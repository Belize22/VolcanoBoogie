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
import { ExplorerRole } from '@/enums/explorer-role';
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
                    <div className="bg-stone-400 rounded-xl p-1 mx-1">
                        <Heart className="size-4 text-stone-900"/>
                    </div>
                )
            }
            else {
                healthTokens.push(
                    <div className="bg-stone-400 rounded-xl p-1 mx-1 opacity-50">
                        <HeartOff className="size-4 text-stone-900"/>
                    </div>
                )
            }
        }

        return healthTokens;
    }

    function retrieveExplorerBadge() {
        if (player.explorer_role === ExplorerRole.SAPPER) {
            return (
                <div className="bg-stone-800 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <Bomb className="size-6 text-stone-100"/>
                </div>
            );
        }

        if (player.explorer_role === ExplorerRole.FOREMAN) {
            return (
                <div className="bg-stone-800 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <Pickaxe className="size-6 text-stone-100"/>
                </div>
            );
        }

        if (player.explorer_role === ExplorerRole.VETERAN) {
            return (
                <div className="bg-stone-800 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <Shield className="size-6 text-stone-100"/>
                </div>
            );
        }        
        
        if (player.explorer_role === ExplorerRole.MARKSMAN) {
            return (
                <div className="bg-stone-800 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <Crosshair className="size-6 text-stone-100"/>
                </div>
            );
        }

        if (player.explorer_role === ExplorerRole.ARISTOCRAT) {
            return (
                <div className="bg-stone-800 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <BookOpenText className="size-6 text-stone-100"/>
                </div>
            );

        }

        if (player.explorer_role === ExplorerRole.ARCHAEOLOGIST) {
            return (
                <div className="bg-stone-800 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <Dices className="size-6 text-stone-100"/>
                </div>
            );
        }

        if (player.explorer_role === ExplorerRole.ROGUE) {
            return (
                <div className="bg-stone-800 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <Footprints className="size-6 text-stone-100"/>
                </div>
            );
        }

        if (player.explorer_role === ExplorerRole.GUIDE) {
            return (
                <div className="bg-stone-800 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <MapPin className="size-6 text-stone-100"/>
                </div>
            );
        }

        if (player.explorer_role === ExplorerRole.HEALER) {
            return (
                <div className="bg-stone-800 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <Cross className="size-6 text-stone-100"/>
                </div>
            );
        }

        //PRIEST
        return (
            <div className="bg-stone-800 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                <HeartOff className="size-6 text-stone-100"/>
            </div>
        );
    }

    return (
        <div className="bg-stone-700 border-l shadow-lg rounded-xl p-2 my-1">
            <div>
                <div className="flex items-center">
                    <p className="text-lg">
                        {`${player.explorer_role[0].toUpperCase() + player.explorer_role.slice(1)}`}
                    </p>
                    <p className="ml-auto text-md my-1">
                        {`Status: ${player.player_status[0].toUpperCase() + player.player_status.slice(1)}`}
                    </p>
                </div>
                <div className="flex items-center">
                    {retrieveExplorerBadge()}
                    {formHealthUI()}

                    {/*
                        Placeholder icon for currently held item.
                        This is what it will look like if the explorer
                        has no item currently being held.
                    */}
                    <div className="ml-auto rounded-3xl p-2 border-2 border-dotted border-stone-100">
                        <HeartOff className="size-6 text-stone-100 opacity-0"/>
                    </div>
                </div>
            </div>
        </div>
    )
}