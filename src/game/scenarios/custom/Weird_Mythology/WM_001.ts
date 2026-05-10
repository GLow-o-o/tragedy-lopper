import type { Scenario } from '../../basicInfo_scenario';

export const WM_001: Scenario = {
  "id": "WM_001",
  "moduleId": "Weird_Mythology",
  "name": "校园飨宴",
  "difficulty": 1,
  "features": "",
  "story": "",
  "directorGuide": "",
  "ScenarioInfo": {
    "rule_Y": "WM_Y_Time_Bomb",
    "rule_X_1": "WM_X_Resisters",
    "rule_X_2": "WM_X_Rumors",
    "npcCount": 7,
    "roundCount": [
      3,
      4
    ],
    "dayCount": 4,
    "NpcRoles": [
      {
        "npcId": "npc_01",
        "roleId": "Conspiracy_Theorist",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_02",
        "roleId": "Witch",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_03",
        "roleId": "Serial_Killer",
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
        "npcId": "npc_09",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_10",
        "roleId": "Shaman",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_15",
        "roleId": "Deep_One",
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
        "incidentId": "WM_Disappearance",
        "personId": "npc_03",
        "specialEventFlag": "false"
      },
      {
        "day": 3,
        "incidentId": "WM_Evil_Pollution",
        "personId": "npc_06",
        "specialEventFlag": "false"
      },
      {
        "day": 4,
        "incidentId": "WM_Crazy_Killing",
        "personId": "npc_01",
        "specialEventFlag": "false"
      }
    ],
    "specialRules": null
  }
};

export default WM_001;