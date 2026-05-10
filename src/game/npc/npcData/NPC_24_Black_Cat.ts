import { Area } from "../../basicData/areas";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Black_Cat: npc = {
    id: 'npc_24',
    name: '黑猫',
    roleType: [RoleType.Animal],
    img: 'assert/images/npcs/黑猫.png',
    thoughts: '喵喵，喵喵喵喵喵，喵，哈基米を南北路多、阿西がはやくなる',
    initialArea: [Area.Shrine],
    forbiddenAreas: [],
    instability: 0,
    npcState: {
        currentArea: Area.Shrine,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['每輪輪迴開始時，往神社放置1枚密謀指示物。', '該角色為當事人的事件，其效果變為「沒有任何現象」。'],
}
