

import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Office_Worker: npc = {
    id: 'npc_10',
    name: '职员',
    roleType: [RoleType.Adult, RoleType.Male],
    img: 'assert/images/npcs/职员.png',
    abilitys: [
        {
            id: 'ability1',
            friendlyPoints: 3,// 需要3点友好点数才能使用
            abilityDescription: '公開該角色的身份。',
            excuteTime: [Steps.ProtagonistAbility],// 在主人公能力阶段可以使用
            useLimitDay: 1, // 每天1次
        }
    ],
    thoughts: '',
    initialArea: [Area.City],
    forbiddenAreas: [Area.School],
    instability: 2,
    npcState: {
        currentArea: Area.City,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    }
};

// 能力仅限本 NPC，需在对象创建后赋值，避免 npcIndex ↔ 本文件的循环依赖
// Office_Worker.abilitys[0].useLimitRole = [Office_Worker];
