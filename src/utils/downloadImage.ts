export async function downloadImageFromUrl(
  imageUrl: string,
  fileName = "scene-image.png",
) {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error("이미지 다운로드에 실패했습니다.");
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(blobUrl);
}
