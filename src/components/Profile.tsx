import React from 'react';
import { toast } from '../hooks/use-toast';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import { Booking } from '../types';
import LoginPage from './LoginPage';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    bookings,
    deleteBooking,
    loading
  } = useBookings();

  // Filter bookings that belong to the current user
  const userBookings = bookings.filter((b) => {
    const booking = b as Booking & { isRecurring?: boolean; userId?: string; userPhone?: string };
    // Exclude recurring-as-dashboard if marked
    if (booking.isRecurring) return false;
    const uidMatch = booking.userId && user ? booking.userId === user.uid : false;
    const phoneMatch = user?.phoneNumber ? (booking.phoneNumber === user.phoneNumber || booking.userPhone === user.phoneNumber) : false;
    return uidMatch || phoneMatch;
  });

  const handleCancel = async (id: string) => {
    try {
      await deleteBooking(id);
      toast({ title: '✅ تم إلغاء الحجز', description: 'تم إلغاء الحجز بنجاح.' });
    } catch (err) {
      console.error('Cancel failed', err);
      toast({ title: '❌ فشل عند الإلغاء', description: 'حصل خطأ أثناء إلغاء الحجز.' , variant: 'destructive'});
    }
  };

  // If user is not authenticated, render the login page so they can sign in
  if (!user) {
    return (
      <LoginPage
        onBack={() => { /* parent handles navigation */ }}
        title="Profile Login"
        subtitle="Please sign in to view your bookings"
        allowSignUp={true}
      />
    );
  }

  const handleLogoutClick = async () => {
    try {
      await logout();
      toast({ title: '✅ تم تسجيل الخروج', description: 'تم تسجيل الخروج بنجاح.' });
    } catch (err) {
      console.error('Logout failed', err);
      toast({ title: '❌ فشل عند تسجيل الخروج', description: 'حصل خطأ أثناء تسجيل الخروج.' , variant: 'destructive'});
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-cyan-50 to-fuchsia-50">
      {/* Cinematic aurora overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_40%,_black,_transparent)] animate-gradient-shift bg-[length:200%_200%] bg-gradient-to-br from-cyan-300/20 via-indigo-300/10 to-fuchsia-300/20" />
      {/* Floating glow orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl bg-cyan-400/15 animate-float" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[22rem] w-[22rem] rounded-full blur-3xl bg-fuchsia-400/15 animate-float" />

      <div className="relative z-10 w-full max-w-3xl px-6 py-10 animate-fade-in-up">
        <div className="backdrop-blur-xl bg-white/70 border border-white/50 rounded-2xl p-8 shadow-[0_10px_40px_rgba(2,6,23,0.08)] transform transition-all duration-700 hover:scale-105 hover:shadow-[0_24px_70px_rgba(6,182,212,0.18)]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#06b6d4] p-[3px] hover:scale-105 transition-transform duration-500 shadow-[0_0_30px_rgba(124,58,237,0.25)] animate-glow-pulse">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-slate-800">{(user?.displayName || user?.email || '').charAt(0).toUpperCase()}</div>
              </div>
              <div className="absolute -right-3 -bottom-3 w-10 h-10 rounded-full bg-[#06b6d4] text-white flex items-center justify-center text-sm shadow-lg animate-float">
                🎾
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-sky-500 to-fuchsia-600 animate-text-glow transform transition-all duration-500 hover:translate-y-[-2px]">حسابي</h2>
              <p className="mt-1 text-sm text-slate-600">{user ? `مرحبًا ${user.displayName || user.email || ''}` : ''}</p>

              <div className="mt-4 flex items-center justify-center md:justify-start gap-3">
                <button onClick={handleLogoutClick} className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-white bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#7c3aed] transition-all duration-500 transform hover:-translate-y-1 shadow-[0_6px_24px_rgba(99,102,241,0.25)] hover:shadow-[0_12px_40px_rgba(6,182,212,0.18)]">
                  تسجيل الخروج
                </button>
                <button onClick={() => toast({ title: '✨', description: 'تحديث الملف مستقبلاً' })} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-[#7c3aed] bg-white ring-1 ring-[#7c3aed]/10 hover:bg-[#7c3aed]/5 transition-all duration-500 hover:shadow-[0_8px_26px_rgba(124,58,237,0.15)]">
                  تحرير الملف
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {loading && <div className="text-center py-6">جاري التحميل...</div>}

            {!loading && userBookings.length === 0 && (
              <div className="p-6 bg-white/70 rounded-xl border border-white/50 shadow-sm text-center transition-all duration-500 hover:shadow-[0_10px_36px_rgba(2,6,23,0.12)]">
                <div className="text-lg font-medium mb-2">لا توجد حجوزات مرتبطة بحسابك حالياً.</div>
                <div className="text-sm text-slate-600">قم بالحجز الآن من صفحة الملعب</div>
              </div>
            )}

            {!loading && userBookings.length > 0 && (
              <div className="mt-4 grid gap-4">
                {userBookings.map((b) => (
                  <div key={b.id} className="group relative p-4 rounded-xl border border-white/50 bg-white/80 flex items-center justify-between shadow transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_60px_rgba(6,182,212,0.15)] animate-fade-in-up">
                    <div>
                      <div className="font-semibold text-slate-900 text-lg">{b.fullName || '—'}</div>
                      <div className="text-sm text-slate-600 mt-1">{b.date} • {b.startTime} • Court {b.court}</div>
                      <div className="text-sm mt-2 text-slate-700">{b.reservationType} • {b.price} EGP</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-400 ${b.status === 'approved' ? 'bg-green-100 text-green-700' : b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {b.status}
                      </div>
                      {b.status !== 'canceled' && (
                        <button onClick={() => handleCancel(b.id)} className="mt-3 inline-flex items-center px-3 py-1 border border-red-300 text-red-600 rounded-md hover:scale-105 transition-transform duration-300 hover:shadow-[0_8px_20px_rgba(239,68,68,0.15)]">
                          إلغاء
                        </button>
                      )}
                    </div>
                    {/* subtle glowing ring on hover */}
                    <span className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: '0 0 40px rgba(6,182,212,0.22)' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
