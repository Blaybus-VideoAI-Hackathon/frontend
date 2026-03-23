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

/* --------------------------------------------------
   프로젝트 기획 생성
   POST /api/projects/{projectId}/planning/generate
-------------------------------------------------- */

export interface GeneratePlanningRequest {
  userPrompt: string;
}

export interface GeneratedPlanItem {
  planId: number;
  title: string;
  focus: string;
  displayText: string;
  recommendationReason: string;
  strengths: string[];
  targetMood: string;
  targetUseCase: string;
  coreElements: {
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
  storyLine: string;
}

export interface GeneratePlanningResult {
  projectId: number;
  selectedPlanId: number;
  plans: GeneratedPlanItem[];
}

export async function generateProjectPlanning({
  projectId,
  userPrompt,
}: {
  projectId: number | string;
  userPrompt: string;
}) {
  const response = await axiosInstance.post<
    ApiResponse<GeneratePlanningResult>
  >(`/api/projects/${projectId}/plans`, { userPrompt });

  return response.data;
}

/* --------------------------------------------------
   기획안 선택
   POST /api/projects/{projectId}/plans/{planId}/select
-------------------------------------------------- */

export interface SelectedProjectCore {
  purpose: string;
  duration: number;
  ratio: string;
  style: string;
  mainCharacter: string;
  subCharacters: string[];
  backgroundWorld: string;
  storyFlow: string;
  storyLine: string;
}

export interface SelectedScenePlanItem {
  sceneOrder: number;
  summary: string;
  sceneGoal: string;
  emotionBeat: string;
  estimatedDuration: number;
}

export interface SelectedScenePlan {
  recommendedSceneCount: number;
  scenes: SelectedScenePlanItem[];
}

export interface SelectPlanResult {
  projectId: number;
  selectedPlanId: number;
  projectCore: SelectedProjectCore;
  scenePlan: SelectedScenePlan;
}

export async function selectProjectPlan({
  projectId,
  planId,
}: {
  projectId: number | string;
  planId: number | string;
}) {
  const response = await axiosInstance.post<ApiResponse<SelectPlanResult>>(
    `/api/projects/${projectId}/plans/${planId}/select`,
    {},
  );

  return response.data;
}

/* --------------------------------------------------
   선택된 기획안 분석
   POST /api/projects/{projectId}/plans/{planId}/analyze
-------------------------------------------------- */

export interface AnalyzeSelectedPlanResult {
  projectId: number;
  selectedPlanId: number;
  projectCore: SelectedProjectCore;
  scenePlan: SelectedScenePlan;
}

export async function analyzeSelectedPlan({
  projectId,
  planId,
}: {
  projectId: number | string;
  planId: number | string;
}) {
  const response = await axiosInstance.post<
    ApiResponse<AnalyzeSelectedPlanResult>
  >(`/api/projects/${projectId}/plans/${planId}/analyze`, {});

  return response.data;
}

/* --------------------------------------------------
   최신 기획 추천 목록 조회
   GET /api/projects/{projectId}/plans/latest
-------------------------------------------------- */

export async function getLatestProjectPlans({
  projectId,
}: {
  projectId: number | string;
}) {
  const response = await axiosInstance.get<ApiResponse<GeneratePlanningResult>>(
    `/api/projects/${projectId}/plans/latest`,
  );

  return response.data;
}
