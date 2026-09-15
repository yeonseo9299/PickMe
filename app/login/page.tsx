'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) { setError(data.message || '로그인에 실패했습니다.'); return; }
    router.push('/'); router.refresh();
  }

  return <main className="container"><section className="card authCard"><h1>로그인</h1><p className="muted">로그인해야 선택지와 결정 기록을 사용할 수 있습니다.</p><form onSubmit={submit} className="form"><div className="field"><label className="label">이메일</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div><div className="field"><label className="label">비밀번호</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>{error && <p className="error">{error}</p>}<button className="primary" style={{marginTop:18,width:'100%'}} disabled={loading}>{loading ? '로그인 중...' : '로그인'}</button></form><p className="muted authSwitch">계정이 없나요? <Link href="/register">회원가입</Link></p></section></main>;
}
