// src/apps/web/lib/mock-user.ts

export type Membership = "normal" | "vip" | "premium";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  membership: Membership;
  avatarUrl?: string;
};

