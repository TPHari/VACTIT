'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { api } from '@/lib/api-client';

type Slide = {
  id: string;
  image: string;
  title: string;
  description?: string;
  dot: 'circle' | 'square' | 'triangle';
};

const slides: Slide[] = [
  {
    id: 'welcome',
    image: '/assets/logos/LoginLogo1.png',
    title: 'Chào bạn!',
    description: undefined,
    dot: 'circle',
  },
  {
    id: 'practice',
    image: '/assets/logos/LoginLogo2.png',
    title: 'Chào bạn đã đến với',
    description: undefined,
    dot: 'square',
  },
  {
    id: 'progress',
    image: '/assets/logos/LoginLogo3.png',
    title: 'Chào bạn đã đến với web thi thử ĐGNL của BaiLearn!',
    description: undefined,
    dot: 'triangle',
  },
];

const termsSections = [
  {
    title: '1. Chấp nhận điều khoản',
    items: [
      'Bằng việc truy cập, đăng ký tài khoản và sử dụng nền tảng thi thử của BaiLearn, bạn đồng ý tuân thủ toàn bộ các Điều khoản sử dụng này.',
      'Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng chấm dứt việc sử dụng dịch vụ ngay lập tức.',
    ],
  },
  {
    title: '2. Tài khoản và Bảo mật',
    items: [
      'Thông tin chính xác: Bạn cam kết cung cấp thông tin (Họ tên, Email, SĐT) chính xác và chính chủ.',
      'Quyền hạn của BaiLearn: BaiLearn có quyền khóa vĩnh viễn các tài khoản sử dụng thông tin giả mạo mà không cần báo trước.',
      'Trách nhiệm bảo mật: Bạn hoàn toàn chịu trách nhiệm bảo mật thông tin đăng nhập.',
      'Miễn trừ trách nhiệm: BaiLearn không chịu trách nhiệm cho bất kỳ tổn thất nào phát sinh do việc bạn để lộ mật khẩu hoặc chia sẻ tài khoản cho người khác.',
    ],
  },
  {
    title: '3. Quyền sở hữu trí tuệ',
    items: [
      'Bản quyền nội dung: Tất cả nội dung trên trang web đều là tài sản trí tuệ độc quyền của BaiLearn.',
      'Hành vi bị nghiêm cấm: Sao chép, chụp ảnh màn hình, quay video, cào dữ liệu, phát tán đề thi ra bên ngoài hoặc sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản của BaiLearn.',
      'Chế tài: Hành vi vi phạm sẽ bị xử lý theo quy định pháp luật về Sở hữu trí tuệ và BaiLearn có quyền yêu cầu bồi thường.',
    ],
  },
  {
    title: '4. Quy định về Thi thử và Kết quả',
    items: [
      'Tính chất tham khảo: Kết quả thi thử và các lời khuyên chiến lược chỉ mang tính tham khảo.',
      'Cam kết: Không đảm bảo điểm thi thử trùng với điểm thi thật tại kỳ thi ĐGNL HCM.',
      'Lỗi kỹ thuật: Nếu có sự cố hệ thống, BaiLearn sẽ nỗ lực khắc phục nhưng không chịu trách nhiệm bồi thường.',
    ],
  },
  {
    title: '5. Quyền sử dụng dữ liệu người dùng',
    items: [
      'Bạn trao cho BaiLearn quyền vĩnh viễn, không hủy ngang và miễn phí để sử dụng kết quả làm bài, lịch sử thao tác và điểm số.',
      'Mục đích: Thống kê, cải thiện chất lượng đề thi và huấn luyện AI.',
      'Công bố báo cáo: Dữ liệu có thể được công bố ở dạng ẩn danh.',
    ],
  },
  {
    title: '6. Thanh toán và Hoàn tiền',
    items: [
      'Các gói dịch vụ đã mua sẽ không được hoàn tiền dưới mọi hình thức.',
      'Ngoại lệ: Trừ khi lỗi phát sinh hoàn toàn từ hệ thống của BaiLearn và không thể khắc phục quá 72 giờ.',
    ],
  },
  {
    title: '7. Giới hạn trách nhiệm',
    items: [
      'BaiLearn không chịu trách nhiệm cho thiệt hại gián tiếp, ngẫu nhiên hoặc đặc biệt phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.',
    ],
  },
  {
    title: '8. Thay đổi Điều khoản',
    items: [
      'BaiLearn có quyền thay đổi nội dung chính sách này bất cứ lúc nào. Các thay đổi sẽ được thông báo trên website hoặc qua email. Việc bạn tiếp tục sử dụng dịch vụ sau khi thay đổi đồng nghĩa với việc bạn chấp nhận chính sách mới.',
    ]
  }
];

const privacySections = [
  {
    title: '1. Dữ liệu chúng tôi thu thập',
    items: [
      'Thông tin định danh: Họ tên, Địa chỉ Email và Số điện thoại.',
      'Dữ liệu học tập: Lịch sử làm bài, điểm số từng phần, thời gian hoàn thành bài thi, các câu hỏi bạn làm sai thường xuyên.',
      'Dữ liệu kỹ thuật: Địa chỉ IP, loại trình duyệt, thiết bị sử dụng, cookies.',
    ],
  },
  {
    title: '2. Mục đích sử dụng dữ liệu',
    items: [
      'Cung cấp dịch vụ: Xác thực tài khoản, chấm điểm, lưu trữ tiến độ học tập.',
      'Phân tích và Tư vấn: Dùng điểm số và hành vi làm bài để phân tích điểm mạnh/yếu và đưa ra lời khuyên chiến lược cá nhân hóa.',
      'Cải thiện chất lượng: Phân tích dữ liệu gộp để đánh giá độ khó câu hỏi và điều chỉnh đề thi.',
      'Tiếp thị và Truyền thông: Gửi email về kỳ thi thử, mẹo ôn thi, khóa học, khuyến mãi; bạn có quyền từ chối bất cứ lúc nào.',
    ],
  },
  {
    title: '3. Chia sẻ dữ liệu',
    items: [
      'Không bán thông tin cá nhân cho bên thứ ba.',
      'Có thể chia sẻ với đối tác cung cấp hạ tầng, dịch vụ email... và họ phải tuân thủ quy định bảo mật của BaiLearn.',
      'Chia sẻ theo yêu cầu pháp lý từ cơ quan có thẩm quyền.',
    ],
  },
  {
    title: '4. Lưu trữ và Bảo vệ dữ liệu',
    items: [
      'Lưu trữ trên máy chủ bảo mật.',
      'Mã hóa trong quá trình truyền tải.',
      'Không có hệ thống nào an toàn tuyệt đối; BaiLearn nỗ lực bảo vệ nhưng không chịu trách nhiệm nếu bị tấn công vượt các lớp bảo mật chuẩn.',
    ],
  },
  {
    title: '5. Quyền của người dùng',
    items: [
      'Bạn có quyền xem và chỉnh sửa thông tin cá nhân trong trang Quản lý tài khoản.',
      'Bạn có thể hủy đăng ký email marketing qua nút Unsubscribe.',
      'Bạn có thể yêu cầu xóa hoàn toàn tài khoản và dữ liệu; hành động này không thể khôi phục.',
    ],
  },
  {
    title: '6. Thay đổi chính sách',
    items: [
      'BaiLearn có thể thay đổi chính sách bất cứ lúc nào.',
      'Thay đổi sẽ được thông báo trên website hoặc qua email.',
      'Tiếp tục sử dụng dịch vụ nghĩa là bạn chấp nhận chính sách mới.',
    ],
  },
];

function DotIcon({ type, active }: { type: Slide['dot']; active: boolean }) {
  const color = active ? '#FFFFFF' : 'rgba(255,255,255,0.6)';
  switch (type) {
    case 'square':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke={color} strokeWidth="2" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
          <path d="M2 12.5L8 1.5L14 12.5H2Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="2" />
        </svg>
      );
  }
}

type SignupStep = 'details' | 'otp' | 'password';

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<SignupStep>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[activeSlide];
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);
  const fullName = useMemo(() => `${lastName} ${firstName}`.trim(), [firstName, lastName]);

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setConsentError(null);

    if (step === 'details') {
      if (!acceptedTerms) {
        setConsentError('Vui lòng đồng ý với Điều khoản và Chính sách bảo mật trước khi tiếp tục.');
        return;
      }
      if (!isEmail(normalizedEmail)) {
        setError('Email không hợp lệ. Vui lòng kiểm tra lại.');
        return;
      }
      if (!fullName.trim()) {
        setError('Vui lòng nhập họ và tên.');
        return;
      }

      setLoading(true);
      try {
        const res = await api.auth.sendOtp({
          email: normalizedEmail,
          name: fullName,
        });

        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }

        setStep('otp');
        setInfo('Đã gửi mã xác nhận tới email của bạn. Vui lòng kiểm tra hộp thư hoặc spam.');
      } catch (err: any) {
        setError(err.message || 'Không thể gửi mã xác nhận.');
      }
      setLoading(false);
      return;
    }

    if (step === 'otp') {
      if (otpCode.trim().length !== 6) {
        setError('Mã xác nhận cần đủ 6 chữ số.');
        return;
      }

      setLoading(true);
      try {
        const res = await api.auth.verifyOtp({
          email: normalizedEmail,
          code: otpCode.trim(),
        });

        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }

        setStep('password');
        setInfo('Email đã được xác minh. Hãy tạo mật khẩu để hoàn tất.');
      } catch (err: any) {
        setError(err.message || 'Mã xác nhận không hợp lệ hoặc đã hết hạn.');
      }
      setLoading(false);
      return;
    }

    if (step === 'password') {
      if (password.length < 8) {
        setError('Mật khẩu cần tối thiểu 8 ký tự.');
        return;
      }

      setLoading(true);
      try {
        const res = await api.auth.completeSignup({
          email: normalizedEmail,
          password,
        });

        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }

        // Auto login after signup
        const loginRes = await signIn('credentials', {
          redirect: false,
          email: normalizedEmail,
          password,
        });

        if (loginRes?.error) {
          // Still show success but redirect to login
          setInfo('Đăng ký thành công! Vui lòng đăng nhập.');
          router.push('/auth/login');
        } else {
          router.push('/');
        }
      } catch (err: any) {
        setError(err.message || 'Không thể tạo tài khoản.');
      }
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setError(null);
    setInfo(null);
    if (!isEmail(normalizedEmail)) {
      setError('Email không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.sendOtp({
        email: normalizedEmail,
        name: fullName,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setInfo('Đã gửi lại mã xác nhận. Vui lòng kiểm tra hộp thư.');
      }
    } catch (err: any) {
      setError(err.message || 'Không thể gửi lại mã xác nhận.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex font-sans">

      {/* --- LEFT PANEL (Copy hệt từ Login) --- */}
      <div className="hidden md:flex w-1/2 bg-[#2563EB] text-white px-8 py-8 relative overflow-hidden">
        <div className="flex flex-col w-full h-full z-10 items-center justify-start gap-4">
          {/* 1. Logo Section */}
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="w-28 h-28 relative flex items-center justify-center mx-auto">
              <img 
                src="/assets/logos/BaiLearnLogo.png" 
                alt="BAILEARN Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          {/* 2. Main Illustration slider */}
          <div className="w-full flex items-start justify-center pt-1 mb-6">
            <div className="relative w-full max-w-md h-56 md:h-84 flex items-center justify-center">
              <img 
                key={currentSlide.id}
                src={currentSlide.image}
                alt="Illustration"
                className="w-full h-full object-contain drop-shadow-xl transition-all duration-700 ease-out animate-slide-in"
              />
            </div>
          </div>

          {/* 3. Dynamic Slide Copy + dots */}
          <div className="w-full px-1 mt-6">
            <h2 className="text-[28px] text-white font-normal text-start">{currentSlide.title}</h2>
            <div className="mt-4 flex gap-6 justify-center">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Chuyển sang slide ${index + 1}`}
                  className="transition-opacity duration-200"
                  style={{ opacity: index === activeSlide ? 1 : 0.6 }}
                >
                  <DotIcon type={slide.dot} active={index === activeSlide} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* --- RIGHT PANEL (Form Đăng Ký) --- */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký tài khoản mới</h1>
            <p className="text-sm text-gray-500 mb-6">Chào bạn đã đến với web thi thử ĐGNL HCM của BaiLearn !</p>
          </div>

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white py-3.5 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-all mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Đăng ký bằng tài khoản Google
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Hoặc đăng ký tài khoản mới</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <span className={`px-3 py-1 rounded-full ${step === 'details' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>Thông tin</span>
              <span className={`px-3 py-1 rounded-full ${step === 'otp' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>Nhập mã</span>
              <span className={`px-3 py-1 rounded-full ${step === 'password' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>Mật khẩu</span>
            </div>

            {step === 'details' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    placeholder="Họ"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-6 py-3.5 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <input
                    required
                    placeholder="Tên"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-6 py-3.5 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <input
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-3.5 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  type="email"
                />

                <div className="flex items-start gap-2 mt-2">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      if (e.target.checked) setConsentError(null);
                    }}
                  />
                  <label htmlFor="terms" className="text-xs text-gray-500 leading-tight">
                    Bằng cách tích vào ô này, bạn đã đồng ý với <button type="button" onClick={() => setShowTermsModal(true)} className="text-blue-600 hover:underline">điều khoản</button> và <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-blue-600 hover:underline">chính sách bảo mật</button> của BaiLearn.
                  </label>
                </div>
                {consentError && <div className="text-xs text-red-600 mt-1">{consentError}</div>}
              </>
            )}

            {step === 'otp' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">
                  Nhập mã xác nhận 6 số được gửi tới <span className="font-semibold">{normalizedEmail}</span>.
                  <button 
                    type="button" 
                    onClick={() => { setStep('details'); setOtpCode(''); setError(null); setInfo(null); }} 
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Đổi email
                  </button>
                </p>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="Nhập mã 6 số"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-6 py-3.5 border border-gray-300 rounded-full text-center tracking-[0.6em] text-lg font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span>Không nhận được mã?</span>
                  <button type="button" onClick={handleResendOtp} className="text-blue-600 font-semibold hover:underline" disabled={loading}>Gửi lại</button>
                </div>
              </div>
            )}

            {step === 'password' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">Email đã được xác minh. Đặt mật khẩu để hoàn tất đăng ký.</p>
                <div className="relative">
                  <input
                    required
                    placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-6 py-3.5 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-5 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">{error}</div>}
            {info && <div className="text-sm text-green-700 text-center bg-green-50 p-2 rounded">{info}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] text-white py-3.5 rounded-full font-medium shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 mt-2"
            >
              {step === 'details' && (loading ? 'Đang gửi mã…' : 'Tiếp tục')}
              {step === 'otp' && (loading ? 'Đang xác nhận…' : 'Xác nhận')}
              {step === 'password' && (loading ? 'Đang tạo…' : 'Tạo tài khoản')}
            </button>

            <div className="text-center text-sm text-gray-500 mt-4">
              Bạn đã có tài khoản? <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">Đăng nhập ngay</Link>
            </div>
          </form>
        </div>
      </div>
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setShowTermsModal(false)} />
          <div className="relative z-10 w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">BaiLearn</p>
                <h2 className="text-lg font-semibold text-slate-900">Điều khoản sử dụng</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="rounded-full p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Đóng điều khoản"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-slate-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 space-y-6 overflow-y-auto max-h-[60vh]">
              {termsSections.map((section) => (
                <section key={section.title} className="space-y-2">
                  <h3 className="text-base font-semibold text-slate-900">{section.title}</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 leading-relaxed">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 rounded-full border border-slate-200 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700"
              >
                Tôi đã đọc
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setShowPrivacyModal(false)} />
          <div className="relative z-10 w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">BaiLearn</p>
                <h2 className="text-lg font-semibold text-slate-900">Chính sách bảo mật</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="rounded-full p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Đóng chính sách bảo mật"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-slate-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 space-y-6 overflow-y-auto max-h-[60vh]">
              {privacySections.map((section) => (
                <section key={section.title} className="space-y-2">
                  <h3 className="text-base font-semibold text-slate-900">{section.title}</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 leading-relaxed">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 rounded-full border border-slate-200 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700"
              >
                Tôi đã đọc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}