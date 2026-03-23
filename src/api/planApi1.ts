import { axiosInstance } from "./axiosInstance";

export type PlanScene = {
  sceneNumber: number;
  description: string;
  imagePrompt: string;
};

export type ProjectPlan = {
  title: string;
  theme: string;
  mainCharacter: string;
  background: string;
  timeOfDay: string;
  mood: string;
  style: string;
  scenes: PlanScene[];
  createdAt: string;
};

export type GetProjectPlansResponse = {
  success: boolean;
  message: string;
  data: ProjectPlan[];
};

type GetProjectPlansParams = {
  projectId: number;
};

export async function getProjectPlans({ projectId }: GetProjectPlansParams) {
  const response = await axiosInstance.get<GetProjectPlansResponse>(
    `/api/projects/${projectId}/plans`,
  );

  return response.data;
}

export type ProjectPlanningSummary = {
  projectId: number;
  selectedPlanId: number;
  selectedPlanTitle: string;
  purpose: string;
  duration: number;
  ratio: string;
  style: string;
  mainCharacter: string;
  subCharacters: string[];
  backgroundWorld: string;
  storyFlow: string;
  storyLine: string;
};

export type GetProjectPlanningSummaryResponse = {
  success: boolean;
  message: string;
  data: ProjectPlanningSummary;
};

type GetProjectPlanningSummaryParams = {
  projectId: number;
};

export async function getProjectPlanningSummary({
  projectId,
}: GetProjectPlanningSummaryParams) {
  const response = await axiosInstance.get<GetProjectPlanningSummaryResponse>(
    `/api/projects/${projectId}/planning-summary`,
  );

  return response.data;
}
