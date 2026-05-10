import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Copycat: npc = {
    id: 'npc_29',
    name: '模仿犯',
    roleType: [RoleType.Student, RoleType.Boy],
    img: 'assert/images/npcs/模仿犯.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 3,
            abilityDescription: '必须在第2轮轮回或之后才可以使用。公开场上与该角色身份相同的所有角色名。即使带有无视友好特性，也不能拒绝使用该能力。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
        }
    ],
    thoughts: ' 跟他哥哥（局外人）一样的搅屎棍，这是什么身份，抄一下',
    initialArea: [Area.City],
    forbiddenAreas: [],
    instability: 2,
    npcState: {
        currentArea: Area.City,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['剧本制作时，该角色不参与剧本所选规则的身份分配，但不直接视作平民，而是选择剧本中的另外1名角色、将那名角色的身份额外分配给该角色（此时，无视模组规定的剧本身份上限）'],
}
