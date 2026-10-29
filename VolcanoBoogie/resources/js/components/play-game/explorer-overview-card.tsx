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
    Heart,
    Key,
    Gem
} from 'lucide-react'
import { ExplorerRole } from '@/enums/explorer-role';
import { Item } from '@/enums/item';
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
                    <div className="bg-stone-200 rounded-xl p-1 border-2 border-stone-900">
                        <Heart className="size-4 text-stone-900"/>
                    </div>
                )
            }
            else {
                healthTokens.push(
                    <div className="bg-stone-200 rounded-xl p-1 border-2 border-stone-900 opacity-50">
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
                <div className="bg-red-500 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <Bomb className="size-6 text-stone-100"/>
                </div>
            );
        }

        if (player.explorer_role === ExplorerRole.FOREMAN) {
            return (
                <div className="bg-blue-400 rounded-3xl p-2 border-2 mr-2 border-stone-900">
                    <Pickaxe className="size-6 text-stone-900"/>
                </div>
            );
        }

        if (player.explorer_role === ExplorerRole.VETERAN) {
            return (
                <div className="bg-yellow-300 rounded-3xl p-2 border-2 mr-2 border-stone-900">
                    <Shield className="size-6 text-stone-900"/>
                </div>
            );
        }        
        
        if (player.explorer_role === ExplorerRole.MARKSMAN) {
            return (
                <div className="bg-green-900 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <Crosshair className="size-6 text-stone-100"/>
                </div>
            );
        }

        if (player.explorer_role === ExplorerRole.ARISTOCRAT) {
            return (
                <div className="bg-purple-700 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <BookOpenText className="size-6 text-stone-100"/>
                </div>
            );

        }

        if (player.explorer_role === ExplorerRole.ARCHAEOLOGIST) {
            return (
                <div className="bg-yellow-900 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <Dices className="size-6 text-stone-100"/>
                </div>
            );
        }

        if (player.explorer_role === ExplorerRole.ROGUE) {
            return (
                <div className="bg-gray-950 rounded-3xl p-2 border-2 mr-2 border-stone-100">
                    <Footprints className="size-6 text-stone-100"/>
                </div>
            );
        }

        if (player.explorer_role === ExplorerRole.GUIDE) {
            return (
                <div className="bg-orange-200 rounded-3xl p-2 border-2 mr-2 border-stone-900">
                    <MapPin className="size-6 text-stone-900"/>
                </div>
            );
        }

        if (player.explorer_role === ExplorerRole.HEALER) {
            return (
                <div className="bg-gray-400 rounded-3xl p-2 border-2 mr-2 border-stone-900">
                    <Cross className="size-6 text-stone-900"/>
                </div>
            );
        }

        //PRIEST
        return (
            <div className="bg-gray-100 rounded-3xl p-2 border-2 mr-2 border-stone-900">
                <HeartOff className="size-6 text-stone-900"/>
            </div>
        );
    }

    function retrieveCurrentItem() {
        if (player.item === Item.KEY) {
            return (
                <div className="bg-stone-800 ml-auto rounded-3xl p-2 border-2 border-stone-100">
                    <Key className="size-6 text-amber-400"/>
                </div>
            );
        }

        if (player.item === Item.ARTIFACT) {
            return (
                <div className="bg-red-700 ml-auto rounded-3xl p-2 border-2 border-stone-100">
                    <Gem className="size-6 text-amber-400"/>
                </div>
            );
        }

        //No item.
        return (
            <div className="ml-auto rounded-3xl p-2 border-2 border-dotted border-stone-100">
                <HeartOff className="size-6 text-stone-100 opacity-0"/>
            </div>
        );
    }

    return (
        <div className="bg-stone-700 border-l shadow-lg rounded-xl p-2 m-1">
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
                    {retrieveCurrentItem()}
                </div>
            </div>
        </div>
    )
}