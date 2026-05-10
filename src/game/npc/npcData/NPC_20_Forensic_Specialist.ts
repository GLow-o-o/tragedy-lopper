import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Forensic_Specialist: npc = {
    id: 'npc_20',
    name: '鉴别员',
    roleType: [RoleType.Adult, RoleType.Male],
    img: 'assert/images/npcs/鉴别员.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 2,
            abilityDescription: '选择同一区域另外2名角色，将1枚任意指示物在两者之间移动',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
,
        {
            id: 'ability_2',
            friendlyPoints: 5,
            abilityDescription: '公开1具尸体的身份',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '验尸，挪指示物，解谜本的常客',
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
}
