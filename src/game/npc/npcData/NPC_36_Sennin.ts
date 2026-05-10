import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Sennin: npc = {
    id: 'npc_36',
    name: '仙人',
    roleType: [RoleType.Adult, RoleType.Male],
    img: 'assert/images/npcs/仙人.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 5,
            abilityDescription: '将该角色移动至任意版图或远方。随后，复活同一区域任意1具尸体，并在那张卡牌上放置X枚友好指示物。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '',
    initialArea: [Area.Shrine, Area.Hospital],
    forbiddenAreas: [],
    instability: 'x' as unknown as number,//将这个字段改成可以使用‘x’作为不安限度
    npcState: {
        currentArea: null,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['X为剧本规定的数值。在事件判定之外需要参照该角色的不安限度时，该角色的不安限度视为0。', '结算该角色担任当事人的事件时，该角色可以视为位于本来所在位置顺时针相邻的版图。'],
}
