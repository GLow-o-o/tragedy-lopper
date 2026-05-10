import { Scenario } from "../basicInfo_scenario";
import { firstSteps_Example } from "../../modules/firstSteps_Example/First_Steps_Example";
import { rulesIndex } from "../../modules/firstSteps_Example/rules";
import { npcIndex } from "../../npc/npcIndex";
import { rolesIndex } from "../../modules/firstSteps_Example/roles";
import { Person } from "../../modules/basicInfo/basicInfo_role";
import { incidentsIndex } from "../../modules/firstSteps_Example/incidents";

export const fs_001: Scenario = {
  id: 'FS_001',
  moduleId: firstSteps_Example.id,
  name: '初学者剧本',
  difficulty: 1,
  features: '初学者剧本剧本特征',
  story: '初学者剧本故事背景',
  directorGuide: '初学者剧本给剧作家的指引',
  ScenarioInfo: {
    rule_Y: rulesIndex.Murder_Plan.ruleId,//规则Y：谋杀计划
    rule_X_1: rulesIndex.Shadow_of_the_Ripper.ruleId,//规则X1：开膛者的魔影
    rule_X_2: '',//规则X2：无规则
    npcCount: 6,//NPC数量：6
    roundCount: [3],//剧本轮回总数：3轮、4轮
    dayCount: 3,//一个轮回中的天数：3天
    NpcRoles: [//NPC对应的身份id
      { npcId: npcIndex.Boy_Student.id, roleId: Person.roleId },//男学生-平民
      { npcId: npcIndex.Girl_Student.id, roleId: rolesIndex.Key_Person.roleId },//女学生-关键人物
      { npcId: npcIndex.Shrine_Maiden.id, roleId: rolesIndex.Serial_Killer.roleId },//巫女-杀人狂
      { npcId: npcIndex.Pop_Idol.id, roleId: rolesIndex.Conspiracy_Theorist.roleId },//偶像-传谣人
      { npcId: npcIndex.Office_Worker.id, roleId: rolesIndex.Killer.roleId },//职员-杀手
      { npcId: npcIndex.Doctor.id, roleId: rolesIndex.Brain.roleId }//医生-主谋
    ],
    incident_days: [//事件发生天数
      { day: 1, incidentId: '', personId: '', specialEventFlag: 'false' },//第一天：无事件
      { day: 2, incidentId: '', personId: '', specialEventFlag: 'false' },//第二天：无事件
      { day: 3, incidentId: incidentsIndex.Suicide.incidentId, personId: npcIndex.Girl_Student.id, specialEventFlag: 'false' },//第三天：自杀
    ],
    specialRules: null
  }
};