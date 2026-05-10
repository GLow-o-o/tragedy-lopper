import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Transfer_Student: npc = {
    id: 'npc_19',
    name: '转校生',
    roleType: [RoleType.Student, RoleType.Girl],
    img: 'assert/images/npcs/转校生.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 2,
            abilityDescription: '将同一区域另外1名角色身上的1枚密谋指示物替换为友好指示物。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
    ],
    thoughts: '突袭者2号，能力基本算是甜头？',
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
    features: ['剧本制作时，指定该角色在每轮轮回第几天登场。该角色不会在轮回准备时配置上场，在指定天数的回合开始阶段将该角色配置上场。'],
}
