import { Quaternion, Vector3 } from "three";
import type { BoneRotationTarget } from "@/lib/tracking/trackerTypes";
import { QuaternionFilter } from "@/lib/tracking/filters";

export interface BoneSmoothingState {
  filter: QuaternionFilter;
  lastStable: Quaternion;
  lastUpdateAt: number;
}

export class BoneSmoothingController {
  private readonly states = new Map<string, BoneSmoothingState>();

  update(
    boneName: string,
    target: BoneRotationTarget,
    deltaSeconds: number,
    strength: number,
    deadZoneRadians: number,
  ) {
    const state = this.getState(boneName);
    state.lastUpdateAt = target.updatedAt;
    state.lastStable.copy(target.quaternion);
    return state.filter.update(target.quaternion, deltaSeconds, strength, deadZoneRadians);
  }

  holdLastStable(boneName: string) {
    return this.getState(boneName).lastStable.clone();
  }

  decayToRest(
    boneName: string,
    restQuaternion: Quaternion,
    amount: number,
  ) {
    const state = this.getState(boneName);
    const next = state.filter.current().slerp(restQuaternion.clone(), amount);
    state.filter.set(next);
    return next;
  }

  reset(restPose: Map<string, Quaternion>) {
    this.states.clear();
    restPose.forEach((quaternion, boneName) => {
      const state = this.getState(boneName);
      state.filter.set(quaternion.clone());
      state.lastStable.copy(quaternion);
    });
  }

  private getState(boneName: string) {
    let state = this.states.get(boneName);
    if (!state) {
      state = {
        filter: new QuaternionFilter(),
        lastStable: new Quaternion(),
        lastUpdateAt: 0,
      };
      this.states.set(boneName, state);
    }
    return state;
  }
}

export class VectorSmoothingController {
  private readonly value = new Vector3();
  private initialized = false;

  update(next: Vector3, alpha: number) {
    if (!this.initialized) {
      this.value.copy(next);
      this.initialized = true;
      return this.value.clone();
    }

    this.value.lerp(next, alpha);
    return this.value.clone();
  }

  reset() {
    this.value.set(0, 0, 0);
    this.initialized = false;
  }
}
