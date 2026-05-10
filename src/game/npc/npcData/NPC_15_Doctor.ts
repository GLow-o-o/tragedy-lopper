import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";
import { Patient } from "./NPC_16_Patient";


export const Doctor: npc = {
    id: 'npc_15',
    name: '医生',
    roleType: [RoleType.Adult, RoleType.Male],
    img: 'assert/images/npcs/医生.png',
    abilitys: [
        {
            id: 'ability1',
            friendlyPoints: 2,// 需要2点友好点数才能使用
            abilityDescription: '放置/移除同一区域另外1名角色身上的1枚不安指示物。如果本角色的身份带有无视友好的特性，并且身上已经放置了2枚或以上的友好指示物，则剧作家可以在剧作家能力阶段使用该能力。',
            excuteTime: [Steps.ProtagonistAbility],// 在主人公能力阶段可以使用
            useLimitDay: 1, // 每天只能使用1次
        },
        {
            id: 'ability2',
            friendlyPoints: 3,// 需要3点友好点数才能使用
            abilityDescription: '本轮轮回中，住院患者不再拥有禁行区域，可以移动至医院之外。',
            excuteTime: [Steps.ProtagonistAbility],// 在主人公能力阶段可以使用
            useLimitDay: 1, // 每天只能使用1次
            useLimitRole: [Patient],
        }
    ],
    thoughts: '',
    initialArea: [Area.Hospital],
    forbiddenAreas: [],
    instability: 2,// 不安限度为2
    npcState: {
        currentArea: Area.Hospital,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    }
}
