import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Young_Girl: npc = {
    id: 'npc_27',
    name: '小女孩',
    roleType: [RoleType.Girl, RoleType.Student],
    img: 'assert/images/npcs/小女孩.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 1,
            abilityDescription: '本轮轮回中，该角色不再拥有禁行区域，可以移动至学校之外。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
,
        {
            id: 'ability_2',
            friendlyPoints: 3,
            abilityDescription: '将该角色移动至相邻的版图。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '柱子3号，不算完全的柱子，随时可能变成街溜子',
    initialArea: [Area.School],
    forbiddenAreas: [Area.City, Area.Shrine, Area.Hospital],
    instability: 1,
    npcState: {
        currentArea: Area.School,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
}
