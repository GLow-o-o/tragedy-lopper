import type { Scenario } from '../../basicInfo_scenario';

export const AHR_001: Scenario = {
  "id": "AHR_001",
  "moduleId": "Another_Horizon_Revised",
  "name": "Beyond Praying Stage",
  "difficulty": 1,
  "features": "",
  "story": "",
  "directorGuide": "",
  "ScenarioInfo": {
    "rule_Y": "AHR_Y_Illusory_World",
    "rule_X_1": "AHR_X_Jekyll_Hyde",
    "rule_X_2": "AHR_X_Alice",
    "npcCount": 9,
    "roundCount": [
      3,
      4
    ],
    "dayCount": 4,
    "NpcRoles": [
      {
        "npcId": "npc_02",
        "roleId": "Alice",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "roleIds": [
          "Alice",
          "Person"
        ]
      },
      {
        "npcId": "npc_03",
        "roleId": "Key_Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "roleIds": [
          "Key_Person",
          "Brain"
        ]
      },
      {
        "npcId": "npc_04",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "roleIds": [
          "Person",
          "Person"
        ]
      },
      {
        "npcId": "npc_06",
        "roleId": "Puppeteer",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "roleIds": [
          "Puppeteer",
          "Puppeteer"
        ]
      },
      {
        "npcId": "npc_10",
        "roleId": "Puppeteer",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "roleIds": [
          "Puppeteer",
          "Puppeteer"
        ]
      },
      {
        "npcId": "npc_12",
        "roleId": "OCD",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "roleIds": [
          "OCD",
          "OCD"
        ]
      },
      {
        "npcId": "npc_32",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "roleIds": [
          "Person",
          "Person"
        ]
      },
      {
        "npcId": "npc_33",
        "roleId": "Brain",
        "delayedAppearance": true,
        "appearanceTimingDescription": "临时工死亡后的下一天",
        "roleIds": [
          "Brain",
          "Brain"
        ]
      },
      {
        "npcId": "npc_23",
        "roleId": "Conspiracy_Theorist",
        "delayedAppearance": false,
        "appearanceTimingDescription": "",
        "roleIds": [
          "Conspiracy_Theorist",
          "Serial_Killer"
        ]
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
        "incidentId": "",
        "personId": "",
        "specialEventFlag": "false"
      },
      {
        "day": 3,
        "incidentId": "AHR_Deception",
        "personId": "npc_03",
        "specialEventFlag": "false"
      },
      {
        "day": 4,
        "incidentId": "AHR_Impulse_Killing",
        "personId": "npc_12",
        "specialEventFlag": "false"
      }
    ],
    "specialRules": null
  }
};

export default AHR_001;