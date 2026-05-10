import type { Scenario } from '../../basicInfo_scenario';

export const HSA_001: Scenario = {
  "id": "HSA_001",
  "moduleId": "Haunted_Stage_Again",
  "name": "七大奇谭",
  "difficulty": 1,
  "features": "",
  "story": "",
  "directorGuide": "",
  "ScenarioInfo": {
    "rule_Y": "HSA_Y_Cursed_Land",
    "rule_X_1": "HSA_X_Panic_Delusion",
    "rule_X_2": "HSA_X_Girl_Crisis",
    "npcCount": 6,
    "roundCount": [
      3,
      4
    ],
    "dayCount": 4,
    "NpcRoles": [
      {
        "npcId": "npc_01",
        "roleId": "Witch",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_03",
        "roleId": "Ghost",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_04",
        "roleId": "Coward",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_06",
        "roleId": "Key_Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_09",
        "roleId": "Paper_Tiger",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_10",
        "roleId": "Serial_Killer",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
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
        "incidentId": "HSA_Disappearance",
        "personId": "npc_03",
        "specialEventFlag": "false"
      },
      {
        "day": 3,
        "incidentId": "HSA_Desecration_Murder",
        "personId": "npc_04",
        "specialEventFlag": "false"
      },
      {
        "day": 4,
        "incidentId": "HSA_Dead_Apologetics",
        "personId": "__tl_incident_crowd_school__",
        "specialEventFlag": "false"
      }
    ],
    "specialRules": null
  }
};

export default HSA_001;