/**
 * 惨剧轮回 - firstSteps_Example 示例模组
 * 定义与「First Steps」规则集一致的示例规则、身份和事件
 */

import { ModuleBasicInfo } from "../basicInfo/basicInfo_module";
import {
    Murder_Plan,//谋杀计划
    Light_of_the_Avenger,//复仇的火种
    A_Place_To_Protect,//守护此地
    Shadow_of_the_Ripper,//开膛者的魔影
    Gossip_Spread,//流言四起
    A_Hideous_Script//最黑暗的剧本
} from "./rules"

import {
    Key_Person,//关键人物
    Killer,//杀手
    Brain,//主谋
    Cultist,//邪教徒
    Conspiracy_Theorist,//传谣人
    Serial_Killer,//杀人狂
    Curmudgeon,//暴徒
    Friend//亲友
} from "./roles";
import {
    Murder,//谋杀
    IncreasingUnease,//不安扩散
    Suicide,//自杀
    Hospital_Incident,//医院事故
    Faraway_Murder,//远距离杀人
    Missing_Person,//失踪
    Spreading//散播
} from "./incidents";


export const First_Steps_Example: ModuleBasicInfo = {
    id: 'First_Steps_Example',
    fullName: 'First Steps Example',
    shortName: 'FSE',
    description: '初学者使用的模组，只有3条规则Y和3条规则X',
    rules: [Murder_Plan, Light_of_the_Avenger, A_Place_To_Protect, Shadow_of_the_Ripper, Gossip_Spread, A_Hideous_Script],
    roles: [Key_Person, Killer, Brain, Cultist, Conspiracy_Theorist, Serial_Killer, Curmudgeon, Friend],
    incidents: [Murder, IncreasingUnease, Suicide, Hospital_Incident, Faraway_Murder, Missing_Person, Spreading],
};

/** 与旧导入名兼容 */
export const firstSteps_Example = First_Steps_Example;

export default First_Steps_Example;
