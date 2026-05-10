// firstSteps_Example 模组的事件信息

import { IncidentBasicInfo } from "../basicInfo/basicInfo_incident";

//谋杀
export const Murder: IncidentBasicInfo = {
    incidentId: 'Murder',
    incidentName: '谋杀',
    Incident_Effects: [
        {
            eventEffectId: 'eventEffect_01',
            description: '与当事人位于同一区域的另外1名角色死亡'
        }
    ]
};
//不安扩散
export const IncreasingUnease: IncidentBasicInfo = {
    incidentId: 'Increasing_Unease',
    incidentName: '不安扩散',
    Incident_Effects: [
        {
            eventEffectId: 'eventEffect_01',
            description: '往任意1名角色身上放置2枚[不安]，随后往另外1名角色身上放置1枚[密谋]'
        }
    ]
};
//自杀
export const Suicide: IncidentBasicInfo = {
    incidentId: 'Suicide',
    incidentName: '自杀',
    Incident_Effects: [
        {
            eventEffectId: 'eventEffect_01',
            description: '当事人死亡'
        }
    ]
};
//医院事件
export const Hospital_Incident: IncidentBasicInfo = {
    incidentId: 'Hospital_Incident',
    incidentName: '医院事故',
    Incident_Effects: [
        {
            eventEffectId: 'eventEffect_01',
            description: '医院有1枚或以上[密谋]→位于医院的所有角色死亡'
        },
        {
            eventEffectId: 'eventEffect_02',
            description: '医院有2枚或以上[密谋]→主人公死亡'
        }
    ]
};
//远距离谋杀
export const Faraway_Murder: IncidentBasicInfo = {
    incidentId: 'Faraway_Murder',
    incidentName: '远距离谋杀',
    Incident_Effects: [
        {
            eventEffectId: 'eventEffect_01',
            description: '与当事人位于同一区域的另外1名角色死亡'
        }
    ]
};
//失踪
export const Missing_Person: IncidentBasicInfo = {
    incidentId: 'Missing_Person',
    incidentName: '失踪',
    Incident_Effects: [
        {
            eventEffectId: 'eventEffect_01',
            description: '将当事人移动至任意版图，随后，往当事人所在版图放置1枚[密谋]'
        }
    ]
};
//散播
export const Spreading: IncidentBasicInfo = {
    incidentId: 'Spreading_Unease',
    incidentName: '散播',
    Incident_Effects: [
        {
            eventEffectId: 'eventEffect_01',
            description: '从任意1名角色身上移除2枚[友好]，随后，往另外1名角色身上放置2枚[友好]'
        }
    ]
};

export const incidentsIndex = {
    Murder: Murder,
    IncreasingUnease: IncreasingUnease,
    Suicide: Suicide,
    Hospital_Incident: Hospital_Incident,
    Faraway_Murder: Faraway_Murder,
    Missing_Person: Missing_Person,
    Spreading: Spreading
}