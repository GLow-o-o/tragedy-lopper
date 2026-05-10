import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Sect_Founder: npc = {
    id: 'npc_28',
    name: '教主',
    roleType: [RoleType.Adult, RoleType.Female],
    img: 'assert/images/npcs/教主.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '往另外1名不安达到或超出不安限度的角色身上放置1枚友好指示物',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
,
        {
            id: 'ability_2',
            friendlyPoints: 4,
            abilityDescription: '公开同一区域另外1名不安达到或超出不安限度的角色的身份',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '二连击，什么目力教主',
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
    features: ['该角色为当事人的事件，按事件文字表述结算2次'],
}
