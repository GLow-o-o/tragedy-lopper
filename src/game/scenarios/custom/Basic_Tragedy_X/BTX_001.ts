import type { Scenario } from '../../basicInfo_scenario';

export const BTX_001: Scenario = {
  "id": "BTX_001",
  "moduleId": "Basic_Tragedy_X",
  "name": "没有神灵的神宫",
  "difficulty": 1,
  "features": "",
  "story": "",
  "directorGuide": "",
  "ScenarioInfo": {
    "rule_Y": "Sign_The_Contract",
    "rule_X_1": "Lurking_Serial_Killer",
    "rule_X_2": "Rumors_Everywhere",
    "npcCount": 7,
    "roundCount": [
      3,
      4
    ],
    "dayCount": 5,
    "NpcRoles": [
      {
        "npcId": "npc_01",
        "roleId": "Serial_Killer",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_03",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_22",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_06",
        "roleId": "Friend",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_12",
        "roleId": "Key_Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_15",
        "roleId": "Conspiracy_Theorist",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_16",
        "roleId": "Person",
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
        "incidentId": "Increasing_Unease",
        "personId": "npc_16",
        "specialEventFlag": "false"
      },
      {
        "day": 3,
        "incidentId": "Hospital_Incident",
        "personId": "npc_06",
        "specialEventFlag": "false"
      },
      {
        "day": 4,
        "incidentId": "",
        "personId": "",
        "specialEventFlag": "false"
      },
      {
        "day": 5,
        "incidentId": "Missing_Person",
        "personId": "npc_01",
        "specialEventFlag": "false"
      }
    ],
    "specialRules": null
  }
};

export default BTX_001;