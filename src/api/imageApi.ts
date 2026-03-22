import { axiosInstance } from "./axiosInstance";
import type {
  GenerateSceneImageResponse,
  GetProjectImagesResponse,
} from "../types/image";

type GenerateSceneImageParams = {
  projectId: number;
  sceneId: number;
};

type GetProjectImagesParams = {
  projectId: number;
};

export async function generateSceneImage({
  projectId,
  sceneId,
}: GenerateSceneImageParams) {
  const response = await axiosInstance.post<GenerateSceneImageResponse>(
    `/api/projects/${projectId}/scenes/${sceneId}/images/generate`,
  );

  return response.data;
}

export async function getProjectImages({ projectId }: GetProjectImagesParams) {
  const response = await axiosInstance.get<GetProjectImagesResponse>(
    `/api/projects/${projectId}/images`,
  );

  return response.data;
}
