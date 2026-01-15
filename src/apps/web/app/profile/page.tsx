"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { type UserProfile, type Membership } from "@/lib/mock-user";

const MEMBERSHIP_LABELS: Record<Membership, string> = {
  normal: "Thường",
  vip: "VIP",
  premium: "Premium",
  Regular: "Thường",
  VIP: "VIP",
  Premium: "Premium",
};

const getMembershipLabel = (value: Membership | string) =>
  (MEMBERSHIP_LABELS as Record<string, string>)[value] ?? value;

const AVATAR_OPTIONS = [
  "/assets/avatars/avatar-01.png",
  "/assets/avatars/avatar-02.png",
  "/assets/avatars/avatar-03.png",
  "/assets/avatars/avatar-04.png",
  "/assets/avatars/avatar-05.png",
  "/assets/avatars/avatar-06.png",
];


export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedUser, setSavedUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("/assets/logos/avatar.png");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch user info on mount
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          const normalizedUser: UserProfile = {
            id: data.user.id ?? data.user.user_id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || "",
            membership: data.user.membership,
            avatarUrl: data.user.avatarUrl || data.user.avatar_url,
          };
          setUser(normalizedUser);
          setSavedUser(normalizedUser);
          setAvatarPreview(normalizedUser.avatarUrl || "/assets/logos/avatar.png");
        }
      });
  }, []);

  // Controlled input handlers
  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUser((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const handleAvatarSelect = (url: string) => {
    setAvatarPreview(url);
    setUser((prev) => prev ? { ...prev, avatarUrl: url } : prev);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setProfileMessage(null);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Cập nhật thất bại');
      }
      const updatedUser: UserProfile = {
        id: data.user.id ?? data.user.user_id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "",
        membership: data.user.membership,
        avatarUrl: data.user.avatarUrl || data.user.avatar_url,
      };
      setUser(updatedUser);
      setSavedUser(updatedUser);
      setAvatarPreview(updatedUser.avatarUrl || "/assets/logos/avatar.png");
      setProfileMessage('Đã lưu thay đổi.');
      setIsEditing(false);
    } catch (error: any) {
      setProfileMessage(error?.message || 'Cập nhật thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Optionally re-fetch user from API to reset
    if (savedUser) {
      setUser(savedUser);
      setAvatarPreview(savedUser.avatarUrl || "/assets/logos/avatar.png");
    }
    setIsEditing(false);
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordMessage({ type: "error", text: "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới." });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Mật khẩu mới và xác nhận không khớp." });
      return;
    }
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Đổi mật khẩu thất bại');
      }
      setPasswordMessage({ type: "success", text: "Đổi mật khẩu thành công." });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      setPasswordMessage({ type: "error", text: error?.message || "Đổi mật khẩu thất bại" });
    }
  };

  if (!user) {
    return <div className="max-w-2xl mx-auto py-10 text-center text-slate-400">Đang tải thông tin người dùng...</div>;
  }

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
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-semibold text-brand-text">
                      {user.name}
                    </p>
                    <p className="text-xs text-brand-muted">ID: {user.id}</p>
                    <p className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      {getMembershipLabel(user.membership)} member
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted mb-3">
                      Chọn ảnh đại diện
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {AVATAR_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleAvatarSelect(option)}
                          className={`relative h-16 w-16 overflow-hidden rounded-full border-2 transition-all ${
                            avatarPreview === option
                              ? "border-brand-primary ring-2 ring-brand-primary/30"
                              : "border-slate-200 hover:border-brand-primary"
                          }`}
                          aria-label="Chọn ảnh đại diện"
                        >
                          <img
                            src={option}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-brand-muted">
                      Ảnh đại diện được chọn từ bộ có sẵn.
                    </p>
                  </div>
                )}
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
                    <p className="mt-1 text-brand-text">{user.email}</p>
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
                      <p className="mt-1 text-brand-text">{user.phone || "---"}</p>
                    )}
                  </div>

                  {/* Membership */}
                  <div className="sm:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                      Gói thành viên
                    </label>
                    <p className="mt-1 text-brand-text">
                      {getMembershipLabel(user.membership)}
                    </p>
                  </div>

                  {profileMessage && (
                    <div className="sm:col-span-2 text-xs text-slate-500">
                      {profileMessage}
                    </div>
                  )}

                  {/* Actions */}
                  {isEditing && (
                    <div className="mt-4 flex gap-3 sm:col-span-2">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                      >
                        {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
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

              <div className="rounded-card bg-white p-6 shadow-card md:col-span-2">
                <h2 className="text-sm font-semibold text-brand-text">Đổi mật khẩu</h2>
                <form onSubmit={handlePasswordSubmit} className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cập nhật mật khẩu
                    </button>
                    {passwordMessage && (
                      <span
                        className={`text-xs ${
                          passwordMessage.type === "success" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {passwordMessage.text}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </section>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
