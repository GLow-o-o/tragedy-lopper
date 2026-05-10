import type { Scenario } from '../../basicInfo_scenario';

export const LL_001: Scenario = {
  "id": "LL_001",
  "moduleId": "Last_Lair",
  "name": "无法言说的秘密",
  "difficulty": 1,
  "features": "",
  "story": "",
  "directorGuide": "",
  "ScenarioInfo": {
    "rule_Y": "LL_Y_Time_Bomb_Z",
    "rule_X_1": "LL_X_Myth_Collector",
    "rule_X_2": "LL_X_Fabricated_Secret",
    "npcCount": 10,
    "roundCount": [
      3
    ],
    "dayCount": 5,
    "NpcRoles": [
      {
        "npcId": "npc_02",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_04",
        "roleId": "Person",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_22",
        "roleId": "Witch",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_07",
        "roleId": "Net_Celebrity",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_08",
        "roleId": "Secret_Key",
        "delayedAppearance": true,
        "appearanceTimingDescription": "第3轮"
      },
      {
        "npcId": "npc_35",
        "roleId": "Conspiracy_Theorist",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_10",
        "roleId": "Eccentric",
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
        "npcId": "npc_12",
        "roleId": "Brain",
        "delayedAppearance": false,
        "appearanceTimingDescription": ""
      },
      {
        "npcId": "npc_23",
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
        "incidentId": "LL_Sudden_Outburst",
        "personId": "npc_07",
        "specialEventFlag": "false"
      },
      {
        "day": 3,
        "incidentId": "LL_Proxy",
        "personId": "npc_10",
        "specialEventFlag": "false"
      },
      {
        "day": 4,
        "incidentId": "LL_Anxiety_Spread",
        "personId": "npc_04",
        "specialEventFlag": "false"
      },
      {
        "day": 5,
        "incidentId": "LL_Disappearance",
        "personId": "npc_11",
        "specialEventFlag": "false"
      }
    ],
    "specialRules": null
  }
};

export default LL_001;