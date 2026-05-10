import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Alien: npc = {
    id: 'npc_07',
    name: '异界人',
    roleType: [RoleType.Girl],
    img: 'assert/images/npcs/异界人.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 4,
            abilityDescription: '使同一区域另外1名角色死亡。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
,
        {
            id: 'ability_2',
            friendlyPoints: 5,
            abilityDescription: '复活同一区域任意1具尸体。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '去不了医院的异界人，难道去了医院就要被切片么',
    initialArea: [Area.Shrine],
    forbiddenAreas: [Area.City],
    instability: 2,
    npcState: {
        currentArea: Area.Shrine,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
}
