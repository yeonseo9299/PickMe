'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type User = { id: string; name: string; email: string };

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        setUser(data.user ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <main className="container">
      <section className="hero">
        <h1>결정장애 탈출기</h1>
        <p>고민되는 선택지를 등록하고,<br />카테고리별로 랜덤 결정해보세요.</p>

        {!loading && user ? (
          <>
            <p className="userWelcome"><strong>{user.name}</strong>님, 오늘 무엇을 결정할까요?</p>
            <div className="actions">
              <Link className="primary" href="/choices">선택지 관리</Link>
              <Link className="secondary" href="/decision">결정하기</Link>
              <Link className="secondary" href="/history">결정 기록</Link>
            </div>
            <button className="secondary logoutButton homeLogout" onClick={logout}>로그아웃</button>
          </>
        ) : (
          <>
            <div className="actions">
              <Link className="primary" href="/choices/register">선택지 등록</Link>
              <Link className="secondary" href="/decision">결정하기</Link>
            </div>
            <p className="muted guestNote">로그인하면 선택지 관리와 결정 기록을 사용할 수 있습니다.</p>
          </>
        )}
      </section>

      <section className="card">
        <h2 className="title">간단하게 결정하기</h2>
        <p className="muted">로그인하지 않아도 선택지를 등록하고 바로 랜덤 결정을 할 수 있습니다.</p>
      </section>
    </main>
  );
}
