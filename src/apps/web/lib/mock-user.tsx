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

export const MOCK_USER: UserProfile = {
  id: "012345",
  name: "Quang Thanh",
  email: "quang.thanh@example.com",
  phone: "0900 000 000",
  membership: "normal",
  avatarUrl: "/assets/logos/avatar.png",
};
