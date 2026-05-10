import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Rich_Mans_Daughter: npc = {
    id: 'npc_03',
    name: '大小姐',
    roleType: [RoleType.Student, RoleType.Girl],
    img: 'assert/images/npcs/大小姐.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '必须位于学校或都市才可以使用，往同一区域任意1名角色身上放置1枚友好指示物',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
    ],
    thoughts: '在学校里不那么常见的大小姐，因为限度很低所以很容易触发事件',
    initialArea: [Area.School],
    forbiddenAreas: [],
    instability: 2,
    npcState: {
        currentArea: Area.School,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
}
