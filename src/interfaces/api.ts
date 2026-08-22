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
  profileImageUrl: string;
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

interface Author {
  id: number;
  name: string;
  username: string;
  profileImageUrl: string;
}

interface PostReference {
  id: number;
  text: string;
  attachment: string;
  createdAt: string;
  author: Author;
}

interface PostBase {
  text: string;
}

export interface PostCreate extends PostBase {
  inReplyToPostId: number;
  quotedPostId: number;
}

export interface PostPublic extends PostBase {
  id: number;
  attachment: null;
  createdAt: string;
  author: Author;
  conversationId: number | null;
  repliedTo: PostReference | null;
  quotedPost: PostReference | null;
  _count: {
    reposts: number;
    replies: number;
    likes: number;
    quotes: number;
    bookmarks: number;
  };
  interactionStatus: {
    isLiked: boolean;
    isReposted: boolean;
    isBookmarked: boolean;
  };
}
