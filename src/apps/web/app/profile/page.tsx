"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_USER, type UserProfile, type Membership } from "@/lib/mock-user";

const MEMBERSHIP_LABELS: Record<Membership, string> = {
  normal: "Thường",
  vip: "VIP",
  premium: "Premium",
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(
    user.avatarUrl ?? "/assets/logos/avatar.png",
  );

  // simple controlled inputs
  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);

    // in real app you'd upload + store URL from backend
    setUser((prev) => ({ ...prev, avatarUrl: url }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // here you'd call your API: await updateUser(user)
    console.log("Saving profile:", user);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUser(MOCK_USER); // reset to original mock
    setAvatarPreview(MOCK_USER.avatarUrl ?? "/assets/logos/avatar.png");
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="flex min-h-screen bg-brand-bg">
        <div className="flex flex-1 flex-col">
          <div className="px-6 pt-4 lg:px-8">
          </div>

          <main className="px-6 pb-8 pt-4 lg:px-8">
            <h1 className="text-2xl font-bold text-brand-text">Trang cá nhân</h1>
            <p className="mt-1 text-sm text-brand-muted">
              Thông tin tài khoản của bạn trong hệ thống.
            </p>

            <section className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1.5fr]">
              {/* Left: avatar + basic info */}
              <div className="rounded-card bg-white p-6 shadow-card">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full bg-slate-100">
                    <img
                      src={avatarPreview}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                    {/* change avatar button */}
                    <label className="absolute bottom-0 left-0 right-0 cursor-pointer bg-black/50 py-1 text-center text-[11px] font-medium text-white">
                      Đổi ảnh
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-semibold text-brand-text">
                      {user.name}
                    </p>
                    <p className="text-xs text-brand-muted">ID: {user.id}</p>
                    <p className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      {MEMBERSHIP_LABELS[user.membership]} member
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: editable form */}
              <div className="rounded-card bg-white p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-brand-text">
                    Thông tin cá nhân
                  </h2>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-semibold text-brand-primary hover:underline"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="mt-4 grid gap-4 text-sm sm:grid-cols-2"
                >
                  {/* Name */}
                  <div className="sm:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        name="name"
                        value={user.name}
                        onChange={handleFieldChange}
                        className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                      />
                    ) : (
                      <p className="mt-1 text-brand-text">{user.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleFieldChange}
                        className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                      />
                    ) : (
                      <p className="mt-1 text-brand-text">{user.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        name="phone"
                        value={user.phone}
                        onChange={handleFieldChange}
                        className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                      />
                    ) : (
                      <p className="mt-1 text-brand-text">{user.phone}</p>
                    )}
                  </div>

                  {/* Membership */}
                  <div className="sm:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                      Gói thành viên
                    </label>
                    {isEditing ? (
                      <select
                        name="membership"
                        value={user.membership}
                        onChange={handleFieldChange}
                        className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                      >
                        <option value="normal">Thường</option>
                        <option value="vip">VIP</option>
                        <option value="premium">Premium</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-brand-text">
                        {MEMBERSHIP_LABELS[user.membership]}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {isEditing && (
                    <div className="mt-4 flex gap-3 sm:col-span-2">
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Lưu thay đổi
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </section>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
