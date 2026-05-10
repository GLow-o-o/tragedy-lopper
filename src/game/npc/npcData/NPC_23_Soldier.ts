import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Soldier: npc = {
    id: 'npc_23',
    name: '军人',
    roleType: [RoleType.Adult, RoleType.Male],
    img: 'assert/images/npcs/军人.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 2,
            abilityDescription: '往同一区域任意1名角色身上放置2枚不安指示物。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
,
        {
            id: 'ability_2',
            friendlyPoints: 5,
            abilityDescription: '本轮轮回中，主人公不会死亡。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '可以对自己使用军体拳的军人，HSA限定解放（并不是）',
    initialArea: [Area.Hospital],
    forbiddenAreas: [],
    instability: 3,
    npcState: {
        currentArea: Area.Hospital,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
}
