import { axiosInstance } from "./axiosInstance";

export interface CoreElements {
  purpose?: string;
  duration?: number;
  ratio?: string;
  style?: string;
  mainCharacter?: string;
  subCharacters?: string[];
  backgroundWorld?: string;
  storyFlow?: string;
  storyLine?: string;
}

export interface Plan {
  planId: number;
  title: string;
  focus: string;
  displayText: string;
  recommendationReason?: string;
  strengths?: string[];
  targetMood?: string;
  targetUseCase?: string;
  coreElements?: CoreElements;
  storyLine?: string;
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
  const response = await axiosInstance.post<ApiResponse<{ plans: Plan[] }>>(
    `/api/projects/${projectId}/plans`,
    { userPrompt },
  );
  return response.data;
}

export async function getPlanHistory({
  projectId,
}: {
  projectId: number | string;
}) {
  const response = await axiosInstance.get<ApiResponse<Plan[]>>(
    `/api/projects/${projectId}/plans`,
  );
  return response.data;
}
