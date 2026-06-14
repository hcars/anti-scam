export interface Group {
  group_id: number;
  owner_id: number;
  group_name: string;
}

export interface Challenge {
  id?: number;
  group_id: number;
  challenge: string;
  response: string;
  creation_date: string;
}

export interface ChallengeResponse {
  challenge: string;
  response: string;
  daysLeft: number;
  creationDate?: string;
}

export interface AuthSession {
  user?: {
    name: string;
    email: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
}
