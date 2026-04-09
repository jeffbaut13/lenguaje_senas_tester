"use client";

import { AvatarWidget } from "@/components/avatar/AvatarWidget";
import { DemoSection } from "@/components/landing/DemoSection";
import { Hero } from "@/components/landing/Hero";
import { HoverCaptureProvider } from "@/components/translator/HoverCaptureProvider";
import { TranslationDebugPanel } from "@/components/translator/TranslationDebugPanel";

export function DemoExperience() {
  return (
    <HoverCaptureProvider>
      <div className="page-shell">
        <TranslationDebugPanel />
        <main>
          <Hero />
          <DemoSection />
        </main>
        <AvatarWidget />
      </div>
    </HoverCaptureProvider>
  );
}
