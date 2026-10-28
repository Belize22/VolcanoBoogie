import { ExplorerRole } from '@/enums/explorer-role';
import { Item } from '@/enums/item';
import { PlayerStatus } from '@/enums/player-status'

export interface Player {
    id: number,
    game_id: number,
    explorer_role: ExplorerRole,
    current_health: number,
    max_health: number,
    item: Item | null,
    player_status: PlayerStatus,
    turn_order: number
}