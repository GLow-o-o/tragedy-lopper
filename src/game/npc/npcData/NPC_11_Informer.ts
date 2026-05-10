import { Area } from "../../basicData/areas";
import { Steps } from "../../basicData/steps";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Informer: npc = {
    id: 'npc_11',
    name: '情报商',
    roleType: [RoleType.Adult, RoleType.Female],
    img: 'assert/images/npcs/情报商.png',
    abilitys: [
        {
            id: 'ability_1',
            friendlyPoints: 5,
            abilityDescription: '声明1条规则X的名称。剧作家从当前剧本所选用的规则X中，公开1条主人公未声明的规则X。',
            excuteTime: [Steps.ProtagonistAbility],
            useLimitDay: 1,
            useLimitRoope: 1,
        }
    ],
    thoughts: '能力看似很强但用途并不多啊，基本属于是隐藏拒绝的角色，啊，WM另说',
    initialArea: [Area.City],
    forbiddenAreas: [],
    instability: 3,
    npcState: {
        currentArea: Area.City,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
}
