import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Uploader: npc = {
    id: 'npc_37',
    name: 'UP主',
    roleType: [RoleType.Student, RoleType.Male],
    img: 'assert/images/npcs/UP主.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '往同一区域另外一名角色身上放置1枚友好指示物，并移除1枚不安指示物。随后，可以将那名角色身上的Ex牌转移到与那名角色位于同一区域、且非UP主的1名角色身上。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
    ],
    thoughts: '',
    initialArea: [Area.Faraway],
    forbiddenAreas: [],
    instability: 2,
    npcState: {
        currentArea: Area.Faraway,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['在每轮轮回第一次事件发生当天的回合结束阶段，往1名少年或少女身上设置1张Ex牌。在使用该角色的能力（包括友好能力）时，可以将放置有Ex牌的角色所在区域视为该角色所在区域。'],
}
