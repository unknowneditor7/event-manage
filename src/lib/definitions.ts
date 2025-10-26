export type Student = {
  id: string;
  name: string;
};

export type Payment = {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  status: 'pending' | 'completed';
  timestamp: string; // ISO 8601 format
};
