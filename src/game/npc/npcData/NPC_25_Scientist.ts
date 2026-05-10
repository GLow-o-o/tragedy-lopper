import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Scientist: npc = {
    id: 'npc_25',
    name: '学者',
    roleType: [RoleType.Adult, RoleType.Male],
    img: 'assert/images/npcs/学者.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '移除该角色身上所有的指示物。随后，如果本局游戏使用Ex槽，选择Ex槽+1或-1。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
    ],
    thoughts: '我是疯狂科学家凤凰园！',
    initialArea: [Area.Hospital],
    forbiddenAreas: [],
    instability: 2,
    npcState: {
        currentArea: Area.Hospital,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['每轮轮回开始时，往该角色身上放置友好，不安，密谋指示物中的任意1枚。'],
}
