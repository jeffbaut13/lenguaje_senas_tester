"use client";

export function SavePoseDialog({
  saveState,
  onSave,
}: {
  saveState: string;
  onSave: () => void;
}) {
  return (
    <section className="editorial-card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="eyebrow">Paso 5</p>
        <h2 className="section-title mt-4">Guardar en staging</h2>
        <p className="body-copy mt-3">{saveState || "Guarda la candidate pose en src/data/poseStaging para revisión y promoción posterior."}</p>
      </div>
      <button className="action-button primary" onClick={onSave} type="button">
        Guardar candidate pose
      </button>
    </section>
  );
}
