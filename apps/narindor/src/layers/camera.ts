import type { Camera, Layer } from '@eriador/common';

export function createCameraLayer(cameraToDrawOn: Camera): Layer {
  return function drawCameraRectangle(context, cameraToDrawFrom) {
    context.strokeStyle = 'purple';
    context.beginPath();
    context.rect(
      cameraToDrawOn.position.x - cameraToDrawFrom.position.x,
      cameraToDrawOn.position.y - cameraToDrawFrom.position.y,
      cameraToDrawOn.size.x,
      cameraToDrawOn.size.y,
    );
    context.stroke();
  };
}
