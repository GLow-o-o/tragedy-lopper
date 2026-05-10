import type { Scenario } from '../../basicInfo_scenario';

export const MZ_001: Scenario = {
  "id": "MZ_001",
  "moduleId": "Midnight_Zone",
  "name": "爱与友情的对立面",
  "difficulty": 1,
  "features": "",
  "story": "",
  "directorGuide": "",
  "ScenarioInfo": {
    "rule_Y": "MZ_Y_Mans_War",
    "rule_X_1": "MZ_X_X_Factor",
    "rule_X_2": "MZ_X_Edge_Love_Hate",
    "npcCount": 7,
    "roundCount": [
      3,
      4
    ],
    "dayCount": 5,
    "NpcRoles": [
      {
        "npcId": "npc_01",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_02",
        "roleId": "OCD",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_03",
        "roleId": "Friend",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_06",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_07",
        "roleId": "Unstable_Factor",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_09",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_10",
        "roleId": "Ninja",
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
        "incidentId": "Confession",
        "personId": "npc_03",
        "specialEventFlag": "false"
      },
      {
        "day": 3,
        "incidentId": "Confession",
        "personId": "npc_10",
        "specialEventFlag": "false"
      },
      {
        "day": 4,
        "incidentId": "Unease_Spread_To_Board",
        "personId": "npc_02",
        "specialEventFlag": "false"
      },
      {
        "day": 5,
        "incidentId": "",
        "personId": "",
        "specialEventFlag": "false"
      }
    ],
    "specialRules": null
  }
};

export default MZ_001;