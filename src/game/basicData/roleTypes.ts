// 可选的 NPC 角色类型（用于构建多选字段）
export enum RoleType {
    Girl = '少女',
    Boy = '少年',
    Student = '学生',
    Adult = '成人',
    Male = '男性',
    Female = '女性',
    Animal = '动物',
    Fictional = '虚构',
    Construct = '造物',
    Tree = '树木',
    //妹妹角色
    Little_Sister = '妹妹',
}
// 导出选项数组，便于在 UI 中构建多选控件
export const RoleTypeOptions: RoleType[] = Object.values(RoleType) as RoleType[];