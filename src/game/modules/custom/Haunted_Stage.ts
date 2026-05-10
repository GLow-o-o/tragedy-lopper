import { ModuleBasicInfo } from '../basicInfo/basicInfo_module';

export const Haunted_Stage: ModuleBasicInfo = {
  "id": "Haunted_Stage",
  "fullName": "Haunted Stage",
  "shortName": "HS",
  "description": "双方可以在已经死亡的角色尸体上放置行动卡，宣言使用友好能力，以尸体为对象使用友好能力。\n主人公在没有死后活性的尸体上放置行动牌，结算时改为声明无死后活性并EX+1\n主人公宣言使用没有死后活性尸体的友好能力，结算时改为声明无死后活性并EX+1\n主人公指定没有死后活性的尸体为目标发动友好能力，结算时改为声明目标无死后活性并EX+1\n\n关键词\n【死后活性】\n拥有死后活性的角色可以处理身上的行动卡，也可以发动其友好能力和身份能力\n【死后限定】\n卡牌为尸体时才能发动的能力\n【死后发生】\n角色的尸体才能触发该事件（参照不安数量）",
  "rules": [
    {
      "ruleId": "Rule_1",
      "ruleName": "古祠惊魂",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Role_1",
          "roleName": "梦魇",
          "maxCount": 1
        },
        {
          "roleId": "Role_2",
          "roleName": "祟神",
          "maxCount": 1
        },
        {
          "roleId": "Role_3",
          "roleName": "人偶",
          "maxCount": ""
        },
        {
          "roleId": "Role_4",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Role_6",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Role_7",
          "roleName": "鬼魂",
          "maxCount": 1
        },
        {
          "roleId": "Role_8",
          "roleName": "怪物",
          "maxCount": ""
        },
        {
          "roleId": "Role_9",
          "roleName": "咒术师",
          "maxCount": 1
        },
        {
          "roleId": "Role_10",
          "roleName": "丧尸",
          "maxCount": ""
        },
        {
          "roleId": "Role_11",
          "roleName": "聚灵",
          "maxCount": ""
        },
        {
          "roleId": "Role_13",
          "roleName": "恐怖化身",
          "maxCount": ""
        },
        {
          "roleId": "Role_12",
          "roleName": "死亡主宰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Rule_1",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "Rule_2",
      "ruleName": "人偶的诅咒",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Role_1",
          "roleName": "梦魇",
          "maxCount": 1
        },
        {
          "roleId": "Role_2",
          "roleName": "祟神",
          "maxCount": ""
        },
        {
          "roleId": "Role_3",
          "roleName": "人偶",
          "maxCount": 1
        },
        {
          "roleId": "Role_4",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Role_6",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Role_7",
          "roleName": "鬼魂",
          "maxCount": 1
        },
        {
          "roleId": "Role_8",
          "roleName": "怪物",
          "maxCount": ""
        },
        {
          "roleId": "Role_9",
          "roleName": "咒术师",
          "maxCount": 1
        },
        {
          "roleId": "Role_10",
          "roleName": "丧尸",
          "maxCount": ""
        },
        {
          "roleId": "Role_11",
          "roleName": "聚灵",
          "maxCount": ""
        },
        {
          "roleId": "Role_13",
          "roleName": "恐怖化身",
          "maxCount": ""
        },
        {
          "roleId": "Role_12",
          "roleName": "死亡主宰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Rule_2",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "Rule_3",
      "ruleName": "月圆之夜",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Role_1",
          "roleName": "梦魇",
          "maxCount": 1
        },
        {
          "roleId": "Role_2",
          "roleName": "祟神",
          "maxCount": ""
        },
        {
          "roleId": "Role_3",
          "roleName": "人偶",
          "maxCount": ""
        },
        {
          "roleId": "Role_4",
          "roleName": "狼人",
          "maxCount": 1
        },
        {
          "roleId": "Role_6",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Role_7",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Role_8",
          "roleName": "怪物",
          "maxCount": ""
        },
        {
          "roleId": "Role_9",
          "roleName": "咒术师",
          "maxCount": 1
        },
        {
          "roleId": "Role_10",
          "roleName": "丧尸",
          "maxCount": ""
        },
        {
          "roleId": "Role_11",
          "roleName": "聚灵",
          "maxCount": ""
        },
        {
          "roleId": "Role_13",
          "roleName": "恐怖化身",
          "maxCount": ""
        },
        {
          "roleId": "Role_12",
          "roleName": "死亡主宰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Rule_3",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "Rule_4",
      "ruleName": "怪奇谈异",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Role_1",
          "roleName": "梦魇",
          "maxCount": 1
        },
        {
          "roleId": "Role_2",
          "roleName": "祟神",
          "maxCount": ""
        },
        {
          "roleId": "Role_3",
          "roleName": "人偶",
          "maxCount": ""
        },
        {
          "roleId": "Role_4",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Role_6",
          "roleName": "吸血鬼",
          "maxCount": 1
        },
        {
          "roleId": "Role_7",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Role_8",
          "roleName": "怪物",
          "maxCount": 1
        },
        {
          "roleId": "Role_9",
          "roleName": "咒术师",
          "maxCount": ""
        },
        {
          "roleId": "Role_10",
          "roleName": "丧尸",
          "maxCount": ""
        },
        {
          "roleId": "Role_11",
          "roleName": "聚灵",
          "maxCount": ""
        },
        {
          "roleId": "Role_13",
          "roleName": "恐怖化身",
          "maxCount": ""
        },
        {
          "roleId": "Role_12",
          "roleName": "死亡主宰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Rule_4",
          "description": "【强制：剧本制作时】[吸血鬼]和[梦魇]必须性别相同"
        }
      ]
    },
    {
      "ruleId": "Rule_5",
      "ruleName": "沙尘的恶魔",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Role_1",
          "roleName": "梦魇",
          "maxCount": 1
        },
        {
          "roleId": "Role_2",
          "roleName": "祟神",
          "maxCount": ""
        },
        {
          "roleId": "Role_3",
          "roleName": "人偶",
          "maxCount": ""
        },
        {
          "roleId": "Role_4",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Role_6",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Role_7",
          "roleName": "鬼魂",
          "maxCount": 1
        },
        {
          "roleId": "Role_8",
          "roleName": "怪物",
          "maxCount": ""
        },
        {
          "roleId": "Role_9",
          "roleName": "咒术师",
          "maxCount": ""
        },
        {
          "roleId": "Role_10",
          "roleName": "丧尸",
          "maxCount": ""
        },
        {
          "roleId": "Role_11",
          "roleName": "聚灵",
          "maxCount": ""
        },
        {
          "roleId": "Role_13",
          "roleName": "恐怖化身",
          "maxCount": ""
        },
        {
          "roleId": "Role_12",
          "roleName": "死亡主宰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Rule_5",
          "description": "【失败条件：轮回结束时】生存的角色数量为4名或以下"
        }
      ]
    },
    {
      "ruleId": "Rule_6",
      "ruleName": "凝视深渊",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Role_1",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Role_2",
          "roleName": "祟神",
          "maxCount": ""
        },
        {
          "roleId": "Role_3",
          "roleName": "人偶",
          "maxCount": ""
        },
        {
          "roleId": "Role_4",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Role_6",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Role_7",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Role_8",
          "roleName": "怪物",
          "maxCount": 1
        },
        {
          "roleId": "Role_9",
          "roleName": "咒术师",
          "maxCount": ""
        },
        {
          "roleId": "Role_10",
          "roleName": "丧尸",
          "maxCount": ""
        },
        {
          "roleId": "Role_11",
          "roleName": "聚灵",
          "maxCount": ""
        },
        {
          "roleId": "Role_13",
          "roleName": "恐怖化身",
          "maxCount": 1
        },
        {
          "roleId": "Role_12",
          "roleName": "死亡主宰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Rule_6",
          "description": "【强制：轮回结束】EX上升X，X为都市的[密谋]数量（X最大为3）"
        }
      ]
    },
    {
      "ruleId": "Rule_7",
      "ruleName": "僵尸粉",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Role_1",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Role_2",
          "roleName": "祟神",
          "maxCount": ""
        },
        {
          "roleId": "Role_3",
          "roleName": "人偶",
          "maxCount": ""
        },
        {
          "roleId": "Role_4",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Role_6",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Role_7",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Role_8",
          "roleName": "怪物",
          "maxCount": ""
        },
        {
          "roleId": "Role_9",
          "roleName": "咒术师",
          "maxCount": 1
        },
        {
          "roleId": "Role_10",
          "roleName": "丧尸",
          "maxCount": ""
        },
        {
          "roleId": "Role_11",
          "roleName": "聚灵",
          "maxCount": ""
        },
        {
          "roleId": "Role_13",
          "roleName": "恐怖化身",
          "maxCount": ""
        },
        {
          "roleId": "Role_12",
          "roleName": "死亡主宰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Rule_7",
          "description": "【强制：常驻】没有死后活性且拥有1枚或以上[密谋]的尸体变为丧尸"
        }
      ]
    },
    {
      "ruleId": "Rule_8",
      "ruleName": "扩大的都市传说",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Role_1",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Role_2",
          "roleName": "祟神",
          "maxCount": ""
        },
        {
          "roleId": "Role_3",
          "roleName": "人偶",
          "maxCount": ""
        },
        {
          "roleId": "Role_4",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Role_6",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Role_7",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Role_8",
          "roleName": "怪物",
          "maxCount": ""
        },
        {
          "roleId": "Role_9",
          "roleName": "咒术师",
          "maxCount": ""
        },
        {
          "roleId": "Role_10",
          "roleName": "丧尸",
          "maxCount": ""
        },
        {
          "roleId": "Role_11",
          "roleName": "骚灵",
          "maxCount": 1
        },
        {
          "roleId": "Role_13",
          "roleName": "恐怖化身",
          "maxCount": 1
        },
        {
          "roleId": "Role_12",
          "roleName": "死亡主宰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Rule_8",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "Rule_9",
      "ruleName": "鬼城的幽影",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Role_1",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Role_2",
          "roleName": "祟神",
          "maxCount": ""
        },
        {
          "roleId": "Role_3",
          "roleName": "人偶",
          "maxCount": ""
        },
        {
          "roleId": "Role_4",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Role_6",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Role_7",
          "roleName": "鬼魂",
          "maxCount": 1
        },
        {
          "roleId": "Role_8",
          "roleName": "怪物",
          "maxCount": ""
        },
        {
          "roleId": "Role_9",
          "roleName": "咒术师",
          "maxCount": ""
        },
        {
          "roleId": "Role_10",
          "roleName": "丧尸",
          "maxCount": ""
        },
        {
          "roleId": "Role_11",
          "roleName": "骚灵",
          "maxCount": 1
        },
        {
          "roleId": "Role_13",
          "roleName": "恐怖化身",
          "maxCount": ""
        },
        {
          "roleId": "Role_12",
          "roleName": "死亡主宰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Rule_9",
          "description": "【失败条件：轮回结束时】[鬼魂]的尸体上有3枚或以上的[不安]"
        }
      ]
    },
    {
      "ruleId": "Rule_10",
      "ruleName": "死亡舞会",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Role_1",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Role_2",
          "roleName": "祟神",
          "maxCount": ""
        },
        {
          "roleId": "Role_3",
          "roleName": "人偶",
          "maxCount": ""
        },
        {
          "roleId": "Role_4",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Role_6",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Role_7",
          "roleName": "鬼魂",
          "maxCount": 1
        },
        {
          "roleId": "Role_8",
          "roleName": "怪物",
          "maxCount": ""
        },
        {
          "roleId": "Role_9",
          "roleName": "咒术师",
          "maxCount": ""
        },
        {
          "roleId": "Role_10",
          "roleName": "丧尸",
          "maxCount": ""
        },
        {
          "roleId": "Role_11",
          "roleName": "骚灵",
          "maxCount": ""
        },
        {
          "roleId": "Role_13",
          "roleName": "恐怖化身",
          "maxCount": 1
        },
        {
          "roleId": "Role_12",
          "roleName": "死亡主宰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Rule_10",
          "description": "【失败条件：轮回结束时】某块版图存在1枚或以上[密谋]和3具或以上的尸体"
        }
      ]
    },
    {
      "ruleId": "Rule_11",
      "ruleName": "致命狂乱",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Role_1",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Role_2",
          "roleName": "祟神",
          "maxCount": ""
        },
        {
          "roleId": "Role_3",
          "roleName": "人偶",
          "maxCount": ""
        },
        {
          "roleId": "Role_4",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Role_6",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Role_7",
          "roleName": "鬼魂",
          "maxCount": 1
        },
        {
          "roleId": "Role_8",
          "roleName": "怪物",
          "maxCount": ""
        },
        {
          "roleId": "Role_9",
          "roleName": "咒术师",
          "maxCount": ""
        },
        {
          "roleId": "Role_10",
          "roleName": "丧尸",
          "maxCount": ""
        },
        {
          "roleId": "Role_11",
          "roleName": "聚灵",
          "maxCount": ""
        },
        {
          "roleId": "Role_13",
          "roleName": "恐怖化身",
          "maxCount": ""
        },
        {
          "roleId": "Role_12",
          "roleName": "死亡主宰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "Rule_11",
          "description": "【失败条件：轮回结束时】尸体只有2具及以下"
        }
      ]
    },
    {
      "ruleId": "Rule_12",
      "ruleName": "生与死的境界",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Role_1",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Role_2",
          "roleName": "祟神",
          "maxCount": ""
        },
        {
          "roleId": "Role_3",
          "roleName": "人偶",
          "maxCount": ""
        },
        {
          "roleId": "Role_4",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Role_6",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Role_7",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Role_8",
          "roleName": "怪物",
          "maxCount": 1
        },
        {
          "roleId": "Role_9",
          "roleName": "咒术师",
          "maxCount": ""
        },
        {
          "roleId": "Role_10",
          "roleName": "丧尸",
          "maxCount": ""
        },
        {
          "roleId": "Role_11",
          "roleName": "聚灵",
          "maxCount": ""
        },
        {
          "roleId": "Role_13",
          "roleName": "恐怖化身",
          "maxCount": ""
        },
        {
          "roleId": "Role_12",
          "roleName": "死亡主宰",
          "maxCount": 1
        }
      ],
      "addRules": [
        {
          "ruleId": "Rule_12",
          "description": "【任意能力：第一天的回合结束阶段】与死亡主宰位于同一区域的任意1名角色死亡"
        }
      ]
    }
  ],
  "roles": [
    {
      "roleId": "Role_1",
      "roleName": "梦魇",
      "maxCount": "",
      "features": [
        "必定无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "Ability_1_1",
          "abilityType": "任意能力",
          "description": "【强制：回合结束阶段】同一区域1名其他角色死亡。如果同一区域没有其他角色，改为该角色死亡"
        }
      ]
    },
    {
      "roleId": "Role_2",
      "roleName": "祟神",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "Ability_2_1",
          "abilityType": "任意能力",
          "description": "死后活性"
        },
        {
          "abilityId": "Ability_2_2",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】<死后限定>该尸体有2枚或以上[密谋]→主人公死亡"
        }
      ]
    },
    {
      "roleId": "Role_3",
      "roleName": "人偶",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "Ability_3_1",
          "abilityType": "任意能力",
          "description": "死后活性"
        },
        {
          "abilityId": "Ability_3_2",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】该卡牌所在版图有2枚或以上[密谋]且该卡牌有1枚或以上[不安]→主人公死亡"
        },
        {
          "abilityId": "Ability_3_3",
          "abilityType": "任意能力",
          "description": "【任意能力：该角色死亡时】往该角色所在版图放置1枚[密谋]"
        }
      ]
    },
    {
      "roleId": "Role_4",
      "roleName": "狼人",
      "maxCount": "",
      "features": [
        "必定无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "Ability_4_1",
          "abilityType": "任意能力",
          "description": "【任意能力：第五天的回合结束阶段】主人公死亡"
        },
        {
          "abilityId": "Ability_4_2",
          "abilityType": "任意能力",
          "description": "【强制：常驻】剧作家无法在该角色身上放置行动牌"
        }
      ]
    },
    {
      "roleId": "Role_6",
      "roleName": "吸血鬼",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "Ability_6_1",
          "abilityType": "任意能力",
          "description": "死后活性"
        },
        {
          "abilityId": "Ability_6_2",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】让同区域1名拥有1枚或以上[不安]和1枚或以上[密谋]的性别为该卡牌的异性的角色死亡"
        },
        {
          "abilityId": "Ability_6_3",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】有三名性别为该卡牌的异性的卡牌处于死亡状态→主人公死亡"
        }
      ]
    },
    {
      "roleId": "Role_7",
      "roleName": "鬼魂",
      "maxCount": 2,
      "features": [],
      "abilitys": [
        {
          "abilityId": "Ability_7_1",
          "abilityType": "任意能力",
          "description": "死后活性"
        }
      ]
    },
    {
      "roleId": "Role_8",
      "roleName": "怪物",
      "maxCount": "",
      "features": [
        "不死"
      ],
      "abilitys": [
        {
          "abilityId": "Ability_8_1",
          "abilityType": "任意能力",
          "description": "【强制：该角色身份公开时】Ex槽上升2"
        }
      ]
    },
    {
      "roleId": "Role_9",
      "roleName": "咒术师",
      "maxCount": "",
      "features": [
        "无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "Ability_9_1",
          "abilityType": "任意能力",
          "description": "【任意能力：剧作家能力阶段】往同一区域的1具尸体上放置1枚[不安]或[密谋]"
        }
      ]
    },
    {
      "roleId": "Role_10",
      "roleName": "丧尸",
      "maxCount": "",
      "features": [
        "必定无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "Ability_10_1",
          "abilityType": "任意能力",
          "description": "死后活性"
        },
        {
          "abilityId": "Ability_10_2",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】某块版图[丧尸]数量大于等于角色数量→往位于该版图的1名角色身上放置1枚[密谋]，并且让那名角色死亡。如果成功让那名角色变为死亡状态，Ex槽上升1（所有丧尸合计，每天限1次）"
        }
      ]
    },
    {
      "roleId": "Role_11",
      "roleName": "骚灵",
      "maxCount": 1,
      "features": [
        "必定无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "Ability_11_1",
          "abilityType": "任意能力",
          "description": "【任意能力：剧作家能力阶段】可以将同一区域1张卡牌移动至相邻版图（每轮限1次）"
        }
      ]
    },
    {
      "roleId": "Role_13",
      "roleName": "恐怖化身",
      "maxCount": 1,
      "features": [],
      "abilitys": [
        {
          "abilityId": "Ability_13_1",
          "abilityType": "任意能力",
          "description": "死后活性"
        },
        {
          "abilityId": "Ability_13_2",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】往同一区域的1名角色身上放置1枚[不安]"
        }
      ]
    },
    {
      "roleId": "Role_12",
      "roleName": "死亡主宰",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "Ability_12_1",
          "abilityType": "任意能力",
          "description": "死后活性"
        },
        {
          "abilityId": "Ability_12_2",
          "abilityType": "任意能力",
          "description": "【强制：回合结束阶段】<死后限定>选择同一区域另1张卡牌→根据选择的卡牌状态，那名角色死亡或那具尸体复活"
        }
      ]
    }
  ],
  "incidents": [
    {
      "incidentId": "Incident_1",
      "incidentName": "不安扩散",
      "Incident_Effects": [
        {
          "eventEffectId": "Incident_1_Effect_1",
          "description": "往任意1名角色身上放置2枚[不安]，随后往另1名人物身上放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "Incident_2",
      "incidentName": "连续杀人",
      "Incident_Effects": [
        {
          "eventEffectId": "Incident_2_Effect_1",
          "description": "与当事人位于同一区域的另外1名角色死亡"
        },
        {
          "eventEffectId": "Incident_2_Effect_2",
          "description": "1名角色可以同时担任多个连续杀人事件的当事人"
        }
      ]
    },
    {
      "incidentId": "Incident_3",
      "incidentName": "集体自杀",
      "Incident_Effects": [
        {
          "eventEffectId": "Incident_3_Effect_1",
          "description": "当事人有1枚或以上[密谋]→当事人所在区域的所有角色死亡"
        }
      ]
    },
    {
      "incidentId": "Incident_4",
      "incidentName": "替代行刑",
      "Incident_Effects": [
        {
          "eventEffectId": "Incident_4_Effect_1",
          "description": "<当事人不安限度-2>Ex槽上升1，队长选择1名角色，那名角色死亡"
        }
      ]
    },
    {
      "incidentId": "Incident_5",
      "incidentName": "医院事故",
      "Incident_Effects": [
        {
          "eventEffectId": "Incident_5_Effect_1",
          "description": "医院有1枚或以上[密谋]→位于医院的所有角色死亡"
        },
        {
          "eventEffectId": "Incident_5_Effect_2",
          "description": "医院有2枚或以上[密谋]→主人公死亡"
        }
      ]
    },
    {
      "incidentId": "Incident_6",
      "incidentName": "亵渎",
      "Incident_Effects": [
        {
          "eventEffectId": "Incident_6_Effect_1",
          "description": "在任意1具尸体上放置1枚[不安]以及1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "Incident_7",
      "incidentName": "魔兽解放",
      "Incident_Effects": [
        {
          "eventEffectId": "Incident_7_Effect_1",
          "description": "在当事人所在区域选择1张Ex卡放置。此后，该Ex卡视作名字为[魔兽]，身份为[梦魇]的角色"
        }
      ]
    },
    {
      "incidentId": "Incident_8",
      "incidentName": "百鬼夜行",
      "Incident_Effects": [
        {
          "eventEffectId": "Incident_8_Effect_1",
          "description": "<当事人死后发生>神社有1枚或以上[密谋]→Ex槽上升4"
        }
      ]
    },
    {
      "incidentId": "Incident_9",
      "incidentName": "咒怨",
      "Incident_Effects": [
        {
          "eventEffectId": "Incident_9_Effect_1",
          "description": "<当事人死后发生>将当事尸体在同一区域的1张卡牌移动至任意版图"
        }
      ]
    },
    {
      "incidentId": "Incident_10",
      "incidentName": "蔓延",
      "Incident_Effects": [
        {
          "eventEffectId": "Incident_10_Effect_1",
          "description": "<当事人死后发生>往当事尸体所在版图放置2枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "Incident_11",
      "incidentName": "噩梦再临",
      "Incident_Effects": [
        {
          "eventEffectId": "Incident_11_Effect_1",
          "description": "<当事人死后发生>Ex槽上升1，当事尸体复活"
        }
      ]
    }
  ],
  "exSlot": {
    "name": "灵异度",
    "description": "轮回开始不归零\n剧作家可以在回合结束阶段发动，EX-4，主人公死亡（从强制前到回合结束阶段结束前均可）"
  }
};

export default Haunted_Stage;