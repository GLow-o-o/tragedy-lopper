import type { Scenario } from '../../basicInfo_scenario';

export const NEW_SCENARIO: Scenario = {
  "id": "NEW_SCENARIO",
  "moduleId": "First_Steps_Example",
  "name": "新剧本",
  "difficulty": 1,
  "features": "",
  "story": "",
  "directorGuide": "",
  "ScenarioInfo": {
    "rule_Y": "Light_of_the_Avenger",
    "rule_X_1": "A_Hideous_Script",
    "rule_X_2": "",
    "npcCount": 6,
    "roundCount": [
      3
    ],
    "dayCount": 2,
    "NpcRoles": [
      {
        "npcId": "npc_01",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_02",
        "roleId": "Curmudgeon",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_03",
        "roleId": "Friend",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_06",
        "roleId": "Brain",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_10",
        "roleId": "Curmudgeon",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_09",
        "roleId": "Conspiracy_Theorist",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      }
    ],
    "incident_days": [
      {
        "day": 1,
        "incidentId": "Suicide",
        "personId": "npc_03",
        "specialEventFlag": "false"
      },
      {
        "day": 2,
        "incidentId": "Missing_Person",
        "personId": "npc_10",
        "specialEventFlag": "false"
      }
    ],
    "specialRules": null
  }
};

export default NEW_SCENARIO;