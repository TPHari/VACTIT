import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

const USER = {
  name: "Quang Thanh",
  id: "012345",
  email: "quang.thanh@example.com",
  phone: "0900 000 000",
  school: "THPT Demo",
  grade: "12",
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <div className="px-6 pt-4 lg:px-8">
          <Topbar />
        </div>

        <main className="px-6 pb-8 pt-4 lg:px-8">
          <h1 className="text-2xl font-bold text-brand-text">My Profile</h1>
          <p className="mt-1 text-sm text-brand-muted">
            Thông tin tài khoản của bạn trong hệ thống.
          </p>

          <section className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1.5fr]">
            {/* Left: avatar + basic info */}
            <div className="rounded-card bg-white p-6 shadow-card">
              <div className="flex flex-col items-center gap-3">
                <div className="h-24 w-24 overflow-hidden rounded-full bg-slate-100">
                  {/* You can replace with user avatar */}
                  <img
                    src="/assets/logos/avatar.png"
                    alt={USER.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-brand-text">
                    {USER.name}
                  </p>
                  <p className="text-xs text-brand-muted">ID: {USER.id}</p>
                </div>
              </div>
            </div>

            {/* Right: detailed info */}
            <div className="rounded-card bg-white p-6 shadow-card">
              <h2 className="text-sm font-semibold text-brand-text">
                Thông tin cá nhân
              </h2>
              <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                    Họ và tên
                  </p>
                  <p className="mt-1 text-brand-text">{USER.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                    Email
                  </p>
                  <p className="mt-1 text-brand-text">{USER.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                    Số điện thoại
                  </p>
                  <p className="mt-1 text-brand-text">{USER.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                    Trường
                  </p>
                  <p className="mt-1 text-brand-text">{USER.school}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                    Khối lớp
                  </p>
                  <p className="mt-1 text-brand-text">{USER.grade}</p>
                </div>
              </div>

              {/* Placeholder for future editing */}
              <div className="mt-6">
                <button className="inline-flex items-center rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90">
                  Chỉnh sửa thông tin
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
