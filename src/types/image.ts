export type SceneImage = {
  id: number;
  sceneId: number;
  imageNumber: number;
  imageUrl: string;
  editedImageUrl: string;
  imagePrompt: string;
  status: string;
  statusDescription: string;
  createdAt: string;
  updatedAt: string;
};

export type GenerateSceneImageResponse = {
  success: boolean;
  message: string;
  data: SceneImage;
};

export type GetProjectImagesResponse = {
  success: boolean;
  message: string;
  data: SceneImage[];
};

export type EditSceneImageResponse = {
  success: boolean;
  message: string;
  data: SceneImage;
};
