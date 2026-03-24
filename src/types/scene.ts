export type SceneOptionalElementsObject = {
  action: string;
  pose: string;
  camera: string;
  cameraMotion: string;
  lighting: string;
  mood: string;
  timeOfDay: string;
  effects: string[];
  backgroundCharacters: string;
  environmentDetail: string;
};

export type Scene = {
  id: number;
  projectId: number;
  sceneOrder: number;
  summary: string;
  optionalElements: string;
  optionalElementsObject: SceneOptionalElementsObject;
  imagePrompt: string;
  videoPrompt: string;
  imageUrl: string;
  editedImageUrl: string;
  videoUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  representativeImageUrl: string;
  representativeVideoUrl: string;
};

export type SceneDesign = {
  sceneId: number;
  summary: string;
  optionalElements: SceneOptionalElementsObject;
  imagePrompt: string;
  videoPrompt: string;
  displayText: string;
  updatedAt: string;
};

export type GenerateScenesRequest = {
  selectedPlanId: number;
};

export type GeneratedSceneItem = {
  id: number;
  sceneOrder: number;
  summary: string;
  status: string;
};

export type GenerateScenesResponse = {
  success: boolean;
  message: string;
  data: GeneratedSceneItem[];
};

export type GetScenesResponse = {
  success: boolean;
  message: string;
  data: Scene[];
};

export type GenerateSceneDesignRequest = {
  designRequest: string;
};

export type GenerateSceneDesignResponse = {
  success: boolean;
  message: string;
  data: Scene;
};

export type GetSceneDesignResponse = {
  success: boolean;
  message: string;
  data: SceneDesign;
};

export type DeleteSceneResponse = {
  success: boolean;
  message: string;
  data: Record<string, never>;
};

export type RegenerateSceneDesignRequest = {
  regenerateType?: string;
  userRequest?: string;
};

export type RegenerateSceneDesignResponse = {
  success: boolean;
  message: string;
  data: SceneDesign;
};

export type SceneImageItem = {
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
  fallbackUsed: boolean;
};

export type GetSceneImagesResponse = {
  success: boolean;
  message: string;
  data: SceneImageItem[];
};

export type GenerateScenePromptResponseData = {
  sceneId: number;
  imagePrompt: string;
  videoPrompt: string;
};

export type GenerateScenePromptResponse = {
  success: boolean;
  message: string;
  data: GenerateScenePromptResponseData;
};
