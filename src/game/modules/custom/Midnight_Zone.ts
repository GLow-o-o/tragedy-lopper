import { ModuleBasicInfo } from '../basicInfo/basicInfo_module';

export const Midnight_Zone: ModuleBasicInfo = {
  "id": "Midnight_Zone",
  "fullName": "Midnight Zone",
  "shortName": "MZ",
  "description": "独立模组。Y 剧本 5 条（被封印的邪灵～因果之绊）、X 剧本 7 条（爱与恨的螺旋～灭亡讴歌）。",
  "rules": [
    {
      "ruleId": "MZ_Y_Sealed_Evil",
      "ruleName": "被封印的邪灵",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
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
          "roleId": "Ninja",
          "roleName": "忍者",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Magician",
          "roleName": "魔术师",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Prophet",
          "roleName": "预言家",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】神社有2枚或以上[密谋]\n"
        }
      ]
    },
    {
      "ruleId": "MZ_Y_Top_Secret_Report",
      "ruleName": "绝密报告",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
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
          "roleId": "Ninja",
          "roleName": "忍者",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Magician",
          "roleName": "魔术师",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Prophet",
          "roleName": "预言家",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】本轮轮回中公开过主谋、不安定因子或魔术师中任意身份的名称\n"
        }
      ]
    },
    {
      "ruleId": "MZ_Y_Mans_War",
      "ruleName": "男子汉的战争",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
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
          "roleId": "Ninja",
          "roleName": "忍者",
          "maxCount": 1
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Magician",
          "roleName": "魔术师",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Prophet",
          "roleName": "预言家",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：剧本制作时】忍者必须有男性属性（不可以是少年）\n"
        },
        {
          "ruleId": "addRule_02",
          "description": "【失败条件：轮回结束时】忍者或其尸体有2枚或以上[密谋]\n"
        }
      ]
    },
    {
      "ruleId": "MZ_Y_Mogua_Speech",
      "ruleName": "魔爪渐进",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": 1
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
          "roleId": "Ninja",
          "roleName": "忍者",
          "maxCount": 1
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Magician",
          "roleName": "魔术师",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Prophet",
          "roleName": "预言家",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "MZ_Y_Mogua_Speech",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "MZ_Y_Causal_Bond",
      "ruleName": "因果之绊",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
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
          "roleId": "Ninja",
          "roleName": "忍者",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": 1
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": 1
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Magician",
          "roleName": "魔术师",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Prophet",
          "roleName": "预言家",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：轮回开始时】选择一名上轮轮回结束时处于死亡状态的角色，放置一张Ex牌（不可以与[诸神之骰]重复发动）"
        },
        {
          "ruleId": "addRule_02",
          "description": "【强制：常驻】放置了Ex牌的角色，其身份变为关键人物（该角色失去原本的身份）"
        }
      ]
    },
    {
      "ruleId": "MZ_X_Edge_Love_Hate",
      "ruleName": "爱与恨的螺旋",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
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
          "roleId": "Ninja",
          "roleName": "忍者",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": 1
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": 1
        },
        {
          "roleId": "Magician",
          "roleName": "魔术师",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Prophet",
          "roleName": "预言家",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "MZ_X_Edge_Love_Hate",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "MZ_X_Fujoshi_Tea",
      "ruleName": "魔女的茶会",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
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
          "roleId": "Ninja",
          "roleName": "忍者",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": 1
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Magician",
          "roleName": "魔术师",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": 2
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Prophet",
          "roleName": "预言家",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "MZ_X_Fujoshi_Tea",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "MZ_X_Dice_Of_Gods",
      "ruleName": "诸神之骰",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
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
          "roleId": "Ninja",
          "roleName": "忍者",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": 1
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": 1
        },
        {
          "roleId": "Magician",
          "roleName": "魔术师",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Prophet",
          "roleName": "预言家",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：轮回开始时】选择一名上轮轮回结束时处于死亡状态的角色，放置一张Ex牌（不可以与[因果之绊]重复发动）"
        }
      ]
    },
    {
      "ruleId": "MZ_X_X_Factor",
      "ruleName": "X异因子",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
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
          "roleId": "Ninja",
          "roleName": "忍者",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Magician",
          "roleName": "魔术师",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": 1
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Prophet",
          "roleName": "预言家",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【任意能力：剧作家能力阶段】往存活的不安定因子所在版图放置1枚[密谋]（每轮限1次）"
        }
      ]
    },
    {
      "ruleId": "MZ_X_Death_Reality_Show",
      "ruleName": "死亡真人秀",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
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
          "roleId": "Ninja",
          "roleName": "忍者",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Magician",
          "roleName": "魔术师",
          "maxCount": 1
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": 1
        },
        {
          "roleId": "Prophet",
          "roleName": "预言家",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】生存角色数量为6名或以下"
        }
      ]
    },
    {
      "ruleId": "MZ_X_No_Telepathy",
      "ruleName": "心无灵犀",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
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
          "roleId": "Ninja",
          "roleName": "忍者",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Magician",
          "roleName": "魔术师",
          "maxCount": 1
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Prophet",
          "roleName": "预言家",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：行动结算阶段】「禁止友好」同时具备「禁止移动」的效果"
        }
      ]
    },
    {
      "ruleId": "MZ_X_Ode_To_Destruction",
      "ruleName": "灭亡讴歌",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
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
          "roleId": "Ninja",
          "roleName": "忍者",
          "maxCount": ""
        },
        {
          "roleId": "Friend",
          "roleName": "亲友",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Magician",
          "roleName": "魔术师",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Fujoshi",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Prophet",
          "roleName": "预言家",
          "maxCount": 1
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：剧本制作时】必须引入1个或以上的自杀事件"
        },
        {
          "ruleId": "addRule_02",
          "description": "【强制：事件阶段】当事人为平民的事件在判定是否发生时，如果预言家存活，该当事人的不安限度-1"
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
      "roleId": "Ninja",
      "roleName": "忍者",
      "maxCount": "",
      "features": [
        "无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】同一区域1名角色身上有2枚或以上[密谋]→那名角色死亡"
        },
        {
          "abilityId": "ability2",
          "abilityType": "任意能力",
          "description": "【任意能力：常驻】需公开该角色身份时，可以宣称本局游戏非公开信息表中的任意非平民身份名"
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
      "roleId": "Serial_Killer",
      "roleName": "杀人狂",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：回合结束阶段】仅有1名角色与该角色位于同一区域→那名角色死亡"
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
      "roleId": "OCD",
      "roleName": "强迫症",
      "maxCount": "",
      "features": [
        "必定无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：剧本制作时】必须成为某1个事件的当事人"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：事件阶段】当事人为该角色的事件必定会发生"
        }
      ]
    },
    {
      "roleId": "Magician",
      "roleName": "魔术师",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "任意能力",
          "description": "【任意能力：剧作家能力阶段】使同一区域中1名放置了1枚或以上不安指示物的角色移动至相邻版图（所有魔术师合计，每轮限1次）"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：该角色死亡时】移除该角色身上的所有[不安]"
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
    },
    {
      "roleId": "Fujoshi",
      "roleName": "魔女",
      "maxCount": 2,
      "features": [
        "必定无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "Ability_11_1",
          "abilityType": "任意能力",
          "description": ""
        }
      ]
    },
    {
      "roleId": "Immortal",
      "roleName": "永生者",
      "maxCount": "",
      "features": [
        "不死"
      ],
      "abilitys": [
        {
          "abilityId": "Ability_12_1",
          "abilityType": "任意能力",
          "description": ""
        }
      ]
    },
    {
      "roleId": "Prophet",
      "roleName": "预言家",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：常驻】剧作家不可以往该角色身上设置任何行动牌"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：事件阶段】与该角色位于同一区域的其他角色不会触发事件"
        }
      ]
    }
  ],
  "incidents": [
    {
      "incidentId": "Chain_Murder",
      "incidentName": "连续杀人",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "与当事人位于同一区域的另外1名角色死亡"
        },
        {
          "eventEffectId": "Chain_Murder_Effect_2",
          "description": "1名角色可以同时担任多个连续杀人事件的当事人"
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
      "incidentId": "Unease_Spread_To_Board",
      "incidentName": "不安扩散",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "往任意1名角色身上放置2枚[不安]，随后往另外1名角色身上放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "Disappearance_With_Plot_Prior",
      "incidentName": "失踪",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "将当事人移动至任意版图，随后，往当事人所在版图放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "Conspiracy_Activity",
      "incidentName": "阴谋活动",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "<通过密谋指示物数量判定是否发生>结算连续杀人或失踪事件的效果"
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
      "incidentId": "Riot",
      "incidentName": "暴乱",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "都市有1枚或以上[密谋]→位于都市的所有角色死亡"
        },
        {
          "eventEffectId": "eventEffect_02",
          "description": "学校有1枚或以上[密谋]→位于学校的所有角色死亡"
        }
      ]
    },
    {
      "incidentId": "Confession",
      "incidentName": "自白",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "当事人公开自己的身份"
        }
      ]
    },
    {
      "incidentId": "Break_The_Stalemate",
      "incidentName": "破局",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "队长选择1名角色或1块版图，移除其2枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "Fake_Suicide_Bx",
      "incidentName": "伪装自杀",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "往当事人身上设置1张Ex牌"
        },
        {
          "eventEffectId": "eventEffect_02",
          "description": "本轮轮回剩余时间主人公将无法往放置了Ex牌的角色身上放置行动牌"
        }
      ]
    },
    {
      "incidentId": "Fabricated_Incident",
      "incidentName": "伪造事件",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "当事人初始区域有2枚或以上[密谋]→主人公死亡"
        },
        {
          "eventEffectId": "eventEffect_02",
          "description": "将伪造事件记入公开信息表时，可以自由命名事件名称（非公开信息表和游戏中依然视为伪造事件）"
        }
      ]
    }
  ]
};

export default Midnight_Zone;