'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Choice } from '@/types/choice';

export default function ChoicesPage() {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  async function loadChoices() {
    try {
      const response = await fetch('/api/choices?userId=demo-user', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? '선택지 조회에 실패했습니다.');
      setChoices(data.choices ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '선택지 조회에 실패했습니다.');
    }
  }

  useEffect(() => {
    void loadChoices();
  }, []);

  async function removeChoice(id: string) {
    const response = await fetch(`/api/choices/${id}?userId=demo-user`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message ?? '삭제에 실패했습니다.');
      return;
    }
    await loadChoices();
  }

  async function updateChoice(id: string) {
    if (!editingName.trim()) return;
    const response = await fetch(`/api/choices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo-user', name: editingName }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message ?? '수정에 실패했습니다.');
      return;
    }
    setEditingId(null);
    setEditingName('');
    await loadChoices();
  }

  return (
    <main className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <div>
            <h1 className="title">선택지 관리</h1>
            <p className="muted">등록된 선택지를 확인하고 수정하거나 삭제하세요.</p>
          </div>
          <Link className="primary" href="/choices/register">+ 추가</Link>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="list">
          {choices.length === 0 ? (
            <p className="muted">등록된 선택지가 없습니다.</p>
          ) : (
            choices.map((choice) => (
              <div className="item" key={choice._id}>
                {editingId === choice._id ? (
                  <input
                    className="input"
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    maxLength={50}
                  />
                ) : (
                  <div>
                    <strong>{choice.name}</strong>
                    <div className="muted">{choice.category ?? '기타'}</div>
                  </div>
                )}
                <div className="itemActions">
                  {editingId === choice._id ? (
                    <button className="smallButton" onClick={() => void updateChoice(choice._id!)}>
                      저장
                    </button>
                  ) : (
                    <button
                      className="smallButton"
                      onClick={() => {
                        setEditingId(choice._id!);
                        setEditingName(choice.name);
                      }}
                    >
                      수정
                    </button>
                  )}
                  <button className="smallButton danger" onClick={() => void removeChoice(choice._id!)}>
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
