export type SceneVideo = {
  id: number;
  sceneId: number;
  duration: number;
  videoUrl: string;
  videoPrompt: string;
  status: string;
  statusDescription: string;
  createdAt: string;
  updatedAt: string;
};

export type GenerateSceneVideoResponse = {
  success: boolean;
  message: string;
  data: SceneVideo;
};

export type GetProjectVideosResponse = {
  success: boolean;
  message: string;
  data: SceneVideo[];
};
