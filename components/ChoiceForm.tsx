'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChoiceForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('음식');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('선택지를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/choices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-user', name, category }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? '선택지 저장에 실패했습니다.');
        return;
      }

      router.push('/choices');
      router.refresh();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h1 className="title">선택지 등록</h1>
      <p className="muted">결정하고 싶은 선택지를 하나 추가해보세요.</p>

      <div className="field">
        <label className="label" htmlFor="name">
          선택지 이름
        </label>
        <input
          id="name"
          className="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={50}
          placeholder="예: 피자"
        />
      </div>

      <div className="field">
        <label className="label" htmlFor="category">
          카테고리
        </label>
        <select
          id="category"
          className="select"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option>음식</option>
          <option>쇼핑</option>
          <option>여가</option>
          <option>기타</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <button className="primary" type="submit" disabled={loading} style={{ marginTop: 18 }}>
        {loading ? '저장 중...' : '저장하기'}
      </button>
    </form>
  );
}
