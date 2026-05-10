import { Area } from "../../basicData/areas";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Patient: npc = {
    id: 'npc_16',
    name: '住院患者',
    roleType: [RoleType.Boy],
    img: 'assert/images/npcs/住院患者.png',
    thoughts: '',
    initialArea: [Area.Hospital],
    forbiddenAreas: [Area.City, Area.School, Area.Shrine],
    instability: 2,
    npcState: {
        currentArea: Area.Hospital,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['首席柱子1号'],
}
