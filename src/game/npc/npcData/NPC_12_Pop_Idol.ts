

import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Pop_Idol: npc = {
    id: 'npc_12',
    name: '偶像',
    roleType: [RoleType.Student, RoleType.Girl],
    img: 'assert/images/npcs/偶像.png',
    abilitys: [
        {
            id: 'ability1',
            friendlyPoints: 3,// 需要3点友好点数才能使用
            abilityDescription: '移除同一区域另1名角色身上的1枚不安指示物。',
            excuteTime: [Steps.ProtagonistAbility],// 在主人公能力阶段可以使用
            useLimitDay: 1, // 每天1次
            useLimitArea: 'currentArea'
        },
        {
            id: 'ability2',
            friendlyPoints: 4,// 需要4点友好点数才能使用
            abilityDescription: '往同一区域另1名角色身上放置1枚友好指示物。',
            excuteTime: [Steps.ProtagonistAbility],// 在主人公能力阶段可以使用
            useLimitDay: 1, // 每天1次
            useLimitArea: 'currentArea'

        }
    ],
    thoughts: '人见人爱，能力也好用，为什么不舔呢',
    initialArea: [Area.City],
    forbiddenAreas: [],
    instability: 2,
    npcState: {
        currentArea: Area.City,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    }
}
