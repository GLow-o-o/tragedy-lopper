

import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Girl_Student: npc = {
    id: 'npc_02',
    name: '女学生',
    roleType: [RoleType.Student, RoleType.Girl],
    img: 'assert/images/npcs/女学生.png',
    abilitys: [
        {
            id: 'ability1',
            friendlyPoints: 2,// 需要2点友好点数才能使用
            abilityDescription: '移除同一区域另外1名角色身上的1枚不安指示物',
            excuteTime: [Steps.ProtagonistAbility],// 在主人公能力阶段可以使用
            useLimitDay: 1, // 每天1次
        }
    ],
    thoughts: '普通的女学生，比男学生的心态更稳定一点，在学校也很常见吧',
    initialArea: [Area.School],
    forbiddenAreas: [],
    instability: 2,
    npcState: {
        currentArea: Area.School,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    }
}
