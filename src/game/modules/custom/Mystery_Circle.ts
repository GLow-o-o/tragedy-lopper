import { ModuleBasicInfo } from '../basicInfo/basicInfo_module';

export const Mystery_Circle: ModuleBasicInfo = {
  "id": "Mystery_Circle",
  "fullName": "Mystery Circle",
  "shortName": "MC",
  "description": "独立模组。Y：谋杀计划～士的宁毒液；X：潜伏的杀人狂～双子的诡计。",
  "rules": [
    {
      "ruleId": "MC_Y_Murder_Plan",
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
          "roleId": "Poisoner",
          "roleName": "投毒者",
          "maxCount": ""
        },
        {
          "roleId": "Fool",
          "roleName": "愚者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
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
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Psychologist",
          "roleName": "心理医生",
          "maxCount": ""
        },
        {
          "roleId": "Detective",
          "roleName": "侦探",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Twin",
          "roleName": "双胞胎",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "MC_Y_Murder_Plan",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "MC_Y_Web_Of_Events",
      "ruleName": "事件交织的罗网",
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
          "roleId": "Poisoner",
          "roleName": "投毒者",
          "maxCount": ""
        },
        {
          "roleId": "Fool",
          "roleName": "愚者",
          "maxCount": 1
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
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
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Psychologist",
          "roleName": "心理医生",
          "maxCount": ""
        },
        {
          "roleId": "Detective",
          "roleName": "侦探",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Twin",
          "roleName": "双胞胎",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】Ex槽为3或以上"
        }
      ]
    },
    {
      "ruleId": "MC_Y_Plan_By_Thread",
      "ruleName": "命悬一线的计划",
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
          "maxCount": 1
        },
        {
          "roleId": "Brain",
          "roleName": "主谋",
          "maxCount": 1
        },
        {
          "roleId": "Poisoner",
          "roleName": "投毒者",
          "maxCount": ""
        },
        {
          "roleId": "Fool",
          "roleName": "愚者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
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
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Psychologist",
          "roleName": "心理医生",
          "maxCount": ""
        },
        {
          "roleId": "Detective",
          "roleName": "侦探",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Twin",
          "roleName": "双胞胎",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】Ex槽为1或以下"
        }
      ]
    },
    {
      "ruleId": "MC_Y_Dark_Academy",
      "ruleName": "黑暗学园",
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
          "roleId": "Poisoner",
          "roleName": "投毒者",
          "maxCount": ""
        },
        {
          "roleId": "Fool",
          "roleName": "愚者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
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
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Psychologist",
          "roleName": "心理医生",
          "maxCount": ""
        },
        {
          "roleId": "Detective",
          "roleName": "侦探",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Twin",
          "roleName": "双胞胎",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】学校的[密谋]为X枚或以上（X=当前轮回数-1）（第一轮轮回必定失败）"
        }
      ]
    },
    {
      "ruleId": "MC_Y_Strychnine",
      "ruleName": "士的宁毒液",
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
          "roleId": "Poisoner",
          "roleName": "投毒者",
          "maxCount": 1
        },
        {
          "roleId": "Fool",
          "roleName": "愚者",
          "maxCount": 1
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
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
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Psychologist",
          "roleName": "心理医生",
          "maxCount": ""
        },
        {
          "roleId": "Detective",
          "roleName": "侦探",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Twin",
          "roleName": "双胞胎",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：常驻】判定「连续杀人」「自杀」是否发生时，[密谋]视作[不安]处理"
        }
      ]
    },
    {
      "ruleId": "MC_X_Lurking_SK",
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
          "roleId": "Poisoner",
          "roleName": "投毒者",
          "maxCount": ""
        },
        {
          "roleId": "Fool",
          "roleName": "愚者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
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
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Psychologist",
          "roleName": "心理医生",
          "maxCount": ""
        },
        {
          "roleId": "Detective",
          "roleName": "侦探",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Twin",
          "roleName": "双胞胎",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "MC_X_Lurking_SK",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "MC_X_Isolation_Ward",
      "ruleName": "隔离病房惊魂记",
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
          "roleId": "Poisoner",
          "roleName": "投毒者",
          "maxCount": ""
        },
        {
          "roleId": "Fool",
          "roleName": "愚者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
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
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": 1
        },
        {
          "roleId": "Psychologist",
          "roleName": "心理医生",
          "maxCount": 1
        },
        {
          "roleId": "Detective",
          "roleName": "侦探",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Twin",
          "roleName": "双胞胎",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【强制：轮回开始时】上轮轮回结束时Ex槽为2或以下→Ex槽增加1"
        }
      ]
    },
    {
      "ruleId": "MC_X_Gunpowder",
      "ruleName": "火药的味道",
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
          "roleId": "Poisoner",
          "roleName": "投毒者",
          "maxCount": ""
        },
        {
          "roleId": "Fool",
          "roleName": "愚者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
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
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Psychologist",
          "roleName": "心理医生",
          "maxCount": ""
        },
        {
          "roleId": "Detective",
          "roleName": "侦探",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Twin",
          "roleName": "双胞胎",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "addRule_01",
          "description": "【失败条件：轮回结束时】所有生存角色身上的[不安]总数为12枚或以上"
        }
      ]
    },
    {
      "ruleId": "MC_X_Famous_Detective",
      "ruleName": "我是名侦探",
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
          "roleId": "Poisoner",
          "roleName": "投毒者",
          "maxCount": ""
        },
        {
          "roleId": "Fool",
          "roleName": "愚者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
          "maxCount": 1
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
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Psychologist",
          "roleName": "心理医生",
          "maxCount": ""
        },
        {
          "roleId": "Detective",
          "roleName": "侦探",
          "maxCount": 1
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Twin",
          "roleName": "双胞胎",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "MC_X_Famous_Detective",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "MC_X_Dance_Of_Fool",
      "ruleName": "愚者之舞",
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
          "roleId": "Poisoner",
          "roleName": "投毒者",
          "maxCount": ""
        },
        {
          "roleId": "Fool",
          "roleName": "愚者",
          "maxCount": 1
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
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
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Psychologist",
          "roleName": "心理医生",
          "maxCount": ""
        },
        {
          "roleId": "Detective",
          "roleName": "侦探",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Twin",
          "roleName": "双胞胎",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "MC_X_Dance_Of_Fool",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "MC_X_Absolute_Will",
      "ruleName": "绝对意志",
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
          "roleId": "Poisoner",
          "roleName": "投毒者",
          "maxCount": ""
        },
        {
          "roleId": "Fool",
          "roleName": "愚者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
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
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": ""
        },
        {
          "roleId": "Psychologist",
          "roleName": "心理医生",
          "maxCount": ""
        },
        {
          "roleId": "Detective",
          "roleName": "侦探",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": 1
        },
        {
          "roleId": "Twin",
          "roleName": "双胞胎",
          "maxCount": ""
        }
      ],
      "addRules": [
        {
          "ruleId": "MC_X_Absolute_Will",
          "description": ""
        }
      ]
    },
    {
      "ruleId": "MC_X_Twin_Trick",
      "ruleName": "双子的诡计",
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
          "roleId": "Poisoner",
          "roleName": "投毒者",
          "maxCount": ""
        },
        {
          "roleId": "Fool",
          "roleName": "愚者",
          "maxCount": ""
        },
        {
          "roleId": "Conspiracy_Theorist",
          "roleName": "传谣人",
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
          "roleId": "Paranoid",
          "roleName": "偏执狂",
          "maxCount": 1
        },
        {
          "roleId": "Psychologist",
          "roleName": "心理医生",
          "maxCount": ""
        },
        {
          "roleId": "Detective",
          "roleName": "侦探",
          "maxCount": ""
        },
        {
          "roleId": "OCD",
          "roleName": "强迫症",
          "maxCount": ""
        },
        {
          "roleId": "Twin",
          "roleName": "双胞胎",
          "maxCount": 1
        }
      ],
      "addRules": [
        {
          "ruleId": "MC_X_Twin_Trick",
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
          "description": "【任意能力：剧作家能力阶段】往同一区域任意一名角色身上，或该角色所在的版图上放置1枚[密谋]"
        }
      ]
    },
    {
      "roleId": "Poisoner",
      "roleName": "投毒者",
      "maxCount": "",
      "features": [
        "无视友好"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：回合结束阶段】Ex槽为2或以上→使同一区域的1名角色死亡（每轮限1次）"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：回合结束阶段】Ex槽为4或以上→主人公死亡"
        }
      ]
    },
    {
      "roleId": "Fool",
      "roleName": "愚者",
      "maxCount": 1,
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：剧本制作时】必须成为某1个事件的当事人"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：担任当事人的事件完成结算后】移除该卡牌上所有的[不安]"
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
      "roleId": "Psychologist",
      "roleName": "心理医生",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：剧作家能力阶段】Ex槽为1或以上→移除同一区域中自身以外的1名角色身上的1枚[不安]"
        }
      ]
    },
    {
      "roleId": "Detective",
      "roleName": "侦探",
      "maxCount": "",
      "features": [
        "不死"
      ],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：剧本制作时】不可以成为事件的当事人"
        },
        {
          "abilityId": "Ability_11_2",
          "abilityType": "任意能力",
          "description": "【强制：事件阶段】Ex槽为0→如果与当天事件的当事人（存活）处于同一区域，则事件必定发生"
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
      "roleId": "Twin",
      "roleName": "双胞胎",
      "maxCount": "",
      "features": [],
      "abilitys": [
        {
          "abilityId": "ability1",
          "abilityType": "强制",
          "description": "【强制：剧本制作时】必须成为某1个事件的当事人"
        },
        {
          "abilityId": "ability2",
          "abilityType": "强制",
          "description": "【强制：结算该角色担任当事人的事件时】该角色视为位于本来所在位置对角线上的版图"
        }
      ]
    }
  ],
  "incidents": [
    {
      "incidentId": "MC_Serial_Killing",
      "incidentName": "连续杀人",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "与当事人位于同一区域的另外1名角色死亡"
        },
        {
          "eventEffectId": "MC_Serial_Killing_Effect_2",
          "description": "1名角色可以同时担任多个连续杀人事件的当事人"
        }
      ]
    },
    {
      "incidentId": "MC_Terror_Attack",
      "incidentName": "恐怖袭击",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "都市有1枚或以上[密谋]→位于都市的所有角色死亡"
        },
        {
          "eventEffectId": "eventEffect_02",
          "description": "都市有2枚或以上[密谋]→主人公失败"
        }
      ]
    },
    {
      "incidentId": "MC_Hospital",
      "incidentName": "医院事故",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "医院有1枚或以上[密谋]→位于医院的所有角色死亡"
        },
        {
          "eventEffectId": "eventEffect_02",
          "description": "医院有2枚或以上[密谋]→主人公失败"
        }
      ]
    },
    {
      "incidentId": "MC_Suicide",
      "incidentName": "自杀",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "当事人死亡"
        }
      ]
    },
    {
      "incidentId": "MC_Unease_Spread",
      "incidentName": "不安扩散",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "往任意1名角色身上放置2枚[不安]，随后往另外1名角色身上放置1枚[密谋]"
        }
      ]
    },
    {
      "incidentId": "MC_Collapse",
      "incidentName": "前兆",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "<当事人不安限度-1>往和当事人位于同一区域的1名角色身上放置1枚[不安]"
        }
      ]
    },
    {
      "incidentId": "MC_Bizarre_Murder",
      "incidentName": "猎奇杀人",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "<当事人不安限度+1><Ex槽增加2>按照「连续杀人」「不安扩散」的顺序结算事件"
        }
      ]
    },
    {
      "incidentId": "MC_Disguised_Suicide",
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
      "incidentId": "MC_Suspicious_Letter",
      "incidentName": "可疑信件",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "将和当事人位于同一区域的1名角色移动至任意版图，如果那名角色被移动至其它版图，则次日那名角色无法移动"
        }
      ]
    },
    {
      "incidentId": "MC_Blockade",
      "incidentName": "封锁",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "指定当事人所在版图，自事件发生日起算，3天内无法通过移动进入或离开该版图"
        }
      ]
    },
    {
      "incidentId": "MC_Silver_Bullet",
      "incidentName": "银色子弹",
      "Incident_Effects": [
        {
          "eventEffectId": "eventEffect_01",
          "description": "<Ex槽不增加>该阶段结束时，本轮轮回结束"
        }
      ]
    }
  ],
  "exSlot": {
    "name": "事件发生次数",
    "description": "每轮轮回开始时Ex槽为0。\n事件发生时，Ex槽提升1点。"
  }
};

export default Mystery_Circle;