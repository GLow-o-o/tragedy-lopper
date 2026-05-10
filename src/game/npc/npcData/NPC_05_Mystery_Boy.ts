import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Mystery_Boy: npc = {
    id: 'npc_05',
    name: '局外人',
    roleType: [RoleType.Student, RoleType.Boy],
    img: 'assert/images/npcs/局外人.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '必须在第2轮轮回或之后才可以使用。公开该角色的身份。即使带有无视友好特性，也不能拒绝行使该能力。',
            excuteTime: [Steps.ProtagonistAbility],
        }
    ],
    thoughts: '能力使用后可以给予规则XY的提示，但是最终决战也要猜测，而且追加的身份一般很麻烦，属于搅屎棍的类型',
    initialArea: [Area.School],
    forbiddenAreas: [],
    instability: 3,
    npcState: {
        currentArea: Area.School,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['剧本制作时，该角色不参与剧本所选规则的身份分配，但不直接视作平民，而是为其分配当前模组中存在、并且剧本所选规则中未带有的某一身份'],
}
