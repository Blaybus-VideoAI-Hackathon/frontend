export async function getCroppedImg(
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number },
): Promise<string> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.max(1, Math.floor(crop.width * scaleX));
  canvas.height = Math.max(1, Math.floor(crop.height * scaleY));

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context를 생성할 수 없습니다.");
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY,
  );

  return canvas.toDataURL("image/png");
}
