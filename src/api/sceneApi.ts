import { axiosInstance } from "./axiosInstance";
import type {
  DeleteSceneResponse,
  GenerateScenesResponse,
  GetSceneDesignResponse,
  GetSceneImagesResponse,
  GetScenesResponse,
  RegenerateSceneDesignRequest,
  RegenerateSceneDesignResponse,
} from "../types/scene";

type GenerateScenesParams = {
  projectId: number;
};

type GetScenesParams = {
  projectId: number;
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

export async function generateScenes({ projectId }: GenerateScenesParams) {
  const response = await axiosInstance.post<GenerateScenesResponse>(
    `/api/scenes/projects/${projectId}/scenes/generate`,
  );

  return response.data;
}

export async function getScenesByProject({ projectId }: GetScenesParams) {
  const response = await axiosInstance.get<GetScenesResponse>(
    `/api/scenes/projects/${projectId}/scenes`,
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
