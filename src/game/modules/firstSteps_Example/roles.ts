// firstSteps_Example 模组的角色信息

import { RoleBasicInfo } from "../basicInfo/basicInfo_role";

// 关键人物
export const Key_Person: RoleBasicInfo =
{
    roleId: 'Key_Person',
    roleName: '关键人物',
    maxCount: '',
    features: [],
    abilitys: [
        {
            abilityId: 'ability1',
            abilityType: '强制',
            description: '【强制：该角色死亡时】主人公失败，当前轮回立即结束',
        }
    ]

}
// 杀手
export const Killer: RoleBasicInfo =
{
    roleId: 'Killer',
    roleName: '杀手',
    maxCount: '',
    features: ['无视友好'],
    abilitys: [
        {
            abilityId: 'ability1',
            abilityType: '任意能力',
            description: '【任意能力：回合结束阶段】同一区域1名关键人物身上有2枚或以上[密谋]→那名关键人物死亡',
        },
        {
            abilityId: 'ability2',
            abilityType: '任意能力',
            description: '【任意能力：回合结束阶段】该角色身上有4枚或以上[密谋]→主人公死亡',
        }
    ]
}
// 主谋
export const Brain: RoleBasicInfo = {
    roleId: 'Brain',
    roleName: '主谋',
    maxCount: '',
    features: ['无视友好'],
    abilitys: [
        {
            abilityId: 'ability1',
            abilityType: '任意能力',
            description: '【任意能力：剧作家能力阶段】在同一区域的任意一名角色身上，或该角色所在版图上放置1枚[密谋]'
        }
    ]

}
// 邪教徒
export const Cultist: RoleBasicInfo =
{
    roleId: 'Cultist',
    roleName: '邪教徒',
    maxCount: '',
    features: ['必定无视友好'],
    abilitys: [
        {
            abilityId: 'ability1',
            abilityType: '任意能力',
            description: '【任意能力：行动结算阶段】可以无效化同一区域内任意角色身上及其所在版图上被放置的密谋'
        }
    ]
}
// 传谣人
export const Conspiracy_Theorist: RoleBasicInfo =
{
    roleId: 'Conspiracy_Theorist',
    roleName: '传谣人',
    maxCount: 1,
    features: [],
    abilitys: [
        {
            abilityId: 'ability1',
            abilityType: '任意能力',
            description: '【任意能力：剧作家能力阶段】在同一区域内任意1名角色身上放置1枚[不安]'
        }
    ]
}
// 杀人狂
export const Serial_Killer: RoleBasicInfo =
{
    roleId: 'Serial_Killer',
    roleName: '杀人狂',
    maxCount: '',
    features: [],
    abilitys: [
        {
            abilityId: 'ability1',
            abilityType: '强制',
            description: '【强制：回合结束阶段】若仅有1名其他角色与该角色位于同一区域，则该角色死亡'
        }
    ]
}
// 暴徒
export const Curmudgeon: RoleBasicInfo =
{
    roleId: 'Curmudgeon',
    roleName: '暴徒',
    maxCount: '',
    features: ['无视友好'],
    abilitys: []
}
// 亲友
export const Friend: RoleBasicInfo =
{
    roleId: 'Friend',
    roleName: '亲友',
    maxCount: 2,
    features: [],
    abilitys: [
        {
            abilityId: 'ability1',
            abilityType: '失败条件',
            description: '【失败条件：轮回结束时】若该卡牌为死亡状态，则需向主人公告知该卡牌身份；'
        },
        {
            abilityId: 'ability2',
            abilityType: '强制',
            description: '【强制：轮回开始时】该角色身份曾被公开→往该角色身上放置1枚[友好]'
        }
    ]
}

export const rolesIndex = {
    Key_Person: Key_Person,
    Killer: Killer,
    Brain: Brain,
    Cultist: Cultist,
    Conspiracy_Theorist: Conspiracy_Theorist,
    Serial_Killer: Serial_Killer,
    Curmudgeon: Curmudgeon,
    Friend: Friend
}