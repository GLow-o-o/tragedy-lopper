
interface Incident_Effect {
    eventEffectId: string;
    description: string;
}

export interface IncidentBasicInfo {
    incidentId: string;
    incidentName: string;
    Incident_Effects: Incident_Effect[];
}

