import Link from "next/link";
import type { UserRole } from "@/types/auth";

interface FeaturePlaceholderProps {
  role: UserRole;
  title: string;
  description: string;
}

export function FeaturePlaceholder({ role, title, description }: FeaturePlaceholderProps) {
  const dashboard = `/${role}/dashboard`;
  return (
    <main className={`workspace-page workspace-page--${role}`}>
      <header className="workspace-topbar"><Link href={dashboard} className="brand-lockup" aria-label="Dashboard home"><span className="brand-mark">s.</span><span>SyllabAI</span></Link><Link className="workspace-back" href={dashboard}>← Dashboard</Link></header>
      <section className="placeholder-card"><span className="placeholder-symbol">✳</span><span className="eyebrow">COMING INTO FOCUS</span><h1>{title}</h1><p>{description}</p><Link className="primary-button primary-button--link" href={dashboard}>Back to your dashboard <span>↗</span></Link></section>
    </main>
  );
}
