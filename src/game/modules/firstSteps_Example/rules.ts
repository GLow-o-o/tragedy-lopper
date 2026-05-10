//** firstSteps_Example 模组的规则信息 */

import { RuleBasicInfo } from "../basicInfo/basicInfo_rule";
import { Key_Person, Killer, Brain, Cultist, Conspiracy_Theorist, Serial_Killer, Curmudgeon, Friend } from "./roles";

//谋杀计划
export const Murder_Plan: RuleBasicInfo = {
    ruleId: 'Murder_Plan',
    ruleName: '谋杀计划',
    rolesLimits:
        [
            { roleId: Key_Person.roleId, roleName: Key_Person.roleName, maxCount: 1 },
            { roleId: Killer.roleId, roleName: Killer.roleName, maxCount: 1 },
            { roleId: Brain.roleId, roleName: Brain.roleName, maxCount: 1 },
            { roleId: Cultist.roleId, roleName: Cultist.roleName, maxCount: '' },
            { roleId: Conspiracy_Theorist.roleId, roleName: Conspiracy_Theorist.roleName, maxCount: '' },
            { roleId: Serial_Killer.roleId, roleName: Serial_Killer.roleName, maxCount: '' },
            { roleId: Curmudgeon.roleId, roleName: Curmudgeon.roleName, maxCount: '' },
            { roleId: Friend.roleId, roleName: Friend.roleName, maxCount: '' }
        ],
    ruleType: 'Y',
    addRules: []
}
//复仇的火种
export const Light_of_the_Avenger: RuleBasicInfo = {
    ruleId: 'Light_of_the_Avenger',
    ruleName: '复仇的火种',
    rolesLimits:
        [
            { roleId: Key_Person.roleId, roleName: Key_Person.roleName, maxCount: '' },
            { roleId: Killer.roleId, roleName: Killer.roleName, maxCount: '' },
            { roleId: Brain.roleId, roleName: Brain.roleName, maxCount: 1 },
            { roleId: Cultist.roleId, roleName: Cultist.roleName, maxCount: '' },
            { roleId: Conspiracy_Theorist.roleId, roleName: Conspiracy_Theorist.roleName, maxCount: '' },
            { roleId: Serial_Killer.roleId, roleName: Serial_Killer.roleName, maxCount: '' },
            { roleId: Curmudgeon.roleId, roleName: Curmudgeon.roleName, maxCount: '' },
            { roleId: Friend.roleId, roleName: Friend.roleName, maxCount: '' }
        ],
    ruleType: 'Y',
    addRules: [
        {
            ruleId: 'addRule_01',
            description: '【任意能力：剧作家能力阶段】往同一区域内任意1名角色身上放置1枚[密谋]（每轮限1次）'
        }
    ]
}
//守护此地
export const A_Place_To_Protect: RuleBasicInfo = {
    ruleId: 'A_Place_To_Protect',
    ruleName: '守护此地',
    rolesLimits:
        [
            { roleId: Key_Person.roleId, roleName: Key_Person.roleName, maxCount: 1 },
            { roleId: Killer.roleId, roleName: Killer.roleName, maxCount: '' },
            { roleId: Brain.roleId, roleName: Brain.roleName, maxCount: '' },
            { roleId: Cultist.roleId, roleName: Cultist.roleName, maxCount: 1 },
            { roleId: Conspiracy_Theorist.roleId, roleName: Conspiracy_Theorist.roleName, maxCount: '' },
            { roleId: Serial_Killer.roleId, roleName: Serial_Killer.roleName, maxCount: '' },
            { roleId: Curmudgeon.roleId, roleName: Curmudgeon.roleName, maxCount: '' },
            { roleId: Friend.roleId, roleName: Friend.roleName, maxCount: '' }
        ],
    ruleType: 'Y',
    addRules: [
        {
            ruleId: 'addRule_01',
            description: '【失败条件：轮回结束时】学校有2枚或以上[密谋]'
        }
    ]
}
//开膛者的魔影
export const Shadow_of_the_Ripper: RuleBasicInfo = {
    ruleId: 'Shadow_of_the_Ripper',
    ruleName: '开膛者的魔影',
    rolesLimits: [
        { roleId: Key_Person.roleId, roleName: Key_Person.roleName, maxCount: '' },
        { roleId: Killer.roleId, roleName: Killer.roleName, maxCount: '' },
        { roleId: Brain.roleId, roleName: Brain.roleName, maxCount: '' },
        { roleId: Cultist.roleId, roleName: Cultist.roleName, maxCount: '' },
        { roleId: Conspiracy_Theorist.roleId, roleName: Conspiracy_Theorist.roleName, maxCount: 1 },
        { roleId: Serial_Killer.roleId, roleName: Serial_Killer.roleName, maxCount: 1 },
        { roleId: Curmudgeon.roleId, roleName: Curmudgeon.roleName, maxCount: '' },
        { roleId: Friend.roleId, roleName: Friend.roleName, maxCount: '' }
    ],
    ruleType: 'X',
    addRules: []
}
//流言四起
export const Gossip_Spread: RuleBasicInfo = {
    ruleId: 'Gossip_Spread',
    ruleName: '流言四起', rolesLimits: [
        { roleId: Key_Person.roleId, roleName: Key_Person.roleName, maxCount: '' },
        { roleId: Killer.roleId, roleName: Killer.roleName, maxCount: '' },
        { roleId: Brain.roleId, roleName: Brain.roleName, maxCount: '' },
        { roleId: Cultist.roleId, roleName: Cultist.roleName, maxCount: '' },
        { roleId: Conspiracy_Theorist.roleId, roleName: Conspiracy_Theorist.roleName, maxCount: 1 },
        { roleId: Serial_Killer.roleId, roleName: Serial_Killer.roleName, maxCount: '' },
        { roleId: Curmudgeon.roleId, roleName: Curmudgeon.roleName, maxCount: '' },
        { roleId: Friend.roleId, roleName: Friend.roleName, maxCount: '' }
    ],
    ruleType: 'X',
    addRules: [
        {
            ruleId: 'addRule_01',
            description: '【任意能力：剧作家能力阶段】往任意1块版图上放置1枚[密谋]（每轮限1次）'
        }
    ]
}
// 谋杀计划
export const A_Hideous_Script: RuleBasicInfo = {
    ruleId: 'A_Hideous_Script',
    ruleName: '最黑暗的剧本',
    rolesLimits: [
        { roleId: Key_Person.roleId, roleName: Key_Person.roleName, maxCount: '' },
        { roleId: Killer.roleId, roleName: Killer.roleName, maxCount: '' },
        { roleId: Brain.roleId, roleName: Brain.roleName, maxCount: '' },
        { roleId: Cultist.roleId, roleName: Cultist.roleName, maxCount: '' },
        { roleId: Conspiracy_Theorist.roleId, roleName: Conspiracy_Theorist.roleName, maxCount: 1 },
        { roleId: Serial_Killer.roleId, roleName: Serial_Killer.roleName, maxCount: '' },
        { roleId: Curmudgeon.roleId, roleName: Curmudgeon.roleName, maxCount: 2 },
        { roleId: Friend.roleId, roleName: Friend.roleName, maxCount: 1 }
    ],
    ruleType: 'X',
    addRules: [
        {
            ruleId: 'addRule_01',
            description: '【任意能力：剧本制作时】剧本制作时，暴徒的人数可以为0-2人'
        }
    ]
}

export const rulesIndex = {
    Murder_Plan: Murder_Plan,
    Light_of_the_Avenger: Light_of_the_Avenger,
    A_Place_To_Protect: A_Place_To_Protect,
    Shadow_of_the_Ripper: Shadow_of_the_Ripper,
    Gossip_Spread: Gossip_Spread,
    A_Hideous_Script: A_Hideous_Script
}