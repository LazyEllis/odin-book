interface UserBase {
  name: string;
  username: string;
}

export interface UserCreate extends UserBase {
  password: string;
  passwordConfirmation: string;
}

export interface UserUpdate extends UserBase {
  description: string | null;
  location: string | null;
  url: string | null;
}

export interface UserPublic extends UserBase {
  id: number;
  createdAt: Date;
  description: string | null;
  location: string | null;
  profileImageUrl: string | null;
  pinnedPostId: number | null;
  url: string | null;
  _count: {
    followers: number;
    following: number;
  };
  connectionStatus: {
    isFollower: boolean;
    isFollowing: boolean;
  };
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Token {
  token: string;
}
