import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Little_Sister: npc = {
    id: 'npc_31',
    name: '妹妹',
    roleType: [RoleType.Girl, RoleType.Little_Sister],
    img: 'assert/images/npcs/妹妹.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 5,
            abilityDescription: '同一区域的1名成人使用1个友好能力，此时无视该成人的友好指示物数量。即使该成人带有无视友好特性，也不能拒绝使用那个能力。但能力依然受到次数限制。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
    ],
    thoughts: '',
    initialArea: [Area.Shrine],
    forbiddenAreas: [],
    instability: 3,
    npcState: {
        currentArea: Area.Shrine,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['剧本制作时，该角色的身份不可以为有无视友好特性的身份'],
}
