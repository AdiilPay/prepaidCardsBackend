import ServerProfile from '@utils/interfaces/server/profile';


export interface CardWithProfile {
    id: number;
    profile: ServerProfile;
    profileID?: never;
    enabled: boolean;
}

export interface CardWithProfileID {
    id: number;
    profile?: never;
    profileID: number;
    enabled: boolean;
}

export type Carte = CardWithProfile | CardWithProfileID;