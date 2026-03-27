import { Quaternion, Vector3 } from "three";
import { clamp } from "@/lib/utils/clamp";
import { expSmoothingFactor, quaternionAngle } from "@/lib/utils/math";

export class ExponentialVectorFilter {
  private value = new Vector3();
  private initialized = false;

  update(next: Vector3, deltaSeconds: number, strength: number) {
    if (!this.initialized) {
      this.value.copy(next);
      this.initialized = true;
      return this.value.clone();
    }

    const alpha = expSmoothingFactor(strength, deltaSeconds);
    this.value.lerp(next, alpha);
    return this.value.clone();
  }

  current() {
    return this.value.clone();
  }
}

export class QuaternionFilter {
  private value = new Quaternion();
  private initialized = false;

  update(next: Quaternion, deltaSeconds: number, strength: number, deadZoneRadians: number) {
    if (!this.initialized) {
      this.value.copy(next);
      this.initialized = true;
      return this.value.clone();
    }

    if (quaternionAngle(this.value, next) <= deadZoneRadians) {
      return this.value.clone();
    }

    const alpha = clamp(expSmoothingFactor(strength, deltaSeconds), 0.01, 1);
    this.value.slerp(next, alpha);
    return this.value.clone();
  }

  set(next: Quaternion) {
    this.value.copy(next);
    this.initialized = true;
  }

  current() {
    return this.value.clone();
  }
}
