import type { Scenario } from '../../basicInfo_scenario';

export const FS_002: Scenario = {
  "id": "FS_002",
  "moduleId": "First_Steps",
  "name": "没有神灵的神宫",
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
    "dayCount": 4,
    "NpcRoles": [
      {
        "npcId": "npc_06",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_07",
        "roleId": "Brain",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_09",
        "roleId": "Conspiracy_Theorist",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_10",
        "roleId": "Curmudgeon",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_12",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_16",
        "roleId": "Friend",
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
        "incidentId": "Missing_Person",
        "personId": "npc_10",
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
      }
    ],
    "specialRules": null
  }
};

export default FS_002;
