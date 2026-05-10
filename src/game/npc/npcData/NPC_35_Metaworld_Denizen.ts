import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Metaworld_Denizen: npc = {
    id: 'npc_35',
    name: '上位存在',
    roleType: [RoleType.Girl],
    img: 'assert/images/npcs/上位存在.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '往同一区域任意1名角色身上放置1枚希望/绝望指示物。如果该角色具有无视友好的特性，并且身上已经放置了1枚或以上的友好指示物，则剧作家可以在剧作家能力阶段使用该能力。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '',
    initialArea: [Area.Shrine],
    forbiddenAreas: [],
    instability: 2,
    npcState: {
        currentArea: Area.Shrine,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
}
