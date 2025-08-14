export type SurveyListItem = {
  id: number;
  title: string;
  creatorName: string;
  questionCount: number;
  published: boolean;
};

export type SurveyDetail = {
  id: number;
  title: string;
  creatorName: string;
  questionCount: number;
  published: boolean;
  createdAt: string; // ISO文字列
};