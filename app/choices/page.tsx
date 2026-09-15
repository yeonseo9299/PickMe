'use client';

import AuthGuard from '@/components/AuthGuard';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CATEGORIES = ['전체', '음식', '쇼핑', '여가', '기타'];

type Choice = { _id: string; name: string; category: string; createdAt: string };

export default function ChoicesPage() {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [category, setCategory] = useState('전체');
  const [message, setMessage] = useState('불러오는 중...');

  const load = async () => {
    const response = await fetch('/api/choices', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || '선택지를 불러오지 못했습니다.');
      return;
    }
    setChoices(data.choices);
    setMessage(data.choices.length ? '' : '등록된 선택지가 없습니다.');
  };

  useEffect(() => { void load(); }, []);

  const edit = async (choice: Choice) => {
    const name = window.prompt('선택지 이름을 수정하세요.', choice.name);
    if (name === null) return;
    const trimmed = name.trim();
    if (!trimmed) { setMessage('선택지를 입력해주세요.'); return; }
    const response = await fetch(`/api/choices/${choice._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: trimmed, category: choice.category }) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.message || '수정에 실패했습니다.'); return; }
    await load();
  };

  const remove = async (id: string) => {
    const response = await fetch(`/api/choices/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || '삭제에 실패했습니다.');
      return;
    }
    await load();
  };

  const filtered = category === '전체' ? choices : choices.filter((choice) => choice.category === category);

  return <AuthGuard>
    <main className="container">
      <div className="pageHeader">
        <div><h1>선택지 관리</h1><p className="muted">등록한 선택지를 카테고리별로 확인하세요.</p></div>
        <Link className="primary" href="/choices/register">선택지 추가</Link>
      </div>
      <div className="categoryTabs">
        {CATEGORIES.map((item) => (
          <button key={item} className={category === item ? 'categoryTab active' : 'categoryTab'} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>
      <section className="list">
        {filtered.map((choice) => (
          <div className="item" key={choice._id}>
            <div><strong>{choice.name}</strong><div className="muted">{choice.category}</div></div>
            <div className="itemActions"><button className="smallButton" onClick={() => edit(choice)}>수정</button><button className="smallButton danger" onClick={() => remove(choice._id)}>삭제</button></div>
          </div>
        ))}
        {filtered.length === 0 && <div className="card"><p className="muted">{message || '이 카테고리에 등록된 선택지가 없습니다.'}</p></div>}
      </section>
    </main>
  </AuthGuard>;
}
