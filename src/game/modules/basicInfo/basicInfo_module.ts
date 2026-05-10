/**
 * 惨剧轮回 - 模组数据
 * 定义游戏的不同模组
 */

import { RuleBasicInfo } from "./basicInfo_rule";
import { RoleBasicInfo } from "./basicInfo_role";
import { IncidentBasicInfo } from "./basicInfo_incident";


// 模组信息接口
export interface ModuleBasicInfo {
    id: string;//用于唯一标识模组
    fullName: string;//模组的全称
    shortName: string;//模组的简称，用于界面显示
    description: string;//模组的描述
    rules: RuleBasicInfo[];//模组规则的基础信息列表
    roles: RoleBasicInfo[];//模组身份的基础信息列表
    incidents: IncidentBasicInfo[];//模组事件的基础信息列表
    //ExSlot槽位名称
    exSlot?: {
        name: string;//槽位名称
        description: string;//槽位描述
    };

}










