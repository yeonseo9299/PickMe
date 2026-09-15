import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = { title: '결정장애 탈출기', description: '일상생활의 선택을 도와주는 랜덤 선택 서비스' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><nav className="nav"><Link className="logo" href="/">결정장애 탈출기</Link><div className="navLinks"><Link className="navLink" href="/choices">선택지 관리</Link><Link className="navLink" href="/decision">결정하기</Link><Link className="navLink" href="/history">결정 기록</Link></div></nav>{children}</body></html>;
}
