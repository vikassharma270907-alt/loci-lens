/**
 * Ambient type declarations for Lens Studio, Spectacles Interaction Kit (SIK), & LEAF Testing Framework
 */

declare function component(target: any): any;
declare function input(target: any, propertyKey: string): void;
declare function allowUndefined(target: any, propertyKey: string): void;
declare function hint(text: string): (target: any, propertyKey: string) => void;

declare namespace ui {
  function group_start(name: string): (target: any, propertyKey?: string) => void;
  function group_end(target: any, propertyKey?: string): void;
}

declare class vec3 {
  x: number;
  y: number;
  z: number;
  constructor(x?: number, y?: number, z?: number);
}

declare class vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
  constructor(x?: number, y?: number, z?: number, w?: number);
}

declare class Transform {
  getLocalPosition(): vec3;
  setLocalPosition(pos: vec3): void;
  getWorldPosition(): vec3;
  setWorldPosition(pos: vec3): void;
  forward: vec3;
  up: vec3;
  right: vec3;
}

declare class SceneObject {
  name: string;
  enabled: boolean;
  getChildrenCount(): number;
  getChild(index: number): SceneObject;
  createComponent(componentType: string): any;
  getComponent(componentType: string): any;
  getParent(): SceneObject | null;
  setParent(parent: SceneObject | null): void;
  getTransform(): Transform;
}

declare class BaseScriptComponent {
  getSceneObject(): SceneObject;
  getTransform(): Transform;
  enabled: boolean;
  createEvent(eventName: string): {
    bind(callback: () => void): void;
  };
}

declare class Material {}

declare class AudioTrack {}

// Merges with DOM Audio or Lens Studio Audio
declare namespace Audio {
  enum PlaybackMode {
    LowLatency = 0,
    Default = 1,
  }
}

interface AudioConstructor {
  PlaybackMode: {
    LowLatency: number;
    Default: number;
  };
}

declare class AudioComponent {
  playbackMode: any;
  audioTrack?: AudioTrack;
  play(loops: number): void;
}

declare enum TextFillMode {
  Solid = 0,
}

// Augment DOM Text interface for Lens Studio Component.Text
interface Text {
  text: string;
  size: number;
  textFill: {
    mode: TextFillMode;
    color: vec4;
  };
  enabled: boolean;
}

declare class Shape {
  static createBoxShape(): { size: vec3 };
}

declare class ColliderComponent {
  shape: any;
}

declare enum MeshTopology {
  Triangles = 0,
}

declare class MeshBuilder {
  topology: MeshTopology;
  constructor(descriptors: Array<{ name: string; components: number }>);
  appendVerticesInterleaved(vertices: number[]): void;
  appendIndices(indices: number[]): void;
  isValid(): boolean;
  updateMesh(): void;
  getMesh(): any;
}

declare class RenderMeshVisual {
  mesh: any;
  mainMaterial: Material;
}

declare namespace global {
  namespace scene {
    function createSceneObject(name: string): SceneObject;
  }
}

declare function print(message: any): void;

declare module "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable" {
  import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
  export class Interactable {
    static getTypeName(): string;
    onTriggerEnd: {
      add(callback: (event: InteractorEvent) => void): void;
      remove(callback: (event: InteractorEvent) => void): void;
    };
  }
}

declare module "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent" {
  export class InteractorEvent {}
}

declare module "Leaf.lspkg/Scenarios/scenario/Scenario" {
  export class Scenario {
    static getTypeName(): string;
    run?(): Promise<void> | void;
    onStart?(): Promise<void> | void;
  }
}

declare module "Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator" {
  export function ScenarioIndex(index?: number): (target: any) => any;
  export function scenariosIndex(...args: any[]): any;
}

declare module "Leaf.lspkg/Scenarios/scenario/ScenarioMetadata" {
  export interface ScenarioMetadata {
    id: string;
    typename: string;
  }
}

declare module "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor" {
  export class DefaultLeafInteractor {
    trigger(target: any): Promise<void>;
    hover(target: any, durationMs?: number): Promise<void>;
    tap(target: any): Promise<void>;
  }
}

declare module "Leaf.lspkg/Interactors/interactor/IkBodyInteractor" {
  export class IkBodyInteractor {
    trigger(target: any): Promise<void>;
    reach(target: any): Promise<void>;
    pinch(target: any): Promise<void>;
  }
}

declare module "Leaf.lspkg/Interactors/InteractableUtils" {
  export function findInteractableByName(name: string): any;
}

declare module "Leaf.lspkg/Utils/common/Utils" {
  export function findSceneObjectByName(name: string): any;
}

declare module "Leaf.lspkg/Utils/common/Expect" {
  export function expect(val: any): {
    toBe(expected: any): void;
    toEqual(expected: any): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toBeCloseTo(expected: number, delta?: number): void;
    toBeGreaterThan(expected: number): void;
  };
}

declare module "Leaf.lspkg/Utils/common/AsyncUtils" {
  export function sleep(ms: number): Promise<void>;
  export function nextFrame(): Promise<void>;
}
