import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Controlador | Salfate Abogados",
  robots: { index: false, follow: false },
};

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 antialiased">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.08),_transparent_55%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
