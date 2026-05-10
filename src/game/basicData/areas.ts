// 区域枚举（用于 initialArea / forbiddenAreas / npcState.currentArea）
export enum Area {
    Hospital = '医院',
    Shrine = '神社',
    City = '都市',
    School = '学校',
    Faraway = '远方',
}
// 导出选项数组，便于在 UI 中构建多选控件
export const AreaOptions: Area[] = Object.values(Area) as Area[];
export type BoardArea = Exclude<Area, Area.Faraway>;
export const BoardAreaOptions: BoardArea[] = [
    Area.Hospital,
    Area.Shrine,
    Area.City,
    Area.School,
];