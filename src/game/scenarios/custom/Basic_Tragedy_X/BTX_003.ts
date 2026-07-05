import type { Scenario } from '../../basicInfo_scenario';

export const BTX_003: Scenario = {
  "id": "BTX_003",
  "moduleId": "Basic_Tragedy_X",
  "name": "来自未来的刺客",
  "difficulty": 1,
  "features": "",
  "story": "",
  "directorGuide": "",
  "ScenarioInfo": {
    "rule_Y": "Change_The_Future",
    "rule_X_1": "Lurking_Serial_Killer",
    "rule_X_2": "Friend_Circle",
    "npcCount": 9,
    "roundCount": [
      5,
      4
    ],
    "dayCount": 5,
    "NpcRoles": [
      {
        "npcId": "npc_02",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_04",
        "roleId": "Friend",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_06",
        "roleId": "Friend",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_07",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_11",
        "roleId": "Conspiracy_Theorist",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_12",
        "roleId": "Cultist",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_13",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_15",
        "roleId": "Serial_Killer",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "remark": ""
      },
      {
        "npcId": "npc_16",
        "roleId": "Time_Traveler",
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
        "incidentId": "Butterfly_Effect",
        "personId": "npc_04",
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
        "incidentId": "Faraway_Murder",
        "personId": "npc_15",
        "specialEventFlag": "false"
      },
      {
        "day": 5,
        "incidentId": "Hospital_Incident",
        "personId": "npc_11",
        "specialEventFlag": "false"
      }
    ],
    "specialRules": null
  }
};

export default BTX_003;