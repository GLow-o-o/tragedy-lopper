import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Illusion: npc = {
    id: 'npc_26',
    name: '幻想',
    roleType: [RoleType.Fictional, RoleType.Female],
    img: 'assert/images/npcs/幻想.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '将同一区域任意1名角色移动至任意版图。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
,
        {
            id: 'ability_2',
            friendlyPoints: 4,
            abilityDescription: '将该角色从版图上移除。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
    ],
    thoughts: '',
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
    features: ['无法在该角色身上放置行动牌。在与该角色所在区域对应的版图上放置的行动牌，同样会作用于该角色。'],
}
