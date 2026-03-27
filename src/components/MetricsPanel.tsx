"use client";

import type { TrackingMetrics } from "@/lib/tracking/trackerTypes";

interface MetricsPanelProps {
  metrics: TrackingMetrics;
  status: string;
}

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
    <p className="panel-label">{label}</p>
    <p className="metric-value mt-1 text-lg font-semibold">{value}</p>
  </div>
);

export function MetricsPanel({ metrics, status }: MetricsPanelProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <Metric label="Render FPS" value={metrics.renderFps.toFixed(1)} />
      <Metric label="Tracking FPS" value={metrics.trackingFps.toFixed(1)} />
      <Metric label="Latency" value={`${metrics.estimatedLatencyMs.toFixed(0)} ms`} />
      <Metric label="Backend" value={metrics.backend || "pending"} />
      <Metric label="Confidence" value={metrics.averageConfidence.toFixed(2)} />
      <Metric label="Status" value={status} />
    </div>
  );
}
