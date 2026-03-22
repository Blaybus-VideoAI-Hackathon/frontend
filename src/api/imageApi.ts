import { axiosInstance } from "./axiosInstance";
import type {
  EditSceneImageResponse,
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

type EditSceneImageWithAiParams = {
  projectId: number;
  sceneId: number;
  imageId: number;
  userEditText: string;
};

export async function editSceneImageWithAi({
  projectId,
  sceneId,
  imageId,
  userEditText,
}: EditSceneImageWithAiParams) {
  const response = await axiosInstance.post<EditSceneImageResponse>(
    `/api/projects/${projectId}/scenes/${sceneId}/images/${imageId}/edit/ai`,
    { userEditText },
  );

  return response.data;
}
