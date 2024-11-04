export const ETHICS_OPTIONS = [
    'Freedom and Autonomy',
    'Non-Maleficence',
    'Dignity',
    'Sustainability',
    'Beneficence',
    'Justice and Fairness',
    'Responsibility',
    'Trust',
    'Privacy',
    'Transparency'
  ] as const;
  
  export type EthicsOption = typeof ETHICS_OPTIONS[number];
  
  export interface Survey {
    id: string;
    title: string;
    location: string;
    context: string;
    person: string;
    imageUrl: string;
    isPublic: boolean;
    createdAt: string;
    responses: number;
  }
  
  export interface EthicsComparison {
    cardA: EthicsOption[];
    cardB: EthicsOption[];
  }
  
  export interface SurveyResult {
    ethicsOption: EthicsOption;
    priority: number;
    percentage: number;
  }