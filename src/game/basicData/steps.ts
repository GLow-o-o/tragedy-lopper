// 能力触发时机枚举（用于多选）
export enum Steps {
    DownPhase = '回合开始阶段',//Ⅰ黎明：自动结算|剧作家结算
    PlaywrightAction = '剧作家行动阶段',//Ⅱ使用行动牌：剧作家行动
    ProtagonistAction = '主人公行动阶段',//Ⅱ使用行动牌：主人公行动
    ActionResolution = '行动结算阶段',//Ⅱ使用行动牌：自动结算|剧作家结算
    PlaywrightAbility = '剧作家能力阶段',//Ⅲ使用能力：剧作家结算
    ProtagonistAbility = '主人公能力阶段',//Ⅲ使用能力：主人公结算
    EventPhase = '事件阶段',//Ⅳ事件发生：自动结算|剧作家结算
    CaptainRotation = '队长轮换阶段',//Ⅴ夜晚：自动结算
    TurnEnd = '回合结束阶段',//Ⅴ夜晚：自动结算|剧作家结算；回合结束后后如果游戏未结束且当前日不是剧本最终日，则进入下一日；如果游戏已经是最终轮回最终日已结束，则进入最终决战阶段；
    TimeSpiral = '时之缝隙阶段',//夜晚结束后如果游戏结束且当轮回不是剧本最终轮回，则进入时之缝隙阶段，在不可讨论的本中主人公可以开始讨论；
    FinalGuess = '最终决战阶段',//自动结算，主人公可以随时手动进入最终决战阶段
}

export const StepsOptions: Steps[] = Object.values(Steps) as Steps[];

/** 结算 / 下一阶段 由谁可操作：与枚举行尾注释中的「剧作家结算」「主人公结算」「自动」等对应 */
export type StepFlowButtonOp = 'mastermind' | 'protagonist' | 'none';

export interface DayFlowPhaseMeta {
    step: Steps;
    /** 注释中的结算责任方；none = 仅自动结算，双方不点「结算」 */
    settleBy: StepFlowButtonOp;
    /** 注释中的流程推进方；none = 双方不点「下一阶段」（或仅占位） */
    nextBy: StepFlowButtonOp;
}

export interface DayFlowGroup {
    romanBand: string;
    bandTitle: string;
    phases: DayFlowPhaseMeta[];
}

/** 按注释中罗马数字与大段标题分组，顺序即一昼夜流程 */
export const TRAGEDY_DAY_FLOW_GROUPS: DayFlowGroup[] = [
    {
        romanBand: 'Ⅰ',
        bandTitle: '黎明',
        phases: [
            { step: Steps.DownPhase, settleBy: 'mastermind', nextBy: 'mastermind' },
        ],
    },
    {
        romanBand: 'Ⅱ',
        bandTitle: '使用行动牌',
        phases: [
            { step: Steps.PlaywrightAction, settleBy: 'none', nextBy: 'mastermind' },
            { step: Steps.ProtagonistAction, settleBy: 'protagonist', nextBy: 'protagonist' },
            { step: Steps.ActionResolution, settleBy: 'mastermind', nextBy: 'mastermind' },
        ],
    },
    {
        romanBand: 'Ⅲ',
        bandTitle: '使用能力',
        phases: [
            { step: Steps.PlaywrightAbility, settleBy: 'mastermind', nextBy: 'mastermind' },
            { step: Steps.ProtagonistAbility, settleBy: 'protagonist', nextBy: 'protagonist' },
        ],
    },
    {
        romanBand: 'Ⅳ',
        bandTitle: '事件发生',
        phases: [{ step: Steps.EventPhase, settleBy: 'mastermind', nextBy: 'mastermind' }],
    },
    {
        romanBand: 'Ⅴ',
        bandTitle: '夜晚',
        phases: [
            { step: Steps.CaptainRotation, settleBy: 'none', nextBy: 'mastermind' },
            { step: Steps.TurnEnd, settleBy: 'mastermind', nextBy: 'mastermind' },
        ],
    },
    {
        romanBand: '隙',
        bandTitle: '时之缝隙',
        phases: [{ step: Steps.TimeSpiral, settleBy: 'none', nextBy: 'protagonist' }],
    },
    {
        romanBand: '终',
        bandTitle: '最终决战',
        phases: [{ step: Steps.FinalGuess, settleBy: 'none', nextBy: 'protagonist' }],
    },
];

/** 每日主流程：仅 Ⅰ–Ⅴ（黎明→夜晚），不含时之缝隙与最终决战 */
export const TRAGEDY_DAY_MAIN_FLOW_GROUPS: readonly DayFlowGroup[] = TRAGEDY_DAY_FLOW_GROUPS.slice(0, 5);

/** 夜晚（Ⅴ）与最终决战（终）之间的「时之缝隙」分组，与 `TRAGEDY_DAY_FLOW_GROUPS` 中顺序一致 */
export const TRAGEDY_TIME_SPIRAL_GROUP: DayFlowGroup = TRAGEDY_DAY_FLOW_GROUPS[5]!;

export interface DayMainFlowFlatEntry {
    group: DayFlowGroup;
    meta: DayFlowPhaseMeta;
}

/** 一天内按顺序经历的子阶段（用于与局内 `dayFlowFlatIndex` 对齐） */
export const TRAGEDY_DAY_MAIN_FLOW_FLAT: readonly DayMainFlowFlatEntry[] = TRAGEDY_DAY_MAIN_FLOW_GROUPS.flatMap(
    (group) => group.phases.map((meta) => ({ group, meta })),
);

export type FlowPanelView = 'mastermind' | 'protagonist' | 'spectator';

export function canUseStepFlowButton(op: StepFlowButtonOp, view: FlowPanelView): boolean {
    if (op === 'none') return false;
    if (view === 'spectator') return false;
    if (op === 'mastermind') return view === 'mastermind';
    return view === 'protagonist';
}
