import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PoseCapturePage from "@/app/dev/pose-capture/page";
import PoseLibraryPage from "@/app/dev/pose-library/page";
import { HoverCaptureProvider } from "@/components/translator/HoverCaptureProvider";
import { DemoExperience } from "@/components/translator/DemoExperience";
import { useTranslationContext } from "@/lib/state/TranslationContext";

vi.mock("@/components/avatar/AvatarCanvas", () => ({
  AvatarCanvas: ({ poseId }: { poseId: string }) => <div data-testid="avatar-canvas">pose:{poseId}</div>,
}));

function Inspector() {
  const context = useTranslationContext();

  return (
    <div>
      <div data-testid="active-text">{context.activeText}</div>
      <div data-testid="semantic-intent">{context.semanticPlan?.intent ?? ""}</div>
      <div data-testid="sign-count">{context.signPlan?.steps.length ?? 0}</div>
      <div data-testid="play-count">{context.playPlan?.steps.length ?? 0}</div>
      <div data-testid="snapshot-label">{context.playbackSnapshot.activeLabel}</div>
    </div>
  );
}

describe("DemoExperience", () => {
  it("renderiza la landing y el widget/avatar", () => {
    render(<DemoExperience />);

    expect(screen.getByText(/Accesibilidad digital con traduccion contextual en LSC/i)).toBeInTheDocument();
    expect(screen.getByText(/Contexto LSC/i)).toBeInTheDocument();
    expect(screen.getByTestId("avatar-canvas")).toBeInTheDocument();
  });

  it("captura click y genera semanticPlan, signPlan y playPlan", async () => {
    render(
      <HoverCaptureProvider>
        <section>
          <h2 data-semantic-scope="block" data-translate="block">
            Solicitar implementacion
          </h2>
        </section>
        <Inspector />
      </HoverCaptureProvider>,
    );

    fireEvent.click(screen.getByText("Solicitar implementacion"));

    await waitFor(() => {
      expect(screen.getByTestId("active-text")).toHaveTextContent("Solicitar implementacion");
      expect(Number(screen.getByTestId("sign-count").textContent)).toBeGreaterThan(0);
      expect(Number(screen.getByTestId("play-count").textContent)).toBeGreaterThan(0);
    });
  });

  it("reemplaza la reproduccion actual cuando cambia el bloque activo", async () => {
    render(
      <HoverCaptureProvider>
        <div>
          <button data-semantic-scope="block" data-translate="block" type="button">
            Probar demo
          </button>
          <button data-semantic-scope="block" data-translate="block" type="button">
            Hablar con soporte
          </button>
        </div>
        <Inspector />
      </HoverCaptureProvider>,
    );

    fireEvent.click(screen.getByText("Probar demo"));
    await waitFor(() => expect(screen.getByTestId("active-text")).toHaveTextContent("Probar demo"));

    fireEvent.click(screen.getByText("Hablar con soporte"));
    await waitFor(() => expect(screen.getByTestId("active-text")).toHaveTextContent("Hablar con soporte"));
  });

  it("renderiza la pagina dev de pose library", () => {
    render(<PoseLibraryPage />);
    expect(screen.getByText(/Pose library y secuencias de demo/i)).toBeInTheDocument();
  });

  it("renderiza la pagina dev de pose capture", () => {
    render(<PoseCapturePage />);
    expect(screen.getByText(/Captura de poses desde tres videos/i)).toBeInTheDocument();
  });
});
