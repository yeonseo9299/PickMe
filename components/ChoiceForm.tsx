'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getGuestChoices, GuestChoice, saveGuestChoices } from '@/lib/guest';

const CATEGORIES = ['음식', '쇼핑', '여가', '기타'];

type User = { id: string; name: string; email: string };

type PendingItem = { name: string; category: string };

export default function ChoiceForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('음식');
  const [items, setItems] = useState<PendingItem[]>([]);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        setUser(data.user ?? null);
      })
      .finally(() => setLoadingUser(false));
  }, []);

  const addItem = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setMessage('선택지를 입력해주세요.');
      return;
    }
    if (trimmed.length > 50) {
      setMessage('선택지는 50자 이하로 입력해주세요.');
      return;
    }
    setItems((prev) => [...prev, { name: trimmed, category }]);
    setName('');
    setMessage('');
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (items.length === 0) {
      setMessage('선택지를 하나 이상 추가해주세요.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      if (user) {
        for (const item of items) {
          const response = await fetch('/api/choices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || '저장에 실패했습니다.');
        }
        router.push('/choices');
      } else {
        const existing = getGuestChoices();
        const newChoices: GuestChoice[] = items.map((item, index) => ({
          id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
          name: item.name,
          category: item.category,
          createdAt: new Date().toISOString(),
        }));
        saveGuestChoices([...existing, ...newChoices]);
        router.push('/decision');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '선택지 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card form">
      <h1>선택지 등록</h1>
      <p className="muted">
        {user ? '카테고리를 선택하고 내 선택지를 추가하세요.' : '로그인 없이도 선택지를 등록하고 바로 결정할 수 있습니다.'}
      </p>
      <form onSubmit={save}>
        <div className="field">
          <label className="label" htmlFor="category">카테고리</label>
          <select id="category" className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor="name">선택지 이름</label>
          <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 김치찌개" />
        </div>
        <button type="button" className="secondary" onClick={addItem} style={{ marginTop: 12 }}>선택지 추가</button>

        <div className="list">
          {items.map((item, index) => (
            <div className="item" key={`${item.name}-${index}`}>
              <span><strong>{item.name}</strong> <span className="muted">· {item.category}</span></span>
              <button type="button" className="smallButton danger" onClick={() => removeItem(index)}>삭제</button>
            </div>
          ))}
        </div>

        {message && <p className="error">{message}</p>}
        <button className="primary" type="submit" disabled={saving || loadingUser} style={{ marginTop: 20 }}>
          {saving ? '저장 중...' : loadingUser ? '확인 중...' : user ? '저장하기' : '저장하고 결정하기'}
        </button>
      </form>
    </section>
  );
}
