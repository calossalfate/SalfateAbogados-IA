import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de edición | Salfate Abogados",
  robots: { index: false, follow: false },
};

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-100 antialiased">
      {children}
    </div>
  );
}
