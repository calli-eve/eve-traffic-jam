import { SystemEdge } from '../../types/types'

export interface Wormohole {
    id:          string;
    initialID:   string;
    secondaryID: string;
    type:        null | string;
    parent:      Parent | null;
    life:        Life;
    mass:        Life;
    maskID:      string;
}

export enum Life {
    Critical = "critical",
    Stable = "stable",
}

export enum Parent {
    Empty = "",
    Initial = "initial",
    Secondary = "secondary",
}

export interface Signature {
    id:             string;
    signatureID:    string;
    systemID:       string;
    type:           string;
    name:           string;
    bookmark:       null;
    lifeTime:       string;
    lifeLeft:       string;
    lifeLength:     string;
    createdByID:    string;
    createdByName:  string;
    modifiedByID:   string;
    modifiedByName: string;
    modifiedTime:   string;
    maskID:         string;
}

export interface TripSystemEdge extends SystemEdge {
    fromSolarSystemID: number
    signatureSrc: string | null
    signatureDst: string | null
    nodeName: string | null
    wormholeTypeSrc: string | null
    wormholeTypeDst: string | null
    wormholeMass: 'stable' | 'critical'
    wormholeEol: 'stable' | 'critical'
}