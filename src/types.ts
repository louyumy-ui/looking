export interface Criterion {
  id: string;
  name: string;
  weight: number;
  isLocked: boolean;
  description: string;
}

export interface CallRecord {
  id: string;
  status: 'connected' | 'missed';
  aiTranscript: string;
  customerTranscript: string;
  score: number;
  timestamp: string;
  duration: string;
  tags: string[];
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  trend: number;
  data: { time: string; value: number }[];
}
