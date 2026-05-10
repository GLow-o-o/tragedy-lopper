import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Part_Timer_Question: npc = {
    id: 'npc_33',
    name: '临时工?',
    roleType: [RoleType.Girl],
    img: 'assert/images/npcs/临时工？ .png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '公开该角色的身份，并选择同一区域的1名角色放置2枚友好指示物',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '打工是不可能打工的，只能维持生活这样子',
    initialArea: [Area.City],
    forbiddenAreas: [],
    instability: 3,
    npcState: {
        currentArea: Area.City,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['该角色的身份以及事件当事人的配置与临时工的配置一致。'],
}
