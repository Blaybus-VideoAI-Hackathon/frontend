import { axiosInstance } from "./axiosInstance";
import type {
  DeleteSceneResponse,
  GenerateSceneDesignRequest,
  GenerateSceneDesignResponse,
  GenerateScenePromptResponse,
  GenerateScenesRequest,
  GenerateScenesResponse,
  GetSceneDesignResponse,
  GetSceneImagesResponse,
  GetScenesResponse,
  RegenerateSceneDesignRequest,
  RegenerateSceneDesignResponse,
} from "../types/scene";

type GenerateScenesParams = {
  projectId: number;
  body: GenerateScenesRequest;
};

type GetScenesParams = {
  projectId: number;
};

type GenerateSceneDesignParams = {
  projectId: number;
  sceneId: number;
  body: GenerateSceneDesignRequest;
};

type GetSceneDesignParams = {
  projectId: number;
  sceneId: number;
};

type DeleteSceneParams = {
  projectId: number;
  sceneId: number;
};

type RegenerateSceneDesignParams = {
  projectId: number;
  sceneId: number;
  body?: RegenerateSceneDesignRequest;
};

type GetSceneImagesParams = {
  projectId: number;
  sceneId: number;
};

type GenerateScenePromptParams = {
  projectId: number;
  sceneId: number;
};

export async function generateScenes({
  projectId,
  body,
}: GenerateScenesParams) {
  const response = await axiosInstance.post<GenerateScenesResponse>(
    `/api/scenes/projects/${projectId}/scenes/generate`,
    body,
  );

  return response.data;
}

export async function getScenesByProject({ projectId }: GetScenesParams) {
  const response = await axiosInstance.get<GetScenesResponse>(
    `/api/scenes/projects/${projectId}/scenes`,
  );

  return response.data;
}

export async function generateSceneDesign({
  projectId,
  sceneId,
  body,
}: GenerateSceneDesignParams) {
  const response = await axiosInstance.post<GenerateSceneDesignResponse>(
    `/api/scenes/projects/${projectId}/scenes/${sceneId}/design`,
    body,
  );

  return response.data;
}

export async function getSceneDesign({
  projectId,
  sceneId,
}: GetSceneDesignParams) {
  const response = await axiosInstance.get<GetSceneDesignResponse>(
    `/api/scenes/projects/${projectId}/scenes/${sceneId}/design`,
  );

  return response.data;
}

export async function deleteScene({ projectId, sceneId }: DeleteSceneParams) {
  const response = await axiosInstance.delete<DeleteSceneResponse>(
    `/api/scenes/projects/${projectId}/scenes/${sceneId}`,
  );

  return response.data;
}

export async function regenerateSceneDesign({
  projectId,
  sceneId,
  body,
}: RegenerateSceneDesignParams) {
  const response = await axiosInstance.post<RegenerateSceneDesignResponse>(
    `/api/scenes/projects/${projectId}/scenes/${sceneId}/design/regenerate`,
    body,
  );

  return response.data;
}

export async function getSceneImages({
  projectId,
  sceneId,
}: GetSceneImagesParams) {
  const response = await axiosInstance.get<GetSceneImagesResponse>(
    `/api/projects/${projectId}/scenes/${sceneId}/images`,
  );

  return response.data;
}

export async function generateScenePrompt({
  projectId,
  sceneId,
}: GenerateScenePromptParams) {
  const response = await axiosInstance.post<GenerateScenePromptResponse>(
    `/api/projects/${projectId}/scenes/${sceneId}/prompt/generate`,
  );

  return response.data;
}
