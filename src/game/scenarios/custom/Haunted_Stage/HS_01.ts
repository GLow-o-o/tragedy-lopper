import type { Scenario } from '../../basicInfo_scenario';

export const HS_01: Scenario = {
  "id": "HS_01",
  "moduleId": "Haunted_Stage",
  "name": "墓碑计数",
  "difficulty": 1,
  "features": "",
  "story": "",
  "directorGuide": "",
  "ScenarioInfo": {
    "rule_Y": "Rule_5",
    "rule_X_1": "Rule_11",
    "rule_X_2": "Rule_9",
    "npcCount": 9,
    "roundCount": [
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
        "roleId": "Role_1",
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
        "npcId": "npc_09",
        "roleId": "Role_11",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_10",
        "roleId": "Role_7",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_11",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_06",
        "roleId": "Role_7",
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
        "incidentId": "Incident_9",
        "personId": "npc_03",
        "specialEventFlag": "true"
      },
      {
        "day": 3,
        "incidentId": "Incident_9",
        "personId": "npc_06",
        "specialEventFlag": "true"
      },
      {
        "day": 4,
        "incidentId": "",
        "personId": "",
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

export default HS_01;