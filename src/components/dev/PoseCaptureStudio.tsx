"use client";

import { useMemo, useState } from "react";
import { CandidatePoseInspector } from "@/components/authoring/CandidatePoseInspector";
import { KeyframeSelector } from "@/components/authoring/KeyframeSelector";
import { PoseCapturePreview } from "@/components/authoring/PoseCapturePreview";
import { PoseCaptureUploader } from "@/components/authoring/PoseCaptureUploader";
import { SavePoseDialog } from "@/components/authoring/SavePoseDialog";
import { buildCandidatePose } from "@/lib/authoring/buildCandidatePose";
import { buildCaptureInputFromFile, extractPoseSnapshotsFromVideo } from "@/lib/authoring/extractPoseFromVideo";
import { saveCandidatePose } from "@/lib/authoring/saveCandidatePose";
import { selectKeyPoseFrames } from "@/lib/authoring/selectKeyPoseFrames";
import type { CandidatePoseEntry, PoseCaptureInput, PoseCaptureResult } from "@/lib/types/plans";

export function PoseCaptureStudio() {
  const [files, setFiles] = useState<Partial<Record<PoseCaptureInput["angle"], File>>>({});
  const [captureResult, setCaptureResult] = useState<PoseCaptureResult | null>(null);
  const [candidateId, setCandidateId] = useState("CAPTURED_POSE_DRAFT");
  const [tagsDraft, setTagsDraft] = useState("captured, draft");
  const [notesDraft, setNotesDraft] = useState("Pose candidata generada desde 3 videos.");
  const [processingState, setProcessingState] = useState("Sube tres videos y procesa la captura.");
  const [saveState, setSaveState] = useState("");

  const candidate = useMemo<CandidatePoseEntry | null>(() => {
    if (!captureResult) {
      return null;
    }

    return buildCandidatePose(
      captureResult,
      candidateId,
      tagsDraft
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      notesDraft
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean),
    );
  }, [candidateId, captureResult, notesDraft, tagsDraft]);

  const processVideos = async () => {
    const requiredAngles: PoseCaptureInput["angle"][] = ["front", "threeQuarter", "side"];
    if (!requiredAngles.every((angle) => files[angle])) {
      setProcessingState("Necesitas tres videos: front, threeQuarter y side.");
      return;
    }

    setProcessingState("Procesando videos con el adapter de authoring...");

    try {
      const prepared = await Promise.all(requiredAngles.map((angle) => buildCaptureInputFromFile(files[angle] as File, angle)));
      const snapshots = await Promise.all(prepared.map((item) => extractPoseSnapshotsFromVideo(item.video, item.captureInput.angle)));
      const mergedSnapshots = snapshots.flat();

      setCaptureResult({
        sourceVideos: prepared.map((item) => item.captureInput),
        extractedAt: new Date().toISOString(),
        keyframes: selectKeyPoseFrames(mergedSnapshots),
        notes: [
          "Extraccion en navegador usando el toolkit interno de authoring.",
          "La pose candidata requiere revision antes de promoverse a la libreria estable.",
        ],
      });
      setProcessingState("Extraccion completada. Revisa los keyframes y la pose candidata.");
    } catch (error) {
      setProcessingState(error instanceof Error ? error.message : "No se pudo procesar la captura.");
    }
  };

  const persistCandidate = async () => {
    if (!candidate) {
      setSaveState("Primero procesa los videos para construir una candidate pose.");
      return;
    }

    try {
      const result = await saveCandidatePose(candidate);
      setSaveState(`Guardado en ${result.path}`);
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : "Error guardando candidate pose.");
    }
  };

  return (
    <main className="container-shell py-10">
      <div className="mb-8 max-w-[900px]">
        <p className="eyebrow">Authoring interno</p>
        <h1 className="section-title mt-5">Captura de poses desde tres videos</h1>
        <p className="body-copy mt-4">
          Este flujo no alimenta el runtime principal con landmarks crudos. Solo genera candidate poses revisables para acelerar el authoring y luego promover assets estables al motor de reproduccion.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <button className="action-button primary" onClick={processVideos} type="button">
          Procesar videos
        </button>
        <div className="rounded-full border border-[var(--border)] bg-[rgba(255,249,240,0.8)] px-4 py-3 text-sm text-[var(--muted)]">{processingState}</div>
      </div>

      <div className="grid gap-6">
        <PoseCaptureUploader files={files} onChange={(angle, file) => setFiles((current) => ({ ...current, [angle]: file ?? undefined }))} />
        <KeyframeSelector captureResult={captureResult} />
        <PoseCapturePreview candidate={candidate} captureResult={captureResult} />
        <CandidatePoseInspector candidate={candidate} onCandidateIdChange={setCandidateId} onNotesChange={setNotesDraft} onTagsChange={setTagsDraft} />
        <SavePoseDialog onSave={persistCandidate} saveState={saveState} />
      </div>
    </main>
  );
}
