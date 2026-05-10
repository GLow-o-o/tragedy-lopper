import { Area } from "../../basicData/areas";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Sacred_Tree: npc = {
    id: 'npc_30',
    name: '御神木',
    roleType: [RoleType.Tree],
    img: 'assert/images/npcs/御神木.png',
    thoughts: '柱子000号，真正的电线杆子',
    initialArea: [Area.Shrine],
    forbiddenAreas: [Area.City, Area.School, Area.Hospital],
    instability: 4,
    npcState: {
        currentArea: Area.Shrine,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['主人公在每个回合的主人公能力阶段，可以将该角色身上的1枚指示物移动至同一区域的另外1名角色身上。如果该角色带有无视友好的特性，剧作家必须在剧作家能力阶段使用此特性（强制）'],
}
