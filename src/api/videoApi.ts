import { axiosInstance } from "./axiosInstance";
import type {
  GenerateSceneVideoResponse,
  GetProjectVideosResponse,
  MergeProjectVideosResponse,
  GetFinalVideoResponse,
} from "../types/video";

type GenerateSceneVideoParams = {
  projectId: number;
  sceneId: number;
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
}: GenerateSceneVideoParams) {
  const response = await axiosInstance.post<GenerateSceneVideoResponse>(
    `/api/projects/${projectId}/scenes/${sceneId}/videos/generate`,
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

/**
 * 프로젝트 영상 병합
 */
export async function mergeProjectVideos(projectId: number) {
  const response = await axiosInstance.post<MergeProjectVideosResponse>(
    `/api/projects/${projectId}/videos/merge`,
    {
      skipMissingVideos: false,
      outputFormat: "mp4",
      outputQuality: 720,
    },
  );

  return response.data;
}

/**
 * 최종 병합 영상 조회
 */
export async function getFinalVideo(projectId: number) {
  const response = await axiosInstance.get<GetFinalVideoResponse>(
    `/api/projects/${projectId}/videos/final`,
  );

  return response.data;
}
