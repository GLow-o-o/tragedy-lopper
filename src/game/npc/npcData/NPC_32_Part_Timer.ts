import { Area } from "../../basicData/areas";
import { RoleType } from "../../basicData/roleTypes";
import { npc } from "../basicInfo_npc";

export const Part_Timer: npc = {
    id: 'npc_32',
    name: '临时工',
    roleType: [RoleType.Adult, RoleType.Male],
    img: 'assert/images/npcs/临时工.png',
    thoughts: '有些人工作做着做着人就累死了',
    initialArea: [Area.City],
    forbiddenAreas: [],
    instability: 1,
    npcState: {
        currentArea: Area.City,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true
    },
    features: ['该卡牌的身份为平民（无视其原本所配置的身份）。', '回合结束阶段，如果该角色总共有3枚或以上的任意指示物，该角色死亡。', '回合开始阶段，如果该卡牌为死亡状态，则将临时工？在都市配置上场'],
}
