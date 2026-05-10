import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Servant: npc = {
    id: 'npc_34',
    name: '从者',
    roleType: [RoleType.Adult, RoleType.Female],
    img: 'assert/images/npcs/从者.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 4,
            abilityDescription: '选择场上的另外1名角色，本轮轮回中，将那名角色追加至特性适用对象中。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '',
    initialArea: [Area.City, Area.School],
    forbiddenAreas: [],
    instability: 3,
    npcState: {
        currentArea: Area.City,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['同一区域的大人物或大小姐移动时，无视自身移动并跟随那名角色移动（如果多名角色同时移动，由主人公选择跟随哪名角色）。同一区域的大人物或大小姐死亡时，代替那名角色死亡'],
    hasSpecialToken: true,
    specialToken: 'Loyalty',
    specialTokenDescription: '',
    specialTokenImage: 'assert/images/tokens/loyalty.png',
}
