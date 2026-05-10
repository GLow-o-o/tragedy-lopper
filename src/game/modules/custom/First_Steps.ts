import { ModuleBasicInfo } from '../basicInfo/basicInfo_module';

export const First_Steps: ModuleBasicInfo = {
  "id": "First_Steps",
  "fullName": "First Steps",
  "shortName": "FS",
  "description": "初学者使用的模组，只有3条规则Y和3条规则X",
  "rules": [
    {
      "ruleId": "Murder_Plan",
      "ruleName": "谋杀计划",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": 1
        },
        {
          "roleId": "Killer",
          "roleName": "杀手",
          "maxCount": 1
        },
        {
          "roleId": "Brain",
          "roleName": "主谋",
          "maxCount": 1
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Curmudgeon",
          "roleName": "暴徒",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Murder_Plan",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "Light_of_the_Avenger",
      "ruleName": "复仇的火种",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Killer",
          "roleName": "杀手",
          "maxCount": ""
        },
        {
          "roleId": "Brain",
          "roleName": "主谋",
          "maxCount": 1
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Curmudgeon",
          "roleName": "暴徒",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】主谋的初始区域有2枚或以上[密谋]"
        }
      ]
    },
    {
      "ruleId": "A_Place_To_Protect",
      "ruleName": "守护此地",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": 1
        },
        {
          "roleId": "Killer",
          "roleName": "杀手",
          "maxCount": ""
        },
        {
          "roleId": "Brain",
          "roleName": "主谋",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": 1
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Curmudgeon",
          "roleName": "暴徒",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】学校有2枚或以上[密谋]"
        }
      ]
    },
    {
      "ruleId": "Shadow_of_the_Ripper",
      "ruleName": "开膛者的魔影",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Killer",
          "roleName": "杀手",
          "maxCount": ""
        },
        {
          "roleId": "Brain",
          "roleName": "主谋",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": 1
        },
        {
          "roleId": "Curmudgeon",
          "roleName": "暴徒",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Shadow_of_the_Ripper",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "Gossip_Spread",
      "ruleName": "流言四起",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Killer",
          "roleName": "杀手",
          "maxCount": ""
        },
        {
          "roleId": "Brain",
          "roleName": "主谋",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Curmudgeon",
          "roleName": "暴徒",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【任意能力：剧作家能力阶段】往任意1块版图上放置1枚[密谋]（每轮限1次）"
        }
      ]
    },
    {
      "ruleId": "A_Hideous_Script",
      "ruleName": "最黑暗的剧本",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Killer",
          "roleName": "杀手",
          "maxCount": ""
        },
        {
          "roleId": "Brain",
          "roleName": "主谋",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Curmudgeon",
          "roleName": "暴徒",
          "maxCount": 2
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": 1
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【任意能力：剧本制作时】剧本制作时，暴徒的人数可以为0-2人"
        }
      ]
    }
  ],
  "roles": [
    {
      "roleId": "Key_Person",
      "roleName": "关键人物",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：该角色死亡时】主人公失败，当前轮回立即结束"
        }
      ]
    },
    {
      "roleId": "Killer",
      "roleName": "杀手",
      "maxCount": "",
      "features": [
        "无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】同一区域1名关键人物身上有2枚或以上[密谋]→那名关键人物死亡"
        },
        {
          "abilityId": "ability2",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】该角色身上有4枚或以上[密谋]→主人公死亡"
        }
      ]
    },
    {
      "roleId": "Brain",
      "roleName": "主谋",
      "maxCount": "",
      "features": [
        "无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "任意能力",
          "description": "【任意能力：剧作家能力阶段】在同一区域的任意一名角色身上，或该角色所在版图上放置1枚[密谋]"
        }
      ]
    },
    {
      "roleId": "Cultist",
      "roleName": "邪教徒",
      "maxCount": "",
      "features": [
        "必定无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "任意能力",
          "description": "【任意能力：行动结算阶段】可以无效化同一区域内任意角色身上及其所在版图上被放置的密谋"
        }
      ]
    },
    {
      "roleId": "Conspiracy_Theorist",
      "roleName": "传谣人",
      "maxCount": 1,
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "任意能力",
          "description": "【任意能力：剧作家能力阶段】在同一区域内任意1名角色身上放置1枚[不安]"
        }
      ]
    },
    {
      "roleId": "Serial_Killer",
      "roleName": "杀人狂",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：回合结束阶段】若仅有1名其他角色与该角色位于同一区域，则该角色死亡"
        }
      ]
    },
    {
      "roleId": "Curmudgeon",
      "roleName": "暴徒",
      "maxCount": "",
      "features": [
        "无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "Ability_7_1",
          "abilityType": "任意能力",
          "description": ""
        }
      ]
    },
    {
      "roleId": "Friend",
      "roleName": "亲友",
      "maxCount": 2,
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "失败条件",
          "description": "【失败条件：轮回结束时】若该卡牌为死亡状态，则需向主人公告知该卡牌身份；"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：轮回开始时】该角色身份曾被公开→往该角色身上放置1枚[友好]"
        }
      ]
    }
  ],
  "incidents": [
    {
      "incidentId": "Murder",
      "incidentName": "谋杀",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "与当事人位于同一区域的另外1名角色死亡"
        }
      ]
    },
    {
      "incidentId": "Increasing_Unease",
      "incidentName": "不安扩散",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "往任意1名角色身上放置2枚[不安]，随后往另外1名角色身上放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "Suicide",
      "incidentName": "自杀",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "当事人死亡"
        }
      ]
    },
    {
      "incidentId": "Hospital_Incident",
      "incidentName": "医院事故",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "医院有1枚或以上[密谋]→位于医院的所有角色死亡"
        },
        {
          "eventEffectId": "eventEffect_02",
          "description": "医院有2枚或以上[密谋]→主人公死亡"
        }
      ]
    },
    {
      "incidentId": "Faraway_Murder",
      "incidentName": "远距离谋杀",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "与当事人位于同一区域的另外1名角色死亡"
        }
      ]
    },
    {
      "incidentId": "Missing_Person",
      "incidentName": "失踪",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "将当事人移动至任意版图，随后，往当事人所在版图放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "Spreading_Unease",
      "incidentName": "散播",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "从任意1名角色身上移除2枚[友好]，随后，往另外1名角色身上放置2枚[友好]"
        }
      ]
    }
  ]
};

export default First_Steps;