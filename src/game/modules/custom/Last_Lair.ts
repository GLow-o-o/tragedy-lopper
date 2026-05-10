import { ModuleBasicInfo } from '../basicInfo/basicInfo_module';

export const Last_Lair: ModuleBasicInfo = {
  "id": "Last_Lair",
  "fullName": "Last Lair",
  "shortName": "LL",
  "description": "背叛者：在第一轮轮回开始时将Ex牌ABC洗混，并分给三个主人公，这张牌只有获得的主人公可以确认，剧作家和其他主人公不能确认。拿到ExA的主人公称为主人公A，以此类推。\n\n如果剧本选择的规则有特殊胜利条件，则对应的主人公变为背叛者，获得单独的胜利条件，如果完成胜利条件，则那个主人公单独胜利，剧作家和其他主人公失败，如果在轮回过程中主人公胜利，则背叛者失败。\n\n最终决战时，如果背叛者是C，结算支线效果。\n所有背叛者不能参与最终决战并失败。\n由于规则X最多有2条，所以背叛者最多有2名。\n\n本模组必须使用已死亡标志和已沟通标志，并且本模组必须为4人游戏，且在轮回中不能讨论。\n\n连环杀手在这个模组中限制1人。",
  "rules": [
    {
      "ruleId": "LL_Y_Final_Plan",
      "ruleName": "最终计划",
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
          "roleId": "Causal_Fragment",
          "roleName": "因果残片",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不稳定因子",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Watcher",
          "roleName": "监视者",
          "maxCount": ""
        },
        {
          "roleId": "Net_Celebrity",
          "roleName": "网络名流",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Secret_Key",
          "roleName": "密钥",
          "maxCount": ""
        },
        {
          "roleId": "Eccentric",
          "roleName": "怪杰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "a1",
          "description": "【强制：常驻】关键人物（无论生死）身上有1枚或以上[希望]→所有主人公不再是背叛者。如果当前是最终轮回，则最终决战时依然生效"
        }
      ]
    },
    {
      "ruleId": "LL_Y_Closed_End",
      "ruleName": "封闭的终末",
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
          "roleId": "Causal_Fragment",
          "roleName": "因果残片",
          "maxCount": 1
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": 1
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Watcher",
          "roleName": "监视者",
          "maxCount": ""
        },
        {
          "roleId": "Net_Celebrity",
          "roleName": "网络名流",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Secret_Key",
          "roleName": "密钥",
          "maxCount": ""
        },
        {
          "roleId": "Eccentric",
          "roleName": "怪杰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "a1",
          "description": "【任意能力：回合结束阶段】神社有2枚或以上[密谋]→主人公死亡"
        },
        {
          "ruleId": "LL_Y_Closed_End",
          "description": "【强制：进行判定时】计算某块版图上的[密谋]数量时，该区域角色身上的[希望]和[绝望]也视为位于版图上。"
        }
      ]
    },
    {
      "ruleId": "LL_Y_Rebel_World",
      "ruleName": "叛逆的世界",
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
          "roleId": "Causal_Fragment",
          "roleName": "因果残片",
          "maxCount": 1
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不稳定因子",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Watcher",
          "roleName": "监视者",
          "maxCount": ""
        },
        {
          "roleId": "Net_Celebrity",
          "roleName": "网络名流",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Secret_Key",
          "roleName": "密钥",
          "maxCount": ""
        },
        {
          "roleId": "Eccentric",
          "roleName": "怪杰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "a1",
          "description": "【强制：剧本制作时】关键人物和因果残片必须有少女属性"
        },
        {
          "ruleId": "a2",
          "description": "【失败条件：轮回结束时】关键人物有2枚或以上[密谋]"
        }
      ]
    },
    {
      "ruleId": "LL_Y_Tragic_Script",
      "ruleName": "恶魔的剧本",
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
          "roleId": "Causal_Fragment",
          "roleName": "因果残片",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不稳定因子",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": 1
        },
        {
          "roleId": "Watcher",
          "roleName": "监视者",
          "maxCount": 1
        },
        {
          "roleId": "Net_Celebrity",
          "roleName": "网络名流",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Secret_Key",
          "roleName": "密钥",
          "maxCount": ""
        },
        {
          "roleId": "Eccentric",
          "roleName": "怪杰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "a1",
          "description": "【失败条件：轮回结束时】本轮轮回中引发过遗言或代行者事件"
        },
        {
          "ruleId": "a2",
          "description": "【任意能力：最终日的回合结束阶段】若监视者身上的指示物仅有1枚或以下→主人公死亡"
        }
      ]
    },
    {
      "ruleId": "LL_Y_Time_Bomb_Z",
      "ruleName": "巨大定时炸弹Z",
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
          "roleId": "Causal_Fragment",
          "roleName": "因果残片",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": 1
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Watcher",
          "roleName": "监视者",
          "maxCount": ""
        },
        {
          "roleId": "Net_Celebrity",
          "roleName": "网络名流",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Secret_Key",
          "roleName": "密钥",
          "maxCount": ""
        },
        {
          "roleId": "Eccentric",
          "roleName": "怪杰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "a1",
          "description": "【失败条件：轮回结束时】魔女的初始区域有2枚或以上[密谋]"
        }
      ]
    },
    {
      "ruleId": "LL_X_Real_Monster",
      "ruleName": "真正的怪物",
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
          "roleId": "Causal_Fragment",
          "roleName": "因果残片",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不安定因子",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": 1
        },
        {
          "roleId": "Watcher",
          "roleName": "监视者",
          "maxCount": ""
        },
        {
          "roleId": "Net_Celebrity",
          "roleName": "网络名流",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Secret_Key",
          "roleName": "密钥",
          "maxCount": 1
        },
        {
          "roleId": "Eccentric",
          "roleName": "怪杰",
          "maxCount": 1
        }
      ],
      "addRules": [
        {
          "ruleId": "a1",
          "description": "【特殊胜利条件A：回合结束阶段】总计放置过5枚或以上已死亡标志"
        }
      ]
    },
    {
      "ruleId": "LL_X_Myth_Collector",
      "ruleName": "神话收集者",
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
          "roleId": "Causal_Fragment",
          "roleName": "因果残片",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不稳定因子",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Watcher",
          "roleName": "监视者",
          "maxCount": ""
        },
        {
          "roleId": "Net_Celebrity",
          "roleName": "网络名流",
          "maxCount": 1
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Secret_Key",
          "roleName": "密钥",
          "maxCount": 1
        },
        {
          "roleId": "Eccentric",
          "roleName": "怪杰",
          "maxCount": 1
        }
      ],
      "addRules": [
        {
          "ruleId": "a1",
          "description": "【特殊胜利条件B：主人公能力阶段】总计放置过6枚或以上已沟通标志"
        }
      ]
    },
    {
      "ruleId": "LL_X_I_Am_Detective",
      "ruleName": "我才是名侦探",
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
          "roleId": "Causal_Fragment",
          "roleName": "因果残片",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不稳定因子",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Watcher",
          "roleName": "监视者",
          "maxCount": 1
        },
        {
          "roleId": "Net_Celebrity",
          "roleName": "网络名流",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Secret_Key",
          "roleName": "密钥",
          "maxCount": 1
        },
        {
          "roleId": "Eccentric",
          "roleName": "怪杰",
          "maxCount": 1
        }
      ],
      "addRules": [
        {
          "ruleId": "a1",
          "description": "【特殊胜利条件C：最终决战】最终决战前主人公C获得推理机会，需要正确推理所有事件的当事人"
        }
      ]
    },
    {
      "ruleId": "LL_X_Beyond_Line",
      "ruleName": "超越世界线",
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
          "roleId": "Causal_Fragment",
          "roleName": "因果残片",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不稳定因子",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Watcher",
          "roleName": "监视者",
          "maxCount": ""
        },
        {
          "roleId": "Net_Celebrity",
          "roleName": "网络名流",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "Secret_Key",
          "roleName": "密钥",
          "maxCount": ""
        },
        {
          "roleId": "Eccentric",
          "roleName": "怪杰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "a1",
          "description": "【强制：轮回开始时】偶数轮轮回开始时，剧作家获得[绝望+1]，最终轮轮回开始时，主人公获得[希望+1]"
        }
      ]
    },
    {
      "ruleId": "LL_X_I_Factor",
      "ruleName": "X异因子",
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
          "roleId": "Causal_Fragment",
          "roleName": "因果残片",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不稳定因子",
          "maxCount": 1
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Watcher",
          "roleName": "监视者",
          "maxCount": ""
        },
        {
          "roleId": "Net_Celebrity",
          "roleName": "网络名流",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": ""
        },
        {
          "roleId": "Secret_Key",
          "roleName": "密钥",
          "maxCount": ""
        },
        {
          "roleId": "Eccentric",
          "roleName": "怪杰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "a1",
          "description": "【任意能力：剧作家能力阶段】往存活的不安定因子所在版图放置1枚[密谋]（每轮限1次）"
        }
      ]
    },
    {
      "ruleId": "LL_X_SMS_Horror",
      "ruleName": "SNS恐慌",
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
          "roleId": "Causal_Fragment",
          "roleName": "因果残片",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不稳定因子",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": 1
        },
        {
          "roleId": "Watcher",
          "roleName": "监视者",
          "maxCount": ""
        },
        {
          "roleId": "Net_Celebrity",
          "roleName": "网络名流",
          "maxCount": 1
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "Secret_Key",
          "roleName": "密钥",
          "maxCount": ""
        },
        {
          "roleId": "Eccentric",
          "roleName": "怪杰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "LL_X_SMS_Horror",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "LL_X_Fabricated_Secret",
      "ruleName": "捏造的秘密",
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
          "roleId": "Causal_Fragment",
          "roleName": "因果残片",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Unstable_Factor",
          "roleName": "不稳定因子",
          "maxCount": ""
        },
        {
          "roleId": "Serial_Killer",
          "roleName": "杀人狂",
          "maxCount": ""
        },
        {
          "roleId": "Watcher",
          "roleName": "监视者",
          "maxCount": ""
        },
        {
          "roleId": "Net_Celebrity",
          "roleName": "网络名流",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
        },
        {
          "roleId": "Secret_Key",
          "roleName": "密钥",
          "maxCount": ""
        },
        {
          "roleId": "Eccentric",
          "roleName": "怪杰",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "a1",
          "description": "【强制：剧本制作时】秘钥获得无视友好，如果剧本中不存在秘钥，选择追加一名杀手、主谋或因果残片（不能追加剧本规则中已存在的身份）"
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
      "roleId": "Causal_Fragment",
      "roleName": "因果残片",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：轮回开始时】若该角色上轮轮回结束时处于死亡状态→剧作家获得[绝望+1]"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：轮回开始时】若该角色上轮轮回结束时存活并且身上有2枚或以上的[友好]，主人公获得[希望+1]"
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
          "abilityId": "ability1",
          "abilityType": "任意能力",
          "description": ""
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
      "roleId": "Watcher",
      "roleName": "监视者",
      "maxCount": 1,
      "features": [
        "不死"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：事件阶段】与该角色位于同一区域且有1枚或以上[绝望]的角色必定触发事件"
        }
      ]
    },
    {
      "roleId": "Net_Celebrity",
      "roleName": "网络名流",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：该角色死亡时】往与该角色同一初始区域的其他所有角色身上放置1枚[不安]"
        },
        {
          "abilityId": "ability2",
          "abilityType": "任意能力",
          "description": "【强制：结算该角色友好能力后】往与该角色同一初始区域的其他所有角色身上放置1枚[友好]和1枚[不安]（每轮限1次）"
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
      "roleId": "Secret_Key",
      "roleName": "密钥",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：该角色死亡时或结算该角色友好能力后】公开该角色身份"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：该角色公开身份时】当前为第1或第2轮轮回→剧作家在下一天只能打出1张行动牌，在下一天或该轮回最后一天的回合结束阶段主人公死亡"
        }
      ]
    },
    {
      "roleId": "Eccentric",
      "roleName": "怪杰",
      "maxCount": 1,
      "features": [
        "必定无视友好",
        "不死"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：常驻】当天的天数为3的倍数→该角色获得传谣人、主谋和杀人狂的能力"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：剧本制作时】必须成为某1个事件的当事人"
        }
      ]
    }
  ],
  "incidents": [
    {
      "incidentId": "LL_Anxiety_Spread",
      "incidentName": "不安扩散",
      "Incident_Effects": [
        {
          "eventEffectId": "e1",
          "description": "往任意1名角色身上放置2枚[不安]，随后往另外1名角色身上放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "LL_Murder",
      "incidentName": "谋杀",
      "Incident_Effects": [
        {
          "eventEffectId": "e1",
          "description": "与当事人位于同一区域的另外1名角色死亡"
        }
      ]
    },
    {
      "incidentId": "LL_Proxy",
      "incidentName": "代行者",
      "Incident_Effects": [
        {
          "eventEffectId": "e1",
          "description": "剧作家选择1名主人公，那位主人公选择1名角色死亡"
        }
      ]
    },
    {
      "incidentId": "LL_Hospital",
      "incidentName": "医院事故",
      "Incident_Effects": [
        {
          "eventEffectId": "e1",
          "description": "医院有1枚或以上[密谋]→位于医院的所有角色死亡"
        },
        {
          "eventEffectId": "e2",
          "description": "医院有2枚或以上[密谋]→主人公死亡"
        }
      ]
    },
    {
      "incidentId": "LL_Sudden_Outburst",
      "incidentName": "骤变",
      "Incident_Effects": [
        {
          "eventEffectId": "e1",
          "description": "当事人初始区域有2枚或以上[密谋]→主人公死亡"
        },
        {
          "eventEffectId": "LL_Sudden_Outburst_Effect_2",
          "description": "当事人初始区域有1枚或以下[密谋]→往当事人初始区域对应的版图上放置2枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "LL_Lying",
      "incidentName": "散播",
      "Incident_Effects": [
        {
          "eventEffectId": "e1",
          "description": "从任意1名角色身上移除2枚[友好]，随后往另外1名角色身上放置2枚[友好]"
        }
      ]
    },
    {
      "incidentId": "LL_Deception",
      "incidentName": "遗言",
      "Incident_Effects": [
        {
          "eventEffectId": "e1",
          "description": "当事人死亡，下轮轮回开始时，主人公获得[希望+1]"
        }
      ]
    },
    {
      "incidentId": "LL_Disappearance",
      "incidentName": "失踪",
      "Incident_Effects": [
        {
          "eventEffectId": "e1",
          "description": "将当事人移动至任意版图，随后，往当事人所在版图放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "LL_Confession",
      "incidentName": "自白",
      "Incident_Effects": [
        {
          "eventEffectId": "e1",
          "description": "当事人公开自己的身份"
        }
      ]
    },
    {
      "incidentId": "LL_Light_of_Hope",
      "incidentName": "希望之光",
      "Incident_Effects": [
        {
          "eventEffectId": "e1",
          "description": "<通过友好指示物判定是否发生>队长选择1名角色，那名角色放置1枚[希望]"
        }
      ]
    },
    {
      "incidentId": "LL_Darkness_Despair",
      "incidentName": "绝望之暗",
      "Incident_Effects": [
        {
          "eventEffectId": "e1",
          "description": "往任意1名角色身上放置1枚[绝望]"
        }
      ]
    }
  ]
};

export default Last_Lair;