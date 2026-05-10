import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const AI: npc = {
    id: 'npc_21',
    name: 'A.I.',
    roleType: [RoleType.Construct],
    img: 'assert/images/npcs/ai.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '选择公开信息表中记述的1个事件，处理该事件的效果。处理时，当事人默认为A.I.，且一切需要剧作家决定的内容由队长代为决定（所选事件本身不视作已发生）。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '柱子2号，主人公之友，天天开医院事故和谋杀的罪魁祸首',
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
    features: ['剧本制作时，该角色不能为“平民”。', '判定该角色为当事人的事件是否发生时，该角色身上的所有指示物都视作不安指示物。'],
}
