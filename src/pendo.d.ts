interface PendoVisitor {
  id: string;
  [key: string]: string | number | boolean | undefined;
}

interface PendoInitializeOptions {
  visitor?: PendoVisitor;
  account?: { id: string; [key: string]: string | number | boolean | undefined };
}

interface Pendo {
  initialize(options: PendoInitializeOptions): void;
  track(eventName: string, properties?: Record<string, string | number | boolean>): void;
}

declare const pendo: Pendo;
