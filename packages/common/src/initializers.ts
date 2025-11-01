type InitializeCanvasConfigWithElement = {
  element: HTMLCanvasElement;
  width?: number;
  height?: number;
};

type InitializeCanvasConfigWithElementId = {
  elementId: string;
  width?: number;
  height?: number;
};

type InitializeCanvasConfig = InitializeCanvasConfigWithElement | InitializeCanvasConfigWithElementId;

export function initializeCanvas(config: InitializeCanvasConfig) {
  if (Object.hasOwn(config, 'elementId')) {
    const { elementId, height, width } = config as InitializeCanvasConfigWithElementId;
    const canvas = document.getElementById(elementId) as HTMLCanvasElement | null;

    if (canvas) {
      const context = canvas.getContext('2d')!;
      canvas.width = width ?? 256;
      canvas.height = height ?? 240;

      return { canvas, context };
    }
  }

  if (Object.hasOwn(config, 'element')) {
    const { element, height, width } = config as InitializeCanvasConfigWithElement;
    if (element instanceof HTMLCanvasElement) {
      const context = element.getContext('2d')!;
      element.width = width ?? 256;
      element.height = height ?? 240;

      return { canvas: element, context };
    }
  }

  throw new Error('You need to provide a reference to a Canvas Element or an id pointing to a Canvas Element.');
}

export function createCanvas(element: string | Element) {
  if (element instanceof HTMLCanvasElement) {
    const ctx = element.getContext('2d');
    return { canvas: element, context: ctx };
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  canvas.width = 256;
  canvas.height = 240;
  canvas.id = 'screen';

  if (element instanceof Element) {
    element.appendChild(canvas);
  } else {
    const container = document.querySelector(element);
    container!.appendChild(canvas);
  }

  return { canvas, context: ctx };
}
