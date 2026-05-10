import type { Scenario } from '../../basicInfo_scenario';

export const NEW_SCENARIO: Scenario = {
  "id": "NEW_SCENARIO",
  "moduleId": "First_Steps",
  "name": "新剧本",
  "difficulty": 1,
  "features": "",
  "story": "",
  "directorGuide": "",
  "ScenarioInfo": {
    "rule_Y": "Murder_Plan",
    "rule_X_1": "Shadow_of_the_Ripper",
    "rule_X_2": "Gossip_Spread",
    "npcCount": 7,
    "roundCount": [
      3
    ],
    "dayCount": 3,
    "NpcRoles": [
      {
        "npcId": "npc_01",
        "roleId": "Killer",
        "delayedAppearance": true,
        "appearanceTimingDescription": "111"
      },
      {
        "npcId": "npc_02",
        "roleId": "Key_Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_06",
        "roleId": "Brain",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_12",
        "roleId": "Conspiracy_Theorist",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_10",
        "roleId": "Serial_Killer",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_15",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_14",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      }
    ],
    "incident_days": [
      {
        "day": 1,
        "incidentId": "Murder",
        "personId": "npc_01",
        "specialEventFlag": "false"
      },
      {
        "day": 2,
        "incidentId": "",
        "personId": "",
        "specialEventFlag": "false"
      },
      {
        "day": 3,
        "incidentId": "",
        "personId": "",
        "specialEventFlag": "false"
      }
    ],
    "specialRules": null
  }
};

export default NEW_SCENARIO;
