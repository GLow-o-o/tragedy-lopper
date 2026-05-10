

import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Shrine_Maiden: npc = {
    id: 'npc_06',
    name: '巫女',
    roleType: [RoleType.Student, RoleType.Girl],
    img: 'assert/images/npcs/巫女.png',

    abilitys: [
        {
            id: 'ability1',
            friendlyPoints: 3,// 需要3点友好点数才能使用
            abilityDescription: '必須位於神社才可以使用。移除神社的1枚密謀指示物。',
            excuteTime: [Steps.ProtagonistAbility],// 在主人公能力阶段可以使用
            useLimitDay: 1, // 每天1次
            useLimitArea: [Area.Shrine]
        },
        {
            id: 'ability2',
            friendlyPoints: 5,// 需要5点友好点数才能使用
            abilityDescription: '公開同一區域任意1名角色的身份。',
            excuteTime: [Steps.ProtagonistAbility],// 在主人公能力阶段可以使用
            useLimitRoope: 1,//每轮一次
            useLimitArea: 'currentArea',
        }
    ],
    thoughts: '神社的常见角色，能力很强力，在长期战中属于优先级比较高的角色，但要小心她的移动范围容易被剧作家控制',
    initialArea: [Area.Shrine],
    forbiddenAreas: [Area.City],
    instability: 2,
    npcState: {
        currentArea: Area.Shrine,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    }

}
