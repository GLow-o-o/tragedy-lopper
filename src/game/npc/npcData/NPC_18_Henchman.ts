import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Henchman: npc = {
    id: 'npc_18',
    name: '手下',
    roleType: [RoleType.Adult, RoleType.Male],
    img: 'assert/images/npcs/手下.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '本轮轮回中，该角色为当事人的事件不会发生。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
    ],
    thoughts: '满地乱跑的手下，难道不是剧作家的化身吗（都是黄毛）',
    initialArea: [Area.City, Area.Hospital, Area.Shrine, Area.School],
    forbiddenAreas: [],
    instability: 1,
    npcState: {
        currentArea: null,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['每轮轮回开始前，由剧作家决定该角色的初始区域。'],
}
