import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Nurse: npc = {
    id: 'npc_17',
    name: '护士',
    roleType: [RoleType.Adult, RoleType.Female],
    img: 'assert/images/npcs/护士.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 2,
            abilityDescription: '移除同一区域不安达到或超出限度的另外1名角色身上的1枚不安指示物。即使带有无视友好特性也不能拒绝使用该能力。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
    ],
    thoughts: '为什么她有必定拒绝还能让主人公开出能力呢，因为她真的善',
    initialArea: [Area.Hospital],
    forbiddenAreas: [],
    instability: 3,
    npcState: {
        currentArea: Area.Hospital,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
}
