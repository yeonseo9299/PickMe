'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError('');
    if (password !== confirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    setLoading(true);
    const response = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,email,password}) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) { setError(data.message || '회원가입에 실패했습니다.'); return; }
    router.push('/'); router.refresh();
  }
  return <main className="container"><section className="card authCard"><h1>회원가입</h1><p className="muted">계정을 만들면 내 선택지와 결정 기록을 따로 저장할 수 있습니다.</p><form onSubmit={submit} className="form"><div className="field"><label className="label">이름</label><input className="input" value={name} onChange={e=>setName(e.target.value)} required /></div><div className="field"><label className="label">이메일</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div><div className="field"><label className="label">비밀번호</label><input className="input" type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required /></div><div className="field"><label className="label">비밀번호 확인</label><input className="input" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required /></div>{error && <p className="error">{error}</p>}<button className="primary" style={{marginTop:18,width:'100%'}} disabled={loading}>{loading ? '가입 중...' : '회원가입'}</button></form><p className="muted authSwitch">이미 계정이 있나요? <Link href="/login">로그인</Link></p></section></main>;
}
