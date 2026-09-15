'use client';

import AuthGuard from '@/components/AuthGuard';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CATEGORIES = ['음식', '쇼핑', '여가', '기타'];

type Choice = { _id: string; name: string; category: string };

export default function DecisionPage() {
  const [category, setCategory] = useState('음식');
  const [count, setCount] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const load = async (selectedCategory: string) => {
    const response = await fetch(`/api/choices?category=${encodeURIComponent(selectedCategory)}`, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || '선택지를 불러오지 못했습니다.');
      return;
    }
    setChoices(data.choices);
    setCount(data.choices.length);
    setResult('');
    setError(data.choices.length ? '' : '이 카테고리에 등록된 선택지가 없습니다.');
  };

  useEffect(() => { void load(category); }, [category]);

  const decide = async () => {
    setError('');
    setResult('');
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

  return <AuthGuard>
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
          {choices.map((choice) => <span className="choiceChip" key={choice._id}>{choice.name}</span>)}
        </div>
        <button className="primary" style={{ marginTop: 18 }} onClick={decide} disabled={count === 0}>결정하기</button>
        {result && <div><p className="muted" style={{ marginTop: 28 }}>{category} 카테고리의 오늘의 선택</p><div className="resultName">{result}</div></div>}
        {error && <p className="error">{error}</p>}
        <Link href="/history" className="secondary" style={{ display: 'inline-block', marginTop: 16 }}>결정 기록 보기</Link>
      </section>
    </main>
  </AuthGuard>;
}
