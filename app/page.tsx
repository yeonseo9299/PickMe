'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [user, setUser] = useState<{name:string;email:string}|null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/auth/me', {cache:'no-store'}).then(async r=>{ if(r.ok){const d=await r.json();setUser(d.user);} }).finally(()=>setLoading(false)); }, []);
  const logout = async () => { await fetch('/api/auth/logout',{method:'POST'}); setUser(null); };
  return <main className="container"><section className="hero"><h1>결정장애 탈출기</h1><p>고민되는 선택지를 등록하고,<br/>카테고리별로 랜덤 결정해보세요.</p>{user ? <><p className="userWelcome"><strong>{user.name}</strong>님, 오늘 무엇을 결정할까요?</p><div className="actions"><Link className="primary" href="/choices/register">선택지 등록하기</Link><Link className="secondary" href="/decision">결정하기</Link></div><button className="secondary" style={{marginTop:12}} onClick={logout}>로그아웃</button></> : <div className="actions"><Link className="primary" href="/login">로그인</Link><Link className="secondary" href="/register">회원가입</Link></div>}</section><section className="card"><h2 className="title">프로젝트 MVP</h2><p className="muted">계정별 선택지 관리 · 카테고리별 랜덤 결정 · 계정별 결정 기록</p>{!loading && !user && <p className="muted" style={{marginTop:10}}>서비스 기능을 사용하려면 먼저 로그인해주세요.</p>}</section></main>;
}
