import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Police_Officer: npc = {
    id: 'npc_09',
    name: '刑警',
    roleType: [RoleType.Adult, RoleType.Male],
    img: 'assert/images/npcs/警察.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 4,
            abilityDescription: '公开1个本轮已发生事件的当事人。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
,
        {
            id: 'ability_2',
            friendlyPoints: 5,
            abilityDescription: '往同一区域任意1名角色身上放置1枚护卫指示物。放置护卫指示物的角色死亡时，移除护卫指示物代替其死亡处理。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '在事件之后才能赶到现场调查的刑警，在保护别人上反而很有经验',
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
    hasSpecialToken: true,
    specialToken: 'Guard',
    specialTokenDescription: '',
    specialTokenImage: 'assert/images/tokens/guard.png',
}
