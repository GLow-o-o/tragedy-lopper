import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Godly_Being: npc = {
    id: 'npc_08',
    name: '神灵',
    roleType: [RoleType.Male, RoleType.Female],
    img: 'assert/images/npcs/神灵.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '公开1个事件的当事人。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
,
        {
            id: 'ability_2',
            friendlyPoints: 5,
            abilityDescription: '移除同一区域任意1名角色身上，或者该角色所在版图上的1枚密谋指示物。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '在禁止聊天规则下突袭主人公的神灵，一定要记得有这么个角色哦',
    initialArea: [Area.Shrine],
    forbiddenAreas: [],
    instability: 3,
    npcState: {
        currentArea: Area.Shrine,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['剧本制作时，指定该角色在第几轮轮回登场。在所指定的轮回之前，该角色不会在轮回准备时配置上场。'],
}
