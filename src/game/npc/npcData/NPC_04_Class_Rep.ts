import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Class_Rep: npc = {
    id: 'npc_04',
    name: '班长',
    roleType: [RoleType.Student, RoleType.Girl],
    img: 'assert/images/npcs/班长.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 2,
            abilityDescription: '由队长选择1张属于自己、每轮限1次且已经使用完毕的行动牌，将其收回至手牌',
            excuteTime: [Steps.ProtagonistAbility],
        }
    ],
    thoughts: '在学校里很常见的班长，能力比较泛用，但也没那么好用，基本上是一个测试是否能够拒绝的位置',
    initialArea: [Area.School],
    forbiddenAreas: [],
    instability: 2,
    npcState: {
        currentArea: Area.School,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
}
