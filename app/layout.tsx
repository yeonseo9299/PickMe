import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import './globals.css';

export const metadata: Metadata = { title: '결정장애 탈출기', description: '일상생활의 선택을 도와주는 랜덤 선택 서비스' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><NavBar />{children}</body></html>;
}
