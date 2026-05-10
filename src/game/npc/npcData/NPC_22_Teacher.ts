import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Teacher: npc = {
    id: 'npc_22',
    name: '教师',
    roleType: [RoleType.Adult, RoleType.Female],
    img: 'assert/images/npcs/教师.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '放置/移除同一区域1名学生身上的1枚不安指示物。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
,
        {
            id: 'ability_2',
            friendlyPoints: 4,
            abilityDescription: '公开同一区域1名学生的身份。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '学校的常见角色，点名喊到样样精通',
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
