import { ModuleBasicInfo } from '../basicInfo/basicInfo_module';

export const Weird_Mythology: ModuleBasicInfo = {
  "id": "Weird_Mythology",
  "fullName": "Weird Mythology",
  "shortName": "WM",
  "description": "独立模组。Y：外神合唱曲～染血的仪式；X：流言四起～疯狂的真相。",
  "rules": [
    {
      "ruleId": "WM_Y_Chorus_Outer_Gods",
      "ruleName": "外神合唱曲",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": 1
        },
        {
          "roleId": "Sacrifice",
          "roleName": "祭品",
          "maxCount": 1
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": 1
        },
        {
          "roleId": "Deep_One",
          "roleName": "深潜者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Shaman",
          "roleName": "巫师",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Witness",
          "roleName": "目击者",
          "maxCount": ""
        },
        {
          "roleId": "Faceless",
          "roleName": "无面者",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】5名或以上的生存角色身上均有1枚或以上[密谋]"
        }
      ]
    },
    {
      "ruleId": "WM_Y_Dagon_Gospel",
      "ruleName": "达贡的福音书",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": 1
        },
        {
          "roleId": "Sacrifice",
          "roleName": "祭品",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": 1
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Deep_One",
          "roleName": "深潜者",
          "maxCount": 1
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Shaman",
          "roleName": "巫师",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Witness",
          "roleName": "目击者",
          "maxCount": ""
        },
        {
          "roleId": "Faceless",
          "roleName": "无面者",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】神社有X枚或以上[密谋]（X=Ex槽的值）"
        }
      ]
    },
    {
      "ruleId": "WM_Y_King_Yellow",
      "ruleName": "黄衣之王",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Sacrifice",
          "roleName": "祭品",
          "maxCount": 1
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": 1
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Deep_One",
          "roleName": "深潜者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Shaman",
          "roleName": "巫师",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Witness",
          "roleName": "目击者",
          "maxCount": ""
        },
        {
          "roleId": "Faceless",
          "roleName": "无面者",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】本轮轮回中Ex槽增加过"
        }
      ]
    },
    {
      "ruleId": "WM_Y_Time_Bomb",
      "ruleName": "巨大定时炸弹Y",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Sacrifice",
          "roleName": "祭品",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": 1
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Deep_One",
          "roleName": "深潜者",
          "maxCount": 1
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Shaman",
          "roleName": "巫师",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Witness",
          "roleName": "目击者",
          "maxCount": ""
        },
        {
          "roleId": "Faceless",
          "roleName": "无面者",
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
      "ruleId": "WM_Y_Bloody_Ritual",
      "ruleName": "染血的仪式",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Sacrifice",
          "roleName": "祭品",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": 1
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": 1
        },
        {
          "roleId": "Deep_One",
          "roleName": "深潜者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Shaman",
          "roleName": "巫师",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Witness",
          "roleName": "目击者",
          "maxCount": ""
        },
        {
          "roleId": "Faceless",
          "roleName": "无面者",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】有X具或以上尸体（X=Ex槽的值）"
        }
      ]
    },
    {
      "ruleId": "WM_X_Rumors",
      "ruleName": "流言四起",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Sacrifice",
          "roleName": "祭品",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Deep_One",
          "roleName": "深潜者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Shaman",
          "roleName": "巫师",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Witness",
          "roleName": "目击者",
          "maxCount": ""
        },
        {
          "roleId": "Faceless",
          "roleName": "无面者",
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
      "ruleId": "WM_X_Resisters",
      "ruleName": "抗争者",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Sacrifice",
          "roleName": "祭品",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Deep_One",
          "roleName": "深潜者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Shaman",
          "roleName": "巫师",
          "maxCount": 1
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": 1
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Witness",
          "roleName": "目击者",
          "maxCount": ""
        },
        {
          "roleId": "Faceless",
          "roleName": "无面者",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "WM_X_Resisters",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "WM_X_Witness_Fear",
      "ruleName": "见证恐惧",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Sacrifice",
          "roleName": "祭品",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Deep_One",
          "roleName": "深潜者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Shaman",
          "roleName": "巫师",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Witness",
          "roleName": "目击者",
          "maxCount": 1
        },
        {
          "roleId": "Faceless",
          "roleName": "无面者",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "WM_X_Witness_Fear",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "WM_X_Yith",
      "ruleName": "伊斯之伟大种族",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Sacrifice",
          "roleName": "祭品",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Deep_One",
          "roleName": "深潜者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Shaman",
          "roleName": "巫师",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": 1
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": 1
        },
        {
          "roleId": "Witness",
          "roleName": "目击者",
          "maxCount": ""
        },
        {
          "roleId": "Faceless",
          "roleName": "无面者",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "WM_X_Yith",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "WM_X_Abyss_Whisper",
      "ruleName": "深渊之都的私语",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Sacrifice",
          "roleName": "祭品",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Deep_One",
          "roleName": "深潜者",
          "maxCount": 1
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": 1
        },
        {
          "roleId": "Shaman",
          "roleName": "巫师",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Witness",
          "roleName": "目击者",
          "maxCount": ""
        },
        {
          "roleId": "Faceless",
          "roleName": "无面者",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：常驻】偏执狂获得关键人物的能力（身份不发生变化）"
        }
      ]
    },
    {
      "ruleId": "WM_X_Faceless_God",
      "ruleName": "无貌之神",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Sacrifice",
          "roleName": "祭品",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Deep_One",
          "roleName": "深潜者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Shaman",
          "roleName": "巫师",
          "maxCount": 1
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Witness",
          "roleName": "目击者",
          "maxCount": ""
        },
        {
          "roleId": "Faceless",
          "roleName": "无面者",
          "maxCount": 1
        }
      ],
      "addRules": [
        {
          "ruleId": "WM_X_Faceless_God",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "WM_X_Crazy_Truth",
      "ruleName": "疯狂的真相",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Sacrifice",
          "roleName": "祭品",
          "maxCount": ""
        },
        {
          "roleId": "Cultist",
          "roleName": "邪教徒",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Immortal",
          "roleName": "永生者",
          "maxCount": ""
        },
        {
          "roleId": "Deep_One",
          "roleName": "深潜者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": 1
        },
        {
          "roleId": "Shaman",
          "roleName": "巫师",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Time_Traveler",
          "roleName": "时间旅者",
          "maxCount": ""
        },
        {
          "roleId": "Witness",
          "roleName": "目击者",
          "maxCount": ""
        },
        {
          "roleId": "Faceless",
          "roleName": "无面者",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：轮回开始时】Ex槽为2或以上→本轮轮回中，规则Y指定的失败条件变更为（剧本事先设定的）另一条规则Y的失败条件"
        },
        {
          "ruleId": "addRule_02",
          "description": "【强制：剧本制作时】情报商必须登场"
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
      "roleId": "Sacrifice",
      "roleName": "祭品",
      "maxCount": "",
      "features": [
        "不死"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【任意能力：回合结束阶段】该角色身上有2枚或以上[密谋]且有2枚或以上[不安]→所有角色和主人公死亡"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：事件阶段】判定该角色为当事人的事件是否触发时，[密谋]视为[不安]处理"
        },
        {
          "abilityId": "Ability_2_3",
          "abilityType": "任意能力",
          "description": "【强制：剧本制作时】必须成为某1个事件的当事人"
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
      "roleId": "Witch",
      "roleName": "魔女",
      "maxCount": "",
      "features": [
        "必定无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "Ability_4_1",
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
          "abilityId": "Ability_5_1",
          "abilityType": "任意能力",
          "description": ""
        }
      ]
    },
    {
      "roleId": "Deep_One",
      "roleName": "深潜者",
      "maxCount": "",
      "features": [
        "无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "任意能力",
          "description": "【任意能力：剧作家能力阶段】往同一区域任意一名角色身上，或该角色所在的版图上放置1枚[密谋]"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：该角色死亡时】公开该角色身份，Ex槽增加1"
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
      "roleId": "Paranoid",
      "roleName": "偏执狂",
      "maxCount": "",
      "features": [
        "必定无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "任意能力",
          "description": "【任意能力：剧作家能力阶段】往该角色身上放置1枚[密谋]或[不安]"
        }
      ]
    },
    {
      "roleId": "Shaman",
      "roleName": "巫师",
      "maxCount": 1,
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "失败条件",
          "description": "【失败条件：轮回结束时】该卡牌为死亡状态"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：结算该角色友好能力后】公开该角色身份，之后，队长可以使Ex槽增加1"
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
      "roleId": "Witness",
      "roleName": "目击者",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：回合结束阶段】该角色有4枚或以上[不安]→该角色死亡，Ex槽增加1"
        }
      ]
    },
    {
      "roleId": "Faceless",
      "roleName": "无面者",
      "maxCount": "",
      "features": [
        "无视友好",
        "不死"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：常驻】Ex槽为1或以下→该角色获得传谣人的能力（身份不发生变化）"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：常驻】Ex槽为2或以上→该角色获得深潜者的能力（身份不发生变化）"
        }
      ]
    }
  ],
  "incidents": [
    {
      "incidentId": "WM_Crazy_Killing",
      "incidentName": "疯狂杀人",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "与当事人位于同一区域的1名角色死亡"
        }
      ]
    },
    {
      "incidentId": "WM_Mass_Suicide",
      "incidentName": "集体自杀",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "当事人有1枚或以上[密谋]→当事人所在区域的所有角色死亡"
        }
      ]
    },
    {
      "incidentId": "WM_Anxiety_Spread",
      "incidentName": "不安扩散",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "往任意1名角色身上放置2枚[不安]，随后往另外1名角色身上放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "WM_Disappearance",
      "incidentName": "失踪",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "将当事人移动至任意版图，随后，往当事人所在版图放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "WM_Evil_Pollution",
      "incidentName": "邪气污染",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "往神社放置2枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "WM_Hospital",
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
      "incidentId": "WM_Riot",
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
      "incidentId": "WM_Extinguishing_Fire",
      "incidentName": "灭绝之火",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "本局游戏中若本事件首次发生→所有角色和主人公死亡"
        }
      ]
    },
    {
      "incidentId": "WM_Eye_Kyth",
      "incidentName": "廷达罗斯之嗅",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "<通过密谋指示物数量判定是否发生>本轮轮回剩余时间，如果发生其他事件，则在那个事件阶段结束时，主人公死亡"
        }
      ]
    },
    {
      "incidentId": "WM_Discovery",
      "incidentName": "发现",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "Ex槽增加1"
        }
      ]
    },
    {
      "incidentId": "WM_Funeral",
      "incidentName": "送葬",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "<当事人不安限度-1>队长选择1名角色，那名角色死亡"
        }
      ]
    }
  ],
  "exSlot": {
    "name": "神话知识",
    "description": "EX1+：感应咒文\n在第一天的回合开始阶段，如果Ex槽为1或以上，队长可以选择任意1名角色，并在该角色身上放置2枚友好指示物\n\nEX2+：先祖记忆\n轮回结束时，如果Ex槽为2或以上，可以得知规则X1的规则名\n\nEX3+：旧印\n如果Ex槽为3或以上，同时放置2张或以上[禁止密谋]时，不会无效化\n此能力在Ex槽达到3时立即生效\n\nEX4+：发狂\n回合结束阶段时，若Ex槽为4或以上，主人公死亡。\n轮回结束时，若Ex槽为4或以上，失去所有剩余轮回，直接进入最终决战。\n重重的亵渎知识终于导致主人公们坠入疯狂的深渊\n\nEX（**）（H）（HHO——））（——！#￥#####￥@%SV他 们 ....。。。。zai  beh 1 nnn  D  \n■■■■■\n■■■■■\n■■■■■\n\n别看身后。"
  }
};

export default Weird_Mythology;