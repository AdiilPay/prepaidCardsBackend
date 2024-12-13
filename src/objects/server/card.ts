import ServerProfile from '@serverObjects/profile';

export default interface Card {
    id: number;
    profile: ServerProfile;
    enabled: boolean;
}
