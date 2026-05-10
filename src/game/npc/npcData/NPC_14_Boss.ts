import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Boss: npc = {
    id: 'npc_14',
    name: '大人物',
    roleType: [RoleType.Adult, RoleType.Male],
    img: 'assert/images/npcs/大人物.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 5,
            abilityDescription: '公开领地中另外1名角色的身份。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '主人公的大麻烦，他的FAQ给剧作家也带来了大麻烦',
    initialArea: [Area.City],
    forbiddenAreas: [],
    instability: 4,
    npcState: {
        currentArea: Area.City,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['剧本制作时，指定1块版图，将领地标志放置在该版图。本局游戏中，所选定的版图视作大人物的领地。剧作家在使用该角色的能力时，可以将领地视作该角色所在区域。'],
    hasSpecialToken: true,
    specialToken: 'Turf',
    specialTokenDescription: '',
    specialTokenImage: 'assert/images/tokens/turf.png',
}
