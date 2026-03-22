import { axiosInstance } from "./axiosInstance";
import type {
  GenerateSceneVideoResponse,
  GetProjectVideosResponse,
} from "../types/video";

type GenerateSceneVideoParams = {
  projectId: number;
  sceneId: number;
  duration: 3 | 4 | 5;
};

type GetProjectVideosParams = {
  projectId: number;
};

/**
 * 씬 영상 생성
 */
export async function generateSceneVideo({
  projectId,
  sceneId,
  duration,
}: GenerateSceneVideoParams) {
  const response = await axiosInstance.post<GenerateSceneVideoResponse>(
    `/api/projects/${projectId}/scenes/${sceneId}/videos/generate`,
    {
      duration,
    },
  );

  return response.data;
}

/**
 * 프로젝트 전체 영상 조회
 */
export async function getProjectVideos({ projectId }: GetProjectVideosParams) {
  const response = await axiosInstance.get<GetProjectVideosResponse>(
    `/api/projects/${projectId}/videos`,
  );

  return response.data;
}
