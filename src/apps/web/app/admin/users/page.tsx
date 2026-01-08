"use client";

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api-client';

type AdminUser = {
  user_id: string;
  name: string;
  email: string;
  role: string;
  membership: string;
  created_at: string | null;
};

type RoleOptionValue = 'Student' | 'Admin';

const ROLE_OPTIONS: Array<{ value: RoleOptionValue; label: string }> = [
  { value: 'Student', label: 'Student' },
  { value: 'Admin', label: 'Admin' },
];

function formatDateTime(value: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.admin.users.list();
      if (!res?.ok) {
        throw new Error(res?.error || 'Failed to load users');
      }
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error('loadUsers error', err);
      setError(err?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => {
      const haystack = `${user.name} ${user.email} ${user.role} ${user.membership}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [users, search]);

  async function handleRoleChange(user: AdminUser, nextRole: RoleOptionValue) {
    if (user.role === nextRole) return;

    setSaving((prev) => ({ ...prev, [user.user_id]: true }));
    setUsers((prev) => prev.map((item) => (item.user_id === user.user_id ? { ...item, role: nextRole } : item)));

    try {
      const res = await api.admin.users.updateRole(user.user_id, nextRole);
      if (!res?.ok) {
        throw new Error(res?.error || 'Failed to update role');
      }
      if (res?.data) {
        setUsers((prev) => prev.map((item) => (item.user_id === user.user_id ? res.data : item)));
      }
    } catch (err: any) {
      console.error('handleRoleChange error', err);
      setUsers((prev) => prev.map((item) => (item.user_id === user.user_id ? { ...item, role: user.role } : item)));
      alert(err?.message || 'Không thể cập nhật vai trò');
    } finally {
      setSaving((prev) => ({ ...prev, [user.user_id]: false }));
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-slate-900">Danh sách người dùng</h1>
        <p className="text-sm text-slate-500">Theo dõi và thay đổi vai trò truy cập của người dùng trong hệ thống.</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="topbar__search" style={{ maxWidth: 360 }}>
          <input
            className="topbar__search-input"
            placeholder="Tìm theo tên, email hoặc vai trò..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="button" className="topbar__search-button">🔍</button>
        </div>

        <button type="button" className="btn btn--secondary" onClick={loadUsers} disabled={loading}>
          {loading ? 'Đang tải...' : 'Tải lại'}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3 font-medium">Họ và tên</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Vai trò</th>
                <th className="px-4 py-3 font-medium">Membership</th>
                <th className="px-4 py-3 font-medium">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={5}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={5}>
                    Không có người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const knownRole = ROLE_OPTIONS.some((option) => option.value === user.role);
                  return (
                    <tr key={user.user_id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-slate-900">{user.name}</td>
                    <td className="px-4 py-3 text-slate-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
                        value={knownRole ? user.role : ''}
                        onChange={(event) => handleRoleChange(user, event.target.value as RoleOptionValue)}
                        disabled={Boolean(saving[user.user_id])}
                      >
                        {!knownRole && (
                          <option value="" disabled>
                            Vai trò hiện tại: {user.role || 'Không xác định'}
                          </option>
                        )}
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {saving[user.user_id] && option.value === user.role ? 'Đang cập nhật...' : option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {user.membership || 'Regular'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(user.created_at)}</td>
                  </tr>
                );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
