export type ProjectVideo = {
  projectId: number;
  finalVideoUrl: string;
  status: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export type MergeProjectVideosResponse = {
  success: boolean;
  message: string;
  data: ProjectVideo;
};

export type GetFinalVideoResponse = {
  success: boolean;
  message: string;
  data: ProjectVideo;
};

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
