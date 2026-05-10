import type { Scenario } from '../../basicInfo_scenario';

export const MC_001: Scenario = {
  "id": "MC_001",
  "moduleId": "Mystery_Circle",
  "name": "妄念探测",
  "difficulty": 1,
  "features": "",
  "story": "",
  "directorGuide": "",
  "ScenarioInfo": {
    "rule_Y": "MC_Y_Dark_Academy",
    "rule_X_1": "MC_X_Twin_Trick",
    "rule_X_2": "MC_X_Dance_Of_Fool",
    "npcCount": 8,
    "roundCount": [
      4
    ],
    "dayCount": 5,
    "NpcRoles": [
      {
        "npcId": "npc_01",
        "roleId": "Brain",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_03",
        "roleId": "Fool",
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
        "roleId": "Twin",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_09",
        "roleId": "Paranoid",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_10",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_13",
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
        "incidentId": "MC_Collapse",
        "personId": "npc_03",
        "specialEventFlag": "false"
      },
      {
        "day": 2,
        "incidentId": "MC_Silver_Bullet",
        "personId": "npc_09",
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
        "incidentId": "MC_Hospital",
        "personId": "npc_06",
        "specialEventFlag": "false"
      },
      {
        "day": 5,
        "incidentId": "MC_Serial_Killing",
        "personId": "npc_07",
        "specialEventFlag": "false"
      }
    ],
    "specialRules": null
  }
};

export default MC_001;