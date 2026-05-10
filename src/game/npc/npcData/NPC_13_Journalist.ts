import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Journalist: npc = {
    id: 'npc_13',
    name: '媒体人',
    roleType: [RoleType.Adult, RoleType.Male],
    img: 'assert/images/npcs/记者.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 2,
            abilityDescription: '往另外1名角色身上放置1枚不安指示物。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
,
        {
            id: 'ability_2',
            friendlyPoints: 2,
            abilityDescription: '往同一区域任意1名角色身上，或者该角色所在版图上放置1枚密谋指示物。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
    ],
    thoughts: '',
    initialArea: [Area.City],
    forbiddenAreas: [],
    instability: 2,
    npcState: {
        currentArea: Area.City,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
}
