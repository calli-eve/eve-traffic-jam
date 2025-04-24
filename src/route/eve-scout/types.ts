export interface Welcome {
    id:                string;
    created_at:        Date;
    created_by_id:     number;
    created_by_name:   string;
    updated_at:        Date;
    updated_by_id:     number;
    updated_by_name:   string;
    completed_at:      Date;
    completed_by_id:   number;
    completed_by_name: string;
    completed:         boolean;
    wh_exits_outward:  boolean;
    wh_type:           string;
    max_ship_size:     MaxShipSize;
    expires_at:        Date;
    remaining_hours:   number;
    signature_type:    SignatureType;
    out_system_id:     number;
    out_system_name:   OutSystemName;
    out_signature:     string;
    in_system_id:      number;
    in_system_class:   string;
    in_system_name:    string;
    in_region_id:      number;
    in_region_name:    string;
    in_signature:      string;
}

export enum MaxShipSize {
    Capital = "capital",
    Large = "large",
    Medium = "medium",
    Xlarge = "xlarge",
}

export enum OutSystemName {
    Thera = "Thera",
    Turnur = "Turnur",
}

export enum SignatureType {
    Wormhole = "wormhole",
}
