import type { Student, Payment } from './definitions';

export const students: Student[] = [
  { id: '1', name: 'Aarav Sharma' },
  { id: '2', name: 'Diya Patel' },
  { id: '3', name: 'Rohan Mehta' },
  { id: '4', name: 'Isha Gupta' },
  { id: '5', name: 'Arjun Singh' },
  { id: '6', name: 'Saanvi Reddy' },
  { id: '7', name: 'Kabir Kumar' },
  { id: '8', name: 'Ananya Rao' },
  { id: '9', name: 'Vivaan Joshi' },
  { id: '10', name: 'Myra Desai' },
];

export const payments: Payment[] = [
  { id: 'p1', studentId: '1', studentName: 'Aarav Sharma', amount: 240, status: 'completed', timestamp: '2023-10-26T10:00:00Z' },
  { id: 'p2', studentId: '2', studentName: 'Diya Patel', amount: 240, status: 'pending', timestamp: '2023-10-26T09:45:00Z' },
  { id: 'p3', studentId: '3', studentName: 'Rohan Mehta', amount: 240, status: 'completed', timestamp: '2023-10-26T11:20:00Z' },
  { id: 'p4', studentId: '4', studentName: 'Isha Gupta', amount: 240, status: 'pending', timestamp: '2023-10-26T11:30:00Z' },
  { id: 'p5', studentId: '5', studentName: 'Arjun Singh', amount: 240, status: 'completed', timestamp: '2023-10-25T14:00:00Z' },
  { id: 'p6', studentId: '6', studentName: 'Saanvi Reddy', amount: 240, status: 'pending', timestamp: '2023-10-26T12:05:00Z' },
  { id: 'p7', studentId: '7', studentName: 'Kabir Kumar', amount: 240, status: 'completed', timestamp: '2023-10-24T18:00:00Z' },
  { id: 'p8', studentId: '8', studentName: 'Ananya Rao', amount: 240, status: 'pending', timestamp: '2023-10-26T12:10:00Z' },
  { id: 'p9', studentId: '9', studentName: 'Vivaan Joshi', amount: 240, status: 'pending', timestamp: '2023-10-26T12:12:00Z' },
  { id: 'p10', studentId: '10', studentName: 'Myra Desai', amount: 240, status: 'completed', timestamp: '2023-10-26T12:15:00Z' },
];

export const firestoreLogs = `
[2023-10-26T10:00:00Z] INFO: Write operation success. Document: /payments/p1. Data: { studentId: '1', amount: 240, status: 'completed' }.
[2023-10-26T11:20:00Z] INFO: Write operation success. Document: /payments/p3. Data: { studentId: '3', amount: 240, status: 'completed' }.
[2023-10-26T11:21:05Z] ERROR: Write operation failed. Document: /payments/p_temp_567. Reason: Invalid data format. Data: { studentId: '4', amount: '240.00 INR', status: 'pending' }.
[2023-10-26T12:15:00Z] INFO: Write operation success. Document: /payments/p10. Data: { studentId: '10', amount: 240, status: 'completed' }.
[2023-10-26T12:18:00Z] INFO: Update operation success. Document: /payments/p2. Data: { status: 'completed' }.
[2023-10-26T12:19:00Z] WARNING: Read operation slow. Document: /students/s_all. Latency: 1500ms.
[2023-10-26T12:20:00Z] INFO: Write operation success. Document: /payments/p_corrupt_88. Data: { studentId: '11', amount: -50, status: 'completed' }.
`;
