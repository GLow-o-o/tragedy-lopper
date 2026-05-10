import type { Scenario } from '../../basicInfo_scenario';

export const FS_001: Scenario = {
  "id": "FS_001",
  "moduleId": "First_Steps",
  "name": "初学者剧本",
  "difficulty": 1,
  "features": "初学者剧本剧本特征",
  "story": "初学者剧本故事背景",
  "directorGuide": "初学者剧本给剧作家的指引",
  "ScenarioInfo": {
    "rule_Y": "Murder_Plan",
    "rule_X_1": "Shadow_of_the_Ripper",
    "rule_X_2": "",
    "npcCount": 6,
    "roundCount": [
      3
    ],
    "dayCount": 3,
    "NpcRoles": [
      {
        "npcId": "npc_01",
        "roleId": "Person",
        "delayedAppearance": true,
        "appearanceTimingDescription": "111"
      },
      {
        "npcId": "npc_02",
        "roleId": "Key_Person"
      },
      {
        "npcId": "npc_06",
        "roleId": "Serial_Killer"
      },
      {
        "npcId": "npc_12",
        "roleId": "Conspiracy_Theorist"
      },
      {
        "npcId": "npc_10",
        "roleId": "Killer"
      },
      {
        "npcId": "npc_15",
        "roleId": "Brain"
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
        "incidentId": "Suicide",
        "personId": "npc_02",
        "specialEventFlag": "false"
      }
    ],
    "specialRules": null
  }
};

export default FS_001;
