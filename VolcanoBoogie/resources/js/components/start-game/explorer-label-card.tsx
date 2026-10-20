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
    HeartOff
} from 'lucide-react'
import { ExplorerRole } from '@/enums/explorer-role';

type Props = {
    explorerRole: ExplorerRole;
}

export default function ExplorerOptionsPane({
    explorerRole
}: Props) {
    function retrieveIcon() {
        if (explorerRole === ExplorerRole.SAPPER) {
            return <Bomb className="text-stone-100 size-4 mx-1"/>;
        }
        if (explorerRole === ExplorerRole.FOREMAN) {
            return <Pickaxe className="text-stone-900 size-4 mx-1"/>;
        }
        if (explorerRole === ExplorerRole.VETERAN) {
            return <Shield className="text-stone-900 size-4 mx-1"/>;
        }
        if (explorerRole === ExplorerRole.MARKSMAN) {
            return <Crosshair className="text-stone-100 size-4 mx-1"/>;
        }
        if (explorerRole === ExplorerRole.ARISTOCRAT) {
            return <BookOpenText className="text-stone-100 size-4 mx-1"/>;
        }
        if (explorerRole === ExplorerRole.ARCHAEOLOGIST) {
            return <Dices className="text-stone-100 size-4 mx-1"/>;
        }
        if (explorerRole === ExplorerRole.ROGUE) {
            return <Footprints className="text-stone-100 size-4 mx-1"/>;
        }
        if (explorerRole === ExplorerRole.GUIDE) {
            return <MapPin className="text-stone-900 size-4 mx-1"/>;
        }
        if (explorerRole === ExplorerRole.HEALER) {
            return <Cross className="text-stone-900 size-4 mx-1"/>;
        }
        return <HeartOff className="text-stone-900 size-4 mx-1"/>; //PRIEST
    }

    function retrieveLabelCardClassName() {
        if (explorerRole === ExplorerRole.SAPPER) {
            return "flex items-center bg-red-500 text-stone-100 rounded-lg p-2";
        }
        if (explorerRole === ExplorerRole.FOREMAN) {
            return "flex items-center bg-blue-400 text-stone-900 rounded-lg p-2";
        }
        if (explorerRole === ExplorerRole.VETERAN) {
            return "flex items-center bg-yellow-300 text-stone-900 rounded-lg p-2";
        }
        if (explorerRole === ExplorerRole.MARKSMAN) {
            return "flex items-center bg-green-900 text-stone-100 rounded-lg p-2";
        }
        if (explorerRole === ExplorerRole.ARISTOCRAT) {
            return "flex items-center bg-purple-700 text-stone-100 rounded-lg p-2";
        }
        if (explorerRole === ExplorerRole.ARCHAEOLOGIST) {
            return "flex items-center bg-yellow-900 text-stone-100 rounded-lg p-2";
        }
        if (explorerRole === ExplorerRole.ROGUE) {
            return "flex items-center bg-gray-950 text-stone-100 rounded-lg p-2";
        }
        if (explorerRole === ExplorerRole.GUIDE) {
            return "flex items-center bg-orange-200 text-stone-900 rounded-lg p-2";
        }
        if (explorerRole === ExplorerRole.HEALER) {
            return "flex items-center bg-gray-400 text-stone-900 rounded-lg p-2";
        }
        return "flex items-center bg-gray-100 text-stone-900 rounded-lg p-2"; //PRIEST
    }

    return (
        <div className={retrieveLabelCardClassName()}>{retrieveIcon()}{explorerRole.toUpperCase()}</div>
    )
}