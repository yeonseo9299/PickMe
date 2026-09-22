'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getGuestChoices, GuestChoice } from '@/lib/guest';

const CATEGORIES = ['음식', '쇼핑', '여가', '기타'];

type Choice = { _id?: string; id?: string; name: string; category: string };

type User = { id: string; name: string; email: string };

export default function DecisionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [category, setCategory] = useState('음식');
  const [count, setCount] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  const load = async (selectedCategory: string) => {
    setError('');
    if (!user) {
      const guest = getGuestChoices().filter((item) => item.category === selectedCategory);
      setChoices(guest);
      setCount(guest.length);
      setResult('');
      if (!guest.length) setError('이 카테고리에 등록된 선택지가 없습니다.');
      return;
    }

    const response = await fetch(`/api/choices?category=${encodeURIComponent(selectedCategory)}`, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || '선택지를 불러오지 못했습니다.');
      return;
    }
    setChoices(data.choices);
    setCount(data.choices.length);
    setResult('');
    if (!data.choices.length) setError('이 카테고리에 등록된 선택지가 없습니다.');
  };

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        setUser(data.user ?? null);
      })
      .finally(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
    if (!loadingUser) void load(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, loadingUser, user]);

  const decide = async () => {
    setError('');
    setResult('');

    if (!user) {
      const guestChoices = getGuestChoices().filter((item) => item.category === category);
      if (!guestChoices.length) {
        setError('이 카테고리에 등록된 선택지가 없습니다.');
        return;
      }
      const selected = guestChoices[Math.floor(Math.random() * guestChoices.length)];
      setResult(selected.name);
      return;
    }

    const response = await fetch('/api/decisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message ?? '결정에 실패했습니다.');
      return;
    }
    setResult(data.result);
  };

  const choiceKey = (choice: Choice, index: number) => choice._id ?? choice.id ?? `${choice.name}-${index}`;

  return (
    <main className="container">
      <section className="card result">
        <h1>오늘은 뭘 고를까요?</h1>
        <p className="muted">카테고리를 선택하면 해당 카테고리 안에서만 랜덤으로 결정합니다.</p>
        <div className="categoryTabs decisionTabs">
          {CATEGORIES.map((item) => (
            <button key={item} className={category === item ? 'categoryTab active' : 'categoryTab'} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <p className="muted">현재 선택지 {count}개</p>
        <div className="choicePreview">
          {choices.map((choice, index) => <span className="choiceChip" key={choiceKey(choice, index)}>{choice.name}</span>)}
        </div>
        <button className="primary" style={{ marginTop: 18 }} onClick={decide} disabled={count === 0}>결정하기</button>
        {result && <div><p className="muted" style={{ marginTop: 28 }}>{category} 카테고리의 오늘의 선택</p><div className="resultName">{result}</div></div>}
        {error && <p className="error">{error}</p>}
        <div className="actions" style={{ marginTop: 16 }}>
          <Link href="/choices/register" className="secondary">선택지 등록</Link>
          {user && <Link href="/history" className="secondary">결정 기록 보기</Link>}
        </div>
        {!user && <p className="muted guestNote">로그인하지 않은 상태에서는 결정 결과를 기록하지 않습니다.</p>}
      </section>
    </main>
  );
}
