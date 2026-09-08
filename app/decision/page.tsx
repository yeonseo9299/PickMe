'use client';
import { useState } from 'react';
export default function DecisionPage(){ const [result,setResult]=useState(''); const [error,setError]=useState('');
 async function decide(){setError(''); setResult(''); const r=await fetch('/api/decisions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:'demo-user'})}); const d=await r.json(); if(!r.ok){setError(d.message??'결정에 실패했습니다.');return;} setResult(d.result);}
 return <main className="container"><section className="card result"><h1>오늘은 뭘 고를까요?</h1><p className="muted">등록된 선택지 중 하나를 랜덤으로 결정합니다.</p><button className="primary" style={{marginTop:18}} onClick={decide}>결정하기</button>{result&&<div><p className="muted">오늘의 선택</p><div className="resultName">{result}</div></div>}{error&&<p className="error">{error}</p>}</section></main> }
