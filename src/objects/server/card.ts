import ServerProfile from '@serverObjects/profile';

export default interface Card {
    id: bigint;
    profile: ServerProfile;
    enabled: boolean;
}
