"use client";

import DemoNav from "@/components/demo/DemoNav";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DemoNav />
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-20">{children}</main>
    </div>
  );
}
