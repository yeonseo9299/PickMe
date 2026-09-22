'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type User = { id: string; name: string; email: string };

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUser();
  }, [pathname]);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="nav">
      <Link className="logo" href="/">결정장애 탈출기</Link>
      <div className="navLinks">
        <Link className="navLink" href="/choices/register">선택지 등록</Link>
        <Link className="navLink" href="/decision">결정하기</Link>
        {!loading && user && (
          <>
            <Link className="navLink" href="/choices">선택지 관리</Link>
            <Link className="navLink" href="/history">결정 기록</Link>
            <button className="navLink navButton logoutButton" onClick={logout}>로그아웃</button>
          </>
        )}
        {!loading && !user && (
          <>
            <Link className="navLink" href="/login">로그인</Link>
            <Link className="navLink" href="/register">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
}
