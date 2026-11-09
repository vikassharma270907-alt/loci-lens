/**
 * Loci Lens - LocusAnchor
 * Manages spatial positioning, 3D world coordinate binding, and raycast fallback mechanics.
 */

export type Vector3 = [number, number, number]; // [x, y, z] in centimeters
export type Quaternion = [number, number, number, number]; // [x, y, z, w]

export interface AnchorConfig {
  cardId: string;
  position: Vector3;
  rotation?: Quaternion;
  surfaceNormal?: Vector3;
  locusName?: string;
}

export class LocusAnchor {
  public readonly cardId: string;
  public position: Vector3;
  public rotation: Quaternion;
  public surfaceNormal: Vector3;
  public locusName: string;
  public isAnchored: boolean = false;
  public anchoredTimestamp: number = 0;

  constructor(config: AnchorConfig) {
    this.cardId = config.cardId;
    this.position = [...config.position];
    this.rotation = config.rotation ? [...config.rotation] : [0, 0, 0, 1];
    this.surfaceNormal = config.surfaceNormal ? [...config.surfaceNormal] : [0, 1, 0];
    this.locusName = config.locusName || `Locus_${config.cardId}`;
  }

  public bindToWorld(pos: Vector3, normal: Vector3 = [0, 1, 0], name?: string): void {
    this.position = [...pos];
    this.surfaceNormal = [...normal];
    if (name) this.locusName = name;
    this.isAnchored = true;
    this.anchoredTimestamp = Date.now();
  }

  public getDistanceTo(viewerPos: Vector3): number {
    const dx = this.position[0] - viewerPos[0];
    const dy = this.position[1] - viewerPos[1];
    const dz = this.position[2] - viewerPos[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Calculates the horizontal bearing angle (in radians) from the viewer to this anchor.
   */
  public getBearingFrom(viewerPos: Vector3, viewerForward: Vector3): number {
    const toAnchorX = this.position[0] - viewerPos[0];
    const toAnchorZ = this.position[2] - viewerPos[2];
    const targetAngle = Math.atan2(toAnchorX, toAnchorZ);
    const forwardAngle = Math.atan2(viewerForward[0], viewerForward[2]);
    let diff = targetAngle - forwardAngle;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    return diff;
  }

  public toJSON() {
    return {
      cardId: this.cardId,
      position: this.position,
      rotation: this.rotation,
      surfaceNormal: this.surfaceNormal,
      locusName: this.locusName,
      isAnchored: this.isAnchored,
      anchoredTimestamp: this.anchoredTimestamp
    };
  }
}
