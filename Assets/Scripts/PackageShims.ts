// Type-only shim to unblock TypeScript compilation for Spectacles Interaction types.
// This project includes packages that reference a global SpecsInteractionModule
// namespace (both as a TYPE and as a VALUE). If your environment doesn't
// provide typings for it, TS will fail.
//
// We keep it permissive on purpose: everything is typed as any.

// Allow usage as a VALUE: SpecsInteractionModule.SomeEnum / SpecsInteractionModule.someFn
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const SpecsInteractionModule: any;

// Allow usage as a TYPE: SpecsInteractionModule.CastHit, etc.
declare namespace SpecsInteractionModule {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type CastHit = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Overlap = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type OverlapProbeOptions = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type SphereOverlapProbe = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type OverlapEnterEventArgs = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type OverlapExitEventArgs = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type CursorVisualState = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Interactor = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type FieldState = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type InteractableOptions = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type InteractionPlaneOptions = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type TargetingVisual = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type TargetingPriority = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Cursor = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type TargetingRay = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type CursorVisualMode = any;
}
