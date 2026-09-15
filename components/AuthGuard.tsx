'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const pathname = usePathname(); const [checking, setChecking] = useState(true);
  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' }).then((r) => { if (!r.ok) router.replace(`/login?next=${encodeURIComponent(pathname)}`); else setChecking(false); }).catch(() => router.replace('/login'));
  }, [pathname, router]);
  if (checking) return <main className="container"><section className="card"><p className="muted">로그인 상태를 확인하는 중...</p></section></main>;
  return <>{children}</>;
}
