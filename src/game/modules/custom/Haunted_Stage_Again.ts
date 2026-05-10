import { ModuleBasicInfo } from '../basicInfo/basicInfo_module';

export const Haunted_Stage_Again: ModuleBasicInfo = {
  "id": "Haunted_Stage_Again",
  "fullName": "Haunted stage Again",
  "shortName": "HSA",
  "description": "※【牺牲者】※\n放置在版图上的[密谋]视作身份为平民的尸体\n（如果其被复活，则从版图上移除）\"\n\n※【群众事件】※\n群众事件属于一种事件特性。\n群众事件的当事人并非1名角色，而是指定了1块版图，所指定的版图中所有群众即为事件的当事人（例：「诅咒活化」当事人被指定为「学校群众」）\n当版图中有着等于或超过事件规定的尸体数量时，事件就会发生\n（版图上的[密谋]也视作尸体）\n\n※【额外规则】※\n诅咒牌使用Ex牌来表示\n诅咒牌有位于版图上（地缚灵）和位于角色卡上（附身）两种状态\n如果诅咒牌位于角色卡牌上，则将其叠放在对应卡牌来表示\n在每回合的回合结束阶段，所有诅咒牌必须分别依照所处状态决定效果并同时进行处理（该处理优先于其余所有处理）\n\n※\n诅咒牌位于版图上\n选择同区域的1名角色，将诅咒牌堆叠在那名角色身上\n\n※\n诅咒牌位于卡牌上\n无论当前卡牌的生死状态，尝试杀害带有诅咒牌的卡牌\n随后，无论该卡牌在处理后是否依然生存，均将诅咒牌取下，放置于该卡牌所在的版图上",
  "rules": [
    {
      "ruleId": "HSA_Y_Noble_Blood",
      "ruleName": "高贵的血脉",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": 1
        },
        {
          "roleId": "Vampire",
          "roleName": "吸血鬼",
          "maxCount": 1
        },
        {
          "roleId": "Werewolf",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Nightmare",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Ghost",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Paper_Tiger",
          "roleName": "纸老虎",
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
          "roleId": "Coward",
          "roleName": "胆小鬼",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Zombie",
          "roleName": "丧尸",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：剧本制作时】吸血鬼与关键人物必须互为异性"
        }
      ]
    },
    {
      "ruleId": "HSA_Y_Moon_Beast",
      "ruleName": "月夜凶兽",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Vampire",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Werewolf",
          "roleName": "狼人",
          "maxCount": 1
        },
        {
          "roleId": "Nightmare",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Ghost",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Paper_Tiger",
          "roleName": "纸老虎",
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
          "roleId": "Coward",
          "roleName": "胆小鬼",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Zombie",
          "roleName": "丧尸",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "HSA_Y_Moon_Beast",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "HSA_Y_Fog_Nightmare",
      "ruleName": "雾中夜惊梦",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Vampire",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Werewolf",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Nightmare",
          "roleName": "梦魇",
          "maxCount": 1
        },
        {
          "roleId": "Ghost",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Paper_Tiger",
          "roleName": "纸老虎",
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
          "roleId": "Coward",
          "roleName": "胆小鬼",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Zombie",
          "roleName": "丧尸",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "HSA_Y_Fog_Nightmare",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "HSA_Y_Tomb_Zombie",
      "ruleName": "古墓活尸",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Vampire",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Werewolf",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Nightmare",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Ghost",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Paper_Tiger",
          "roleName": "纸老虎",
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
          "roleId": "Coward",
          "roleName": "胆小鬼",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Zombie",
          "roleName": "丧尸",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：常驻】平民、胆小鬼和纸老虎的尸体身份变为丧尸"
        }
      ]
    },
    {
      "ruleId": "HSA_Y_Cursed_Land",
      "ruleName": "被诅咒的土地",
      "ruleType": "Y",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Vampire",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Werewolf",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Nightmare",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Ghost",
          "roleName": "鬼魂",
          "maxCount": 1
        },
        {
          "roleId": "Paper_Tiger",
          "roleName": "纸老虎",
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
          "roleId": "Coward",
          "roleName": "胆小鬼",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Zombie",
          "roleName": "丧尸",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【任意能力：轮回开始时】往鬼魂的初始区域对应的版图上放置1张诅咒牌"
        },
        {
          "ruleId": "addRule_02",
          "description": "【任意能力：回合结束阶段】本回合结束阶段结算诅咒牌时，1张或以上位于版图上的诅咒牌没有目标角色可以放置→主人公死亡"
        }
      ]
    },
    {
      "ruleId": "HSA_X_Panic_Party",
      "ruleName": "心慌派对",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Vampire",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Werewolf",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Nightmare",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Ghost",
          "roleName": "鬼魂",
          "maxCount": 1
        },
        {
          "roleId": "Paper_Tiger",
          "roleName": "纸老虎",
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
          "maxCount": 1
        },
        {
          "roleId": "Coward",
          "roleName": "胆小鬼",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": 1
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Zombie",
          "roleName": "丧尸",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "HSA_X_Panic_Party",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "HSA_X_Love_Storm",
      "ruleName": "恋爱风景线",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Vampire",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Werewolf",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Nightmare",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Ghost",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Paper_Tiger",
          "roleName": "纸老虎",
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
          "roleId": "Coward",
          "roleName": "胆小鬼",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": 1
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": 1
        },
        {
          "roleId": "Zombie",
          "roleName": "丧尸",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "HSA_X_Love_Storm",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "HSA_X_Witch_Feast",
      "ruleName": "魔女遗咒",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Vampire",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Werewolf",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Nightmare",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Ghost",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Paper_Tiger",
          "roleName": "纸老虎",
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
          "roleId": "Coward",
          "roleName": "胆小鬼",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": 1
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Zombie",
          "roleName": "丧尸",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【任意能力：轮回开始时】往魔女的初始区域对应的版图上放置1张诅咒牌"
        }
      ]
    },
    {
      "ruleId": "HSA_X_Girl_Crisis",
      "ruleName": "少女大危机",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": 1
        },
        {
          "roleId": "Vampire",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Werewolf",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Nightmare",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Ghost",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Paper_Tiger",
          "roleName": "纸老虎",
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
          "roleId": "Coward",
          "roleName": "胆小鬼",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Zombie",
          "roleName": "丧尸",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：剧本制作时】关键人物必须有少女属性"
        }
      ]
    },
    {
      "ruleId": "HSA_X_Monsters_Plot",
      "ruleName": "怪物们的阴谋",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Vampire",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Werewolf",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Nightmare",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Ghost",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Paper_Tiger",
          "roleName": "纸老虎",
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
          "roleId": "Coward",
          "roleName": "胆小鬼",
          "maxCount": ""
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Zombie",
          "roleName": "丧尸",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【任意能力：剧作家能力阶段】往拥有无视友好身份特性的角色所在版图放置1枚[密谋]（每日限1次，每轮限2次）"
        }
      ]
    },
    {
      "ruleId": "HSA_X_Panic_Delusion",
      "ruleName": "恐慌与妄想",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Vampire",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Werewolf",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Nightmare",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Ghost",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Paper_Tiger",
          "roleName": "纸老虎",
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
          "maxCount": 1
        },
        {
          "roleId": "Coward",
          "roleName": "胆小鬼",
          "maxCount": 1
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": 1
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Zombie",
          "roleName": "丧尸",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "HSA_X_Panic_Delusion",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "HSA_X_Unheeding",
      "ruleName": "不听劝的人",
      "ruleType": "X",
      "rolesLimits": [
        {
          "roleId": "Key_Person",
          "roleName": "关键人物",
          "maxCount": ""
        },
        {
          "roleId": "Vampire",
          "roleName": "吸血鬼",
          "maxCount": ""
        },
        {
          "roleId": "Werewolf",
          "roleName": "狼人",
          "maxCount": ""
        },
        {
          "roleId": "Nightmare",
          "roleName": "梦魇",
          "maxCount": ""
        },
        {
          "roleId": "Ghost",
          "roleName": "鬼魂",
          "maxCount": ""
        },
        {
          "roleId": "Paper_Tiger",
          "roleName": "纸老虎",
          "maxCount": 1
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
          "roleId": "Coward",
          "roleName": "胆小鬼",
          "maxCount": 1
        },
        {
          "roleId": "Witch",
          "roleName": "魔女",
          "maxCount": ""
        },
        {
          "roleId": "Suitor",
          "roleName": "求爱者",
          "maxCount": ""
        },
        {
          "roleId": "Sweetheart",
          "roleName": "心上人",
          "maxCount": ""
        },
        {
          "roleId": "Zombie",
          "roleName": "丧尸",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "HSA_X_Unheeding",
          "description": ""
        }
      ]
    }
  ],
  "roles": [
    {
      "roleId": "Key_Person",
      "roleName": "关键人物",
      "maxCount": 1,
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
      "roleId": "Vampire",
      "roleName": "吸血鬼",
      "maxCount": "",
      "features": [
        "无视友好",
        "不死"
      ],
      "abilitys": [
        {
          "abilityId": "ability0",
          "abilityType": "强制",
          "description": "【任意能力：回合结束阶段】同一区域1名关键人物身上有2枚或以上[密谋]→那名关键人物死亡"
        },
        {
          "abilityId": "ability2",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】该角色的初始区域有2具或以上的尸体→主人公死亡"
        }
      ]
    },
    {
      "roleId": "Werewolf",
      "roleName": "狼人",
      "maxCount": "",
      "features": [
        "无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【任意能力：回合结束阶段】本回合曾发生过[疯狂之夜]事件→主人公死亡"
        },
        {
          "abilityId": "ability2",
          "abilityType": "任意能力",
          "description": "【强制：常驻】剧作家不可以往该角色身上设置任何行动卡"
        }
      ]
    },
    {
      "roleId": "Nightmare",
      "roleName": "梦魇",
      "maxCount": "",
      "features": [
        "无视友好",
        "不死"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【任意能力：回合结束阶段】与该角色位于同一区域的1名角色死亡"
        },
        {
          "abilityId": "ability2",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】所有尸体上放置的[密谋]总数为3枚或以上→主人公死亡"
        }
      ]
    },
    {
      "roleId": "Ghost",
      "roleName": "鬼魂",
      "maxCount": 1,
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：剧作家能力阶段】如果该卡牌为死亡状态→往位于同一区域或该卡牌初始区域的1名角色身上放置1枚[不安]"
        }
      ]
    },
    {
      "roleId": "Paper_Tiger",
      "roleName": "纸老虎",
      "maxCount": "",
      "features": [
        "不死"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：常驻】该角色身上有2枚或以上的[不安]→该角色失去不死的身份特性，获得必定无视友好的身份特性"
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
      "roleId": "Coward",
      "roleName": "胆小鬼",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：剧作家能力阶段】该角色身上有2枚或以上的[不安]→选择1块相邻版图，将该角色移动至那块版图"
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
          "abilityId": "Ability_10_1",
          "abilityType": "任意能力",
          "description": ""
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
          "abilityId": "ability2",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】该角色身上有1枚或以上[密谋]且有3枚或以上[不安]→主人公死亡"
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
      "roleId": "Zombie",
      "roleName": "丧尸",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：回合结束阶段】选择1块丧尸数量大于非丧尸的角色数量，且至少有1名角色存活的版图→使该版图中的1名角色死亡（所有丧尸合计，每日限1次）"
        },
        {
          "abilityId": "ability2",
          "abilityType": "任意能力",
          "description": "【任意能力：回合结束阶段】将1具身份为丧尸的尸体移动至相邻版图（所有丧尸合计，每日限1次）"
        }
      ]
    }
  ],
  "incidents": [
    {
      "incidentId": "HSA_Desecration_Murder",
      "incidentName": "亵渎杀人",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "与当事人位于同一区域的另外1名角色死亡，或往当事人所在版图放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "HSA_Unease_Spread",
      "incidentName": "不安扩散",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "往任意1名角色身上放置2枚[不安]，随后往另外1名角色身上放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "HSA_Disappearance",
      "incidentName": "失踪",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "将当事人移动至任意版图，随后，往当事人所在版图放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "HSA_Evil_Pollution",
      "incidentName": "邪气污染",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "往神社放置2枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "HSA_Funeral",
      "incidentName": "送葬",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "<当事人不安限度-1>队长选择1名角色，那名角色死亡"
        }
      ]
    },
    {
      "incidentId": "HSA_Kotodama_Curse",
      "incidentName": "言灵诅咒",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "往当事人身上放置1张Ex牌"
        }
      ]
    },
    {
      "incidentId": "HSA_Solitary_Guard",
      "incidentName": "孤守",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "将与当事人位于同一区域的其它所有角色分别移动至其它任意版图"
        }
      ]
    },
    {
      "incidentId": "HSA_Crazy_Night",
      "incidentName": "疯狂之夜",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "<群众事件><必要尸体数0>该事件发生时，游戏中有6具或以上的丧尸→本回合的回合结束阶段时，主人公死亡"
        }
      ]
    },
    {
      "incidentId": "HSA_Curse_Activation",
      "incidentName": "诅咒活化",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "<群众事件><必要尸体数1>往当事人所在版图放置Ex牌"
        }
      ]
    },
    {
      "incidentId": "HSA_Cloud_Powder",
      "incidentName": "污秽溢出",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "<群众事件><必要尸体数2>往任意1名角色身上放置2枚[不安]，随后往任意1块版图上放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "HSA_Dead_Apologetics",
      "incidentName": "死者默示录",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "<群众事件><必要尸体数2>使当事人所在版图中的所有角色死亡"
        },
        {
          "eventEffectId": "HSA_Dead_Apologetics_Effect_2",
          "description": "之后，如果当事人所在版图有5具或以上的尸体，则主人公死亡"
        }
      ]
    }
  ]
};

export default Haunted_Stage_Again;