import { axiosInstance } from "./axiosInstance";

export interface ProjectPlanResponse {
  title: string;
  theme: string;
  mainCharacter: string;
  background: string;
  timeOfDay: string;
  mood: string;
  style: string;
  scenes: { sceneNumber: number; description: string; imagePrompt: string }[];
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function createPlan({
  projectId,
  userPrompt,
}: {
  projectId: number | string;
  userPrompt: string;
}) {
  const response = await axiosInstance.post<
    ApiResponse<ProjectPlanResponse>
  >(`/api/projects/${projectId}/plans`, { userPrompt });
  return response.data;
}

export async function getPlanHistory({
  projectId,
}: {
  projectId: number | string;
}) {
  const response = await axiosInstance.get<
    ApiResponse<ProjectPlanResponse[]>
  >(`/api/projects/${projectId}/plans`);
  return response.data;
}
