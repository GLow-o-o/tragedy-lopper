import type { Scenario } from '../../basicInfo_scenario';

export const NEW_SCENARIO: Scenario = {
  "id": "NEW_SCENARIO",
  "moduleId": "Basic_Tragedy_X",
  "name": "新剧本",
  "difficulty": 1,
  "features": "1",
  "story": "1",
  "directorGuide": "1",
  "ScenarioInfo": {
    "rule_Y": "Murder_Plan",
    "rule_X_1": "Friend_Circle",
    "rule_X_2": "Love_Storm_Line",
    "npcCount": 9,
    "roundCount": [
      3
    ],
    "dayCount": 7,
    "NpcRoles": [
      {
        "npcId": "npc_01",
        "roleId": "Sweetheart",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_02",
        "roleId": "Suitor",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_10",
        "roleId": "Person",
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
      },
      {
        "npcId": "npc_06",
        "roleId": "Key_Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_03",
        "roleId": "Killer",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_11",
        "roleId": "Friend",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_15",
        "roleId": "Brain",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_16",
        "roleId": "Friend",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      }
    ],
    "incident_days": [
      {
        "day": 1,
        "incidentId": "",
        "personId": "",
        "specialEventFlag": "false"
      },
      {
        "day": 2,
        "incidentId": "Increasing_Unease",
        "personId": "npc_10",
        "specialEventFlag": "false"
      },
      {
        "day": 3,
        "incidentId": "",
        "personId": "",
        "specialEventFlag": "false"
      },
      {
        "day": 4,
        "incidentId": "Suicide",
        "personId": "npc_02",
        "specialEventFlag": "false"
      },
      {
        "day": 5,
        "incidentId": "Hospital_Incident",
        "personId": "npc_01",
        "specialEventFlag": "false"
      },
      {
        "day": 6,
        "incidentId": "",
        "personId": "",
        "specialEventFlag": "false"
      },
      {
        "day": 7,
        "incidentId": "Murder",
        "personId": "npc_09",
        "specialEventFlag": "false"
      }
    ],
    "specialRules": null
  }
};

export default NEW_SCENARIO;