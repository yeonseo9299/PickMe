import Link from 'next/link';

export default function HomePage() {
  return <main className="container"><section className="hero"><h1>결정장애 탈출기</h1><p>고민되는 선택지를 등록하고,<br/>랜덤으로 하나를 골라보세요.</p><div className="actions"><Link className="primary" href="/choices/register">선택지 등록하기</Link><Link className="secondary" href="/decision">결정하기</Link></div></section><section className="card"><h2 className="title">프로젝트 MVP</h2><p className="muted">선택지 등록 · 조회 · 수정 · 삭제 · 랜덤 결정</p></section></main>;
}
