import { ModuleBasicInfo } from '../basicInfo/basicInfo_module';

export const Basic_Tragedy_X: ModuleBasicInfo = {
  "id": "Basic_Tragedy_X",
  "fullName": "Basic Tragedy X",
  "shortName": "BTX",
  "description": "含图中完整 Y 剧本 5 条、X 剧本 7 条，及对应身份与事件（杀手/主谋能力按规则书拆分）",
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
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
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
      "ruleId": "Sealed_Evil_Spirit",
      "ruleName": "被封印的邪灵",
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
          "maxCount": 1
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】神社有2枚或以上[密谋]"
        }
      ]
    },
    {
      "ruleId": "Sign_The_Contract",
      "ruleName": "和我签订契约吧！",
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
          "maxCount": ""
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：剧本制作时】关键人物必须具有「少女」属性"
        },
        {
          "ruleId": "addRule_02",
          "description": "【失败条件：轮回结束时】关键人物身上有2枚或以上[密谋]"
        }
      ]
    },
    {
      "ruleId": "Change_The_Future",
      "ruleName": "改变未来",
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
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": 1
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": 1
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】本轮轮回中引发过蝴蝶效应事件"
        }
      ]
    },
    {
      "ruleId": "Huge_Time_Bomb_X",
      "ruleName": "巨大定时炸弹X",
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
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": 1
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】魔女的初始区域有2枚或以上[密谋]"
        }
      ]
    },
    {
      "ruleId": "Friend_Circle",
      "ruleName": "好友圈",
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
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": 2
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Friend_Circle",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "Love_Storm_Line",
      "ruleName": "恋爱风暴线",
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
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": 1
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": 1
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Love_Storm_Line",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "Lurking_Serial_Killer",
      "ruleName": "潜伏的杀人狂",
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
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": 1
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": 1
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Lurking_Serial_Killer",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "Rumors_Everywhere",
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
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
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
      "ruleId": "Delusion_Expansion_Virus",
      "ruleName": "妄想扩大病毒",
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
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：被动】平民角色身上有3枚或以上[不安]时，其身份变为杀人狂"
        }
      ]
    },
    {
      "ruleId": "Causal_Knot",
      "ruleName": "因果线",
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
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：轮回开始时】上一轮回结束时持有[友好]的所有角色获得2枚[不安]"
        }
      ]
    },
    {
      "ruleId": "Unknown_Factor_X",
      "ruleName": "未知因子X",
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
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": 1
        }
      ],
      "addRules": [
        {
          "ruleId": "Unknown_Factor_X",
          "description": ""
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
          "abilityId": "Ability_2_2",
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
          "description": "【任意能力：剧作家能力阶段】往同一区域任意一名角色身上，或该角色所在的版图上放置1枚[密谋]"
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
          "description": "【任意能力：行动结算阶段】可以无效化同一区域中任意角色身上和该角色所在版图上放置的禁止密谋"
        }
      ]
    },
    {
      "roleId": "Time_Traveler",
      "roleName": "时间旅者",
      "maxCount": "",
      "features": [
        "不死"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：行动结算阶段】无视该角色身上放置的禁止友好"
        },
        {
          "abilityId": "ability2",
          "abilityType": "失败条件",
          "description": "【任意能力：最终日的回合结束阶段】该角色身上的[友好]为2枚或以下→主人公失败，当前轮回立即结束"
        }
      ]
    },
    {
      "roleId": "Fujoshi",
      "roleName": "魔女",
      "maxCount": "",
      "features": [
        "必定无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
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
          "description": "【失败条件：轮回结束时】该卡牌为死亡状态，此时，需要告知主人公该卡牌的身份"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：轮回开始时】该角色身份曾被公开→往该角色身上放置1枚[友好]"
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
          "description": "【任意能力：剧作家能力阶段】往同一区域中任意1名角色身上放置1枚[不安]"
        }
      ]
    },
    {
      "roleId": "Sweetheart",
      "roleName": "心上人",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：求爱者死亡时】往该角色身上放置6枚[不安]"
        }
      ]
    },
    {
      "roleId": "Suitor",
      "roleName": "求爱者",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：心上人死亡时】往该角色身上放置6枚[不安]"
        },
        {
          "abilityId": "Ability_9_2",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】该角色身上有1枚或以上[密谋]且有3枚或以上[不安]→主人公死亡"
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
          "abilityType": "任意能力",
          "description": "【强制：回合结束阶段】仅有1名角色与该角色位于同一区域→那名角色死亡"
        }
      ]
    },
    {
      "roleId": "Unstable_Factor",
      "roleName": "不安定因子",
      "maxCount": "",
      "features": [
        "无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：常驻】学校有2枚或以上[密谋]→该角色获得传谣人的能力（身份依然为[不安定因子]）"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：常驻】都市有2枚或以上[密谋]→该角色获得关键人物的能力（身份依然为[不安定因子]）"
        }
      ]
    }
  ],
  "incidents": [
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
      "incidentId": "Evil_Pollution",
      "incidentName": "邪气污染",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "往神社放置2枚[密谋]"
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
      "incidentId": "Flogging",
      "incidentName": "散播",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "从任意1名角色身上移除2枚[友好]，随后往另外1名角色身上放置2枚[友好]"
        }
      ]
    },
    {
      "incidentId": "Butterfly_Effect",
      "incidentName": "蝴蝶效应",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "选择与当事人位于同一区域的任意1名角色，往该角色身上放置1枚[友好]、[不安]或[密谋]"
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
      "incidentId": "Faraway_Murder",
      "incidentName": "远距离谋杀",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "任意1名身上有2枚或以上[密谋]的角色死亡"
        }
      ]
    }
  ]
};

export default Basic_Tragedy_X;