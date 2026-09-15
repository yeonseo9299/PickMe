'use client';

import AuthGuard from '@/components/AuthGuard';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type History = { _id: string; result: string; category: string; decisionAt: string };

export default function HistoryPage() {
  const [history, setHistory] = useState<History[]>([]);
  const [message, setMessage] = useState('불러오는 중...');

  useEffect(() => {
    fetch('/api/history', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || '결정 기록을 불러오지 못했습니다.');
        setHistory(data.history);
        setMessage(data.history.length ? '' : '아직 결정 기록이 없습니다.');
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : '오류가 발생했습니다.'));
  }, []);

  return <AuthGuard>
    <main className="container">
      <div className="pageHeader">
        <div><h1>결정 기록</h1><p className="muted">이전에 랜덤으로 결정된 결과를 확인할 수 있습니다.</p></div>
        <Link href="/decision" className="primary">다시 결정하기</Link>
      </div>
      {history.length === 0 ? <section className="card"><p className="muted">{message}</p></section> : (
        <section className="list">
          {history.map((item) => (
            <div className="item" key={item._id}>
              <div><strong>{item.result}</strong><div className="muted">{item.category}</div></div>
              <span className="muted">{new Date(item.decisionAt).toLocaleString('ko-KR')}</span>
            </div>
          ))}
        </section>
      )}
    </main>
  </AuthGuard>;
}
