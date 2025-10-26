import type { Student, Payment } from './definitions';

export const students: Student[] = [
  { id: 's1', name: 'Aadhavan E' },
  { id: 's2', name: 'Akash S' },
  { id: 's3', name: 'Balaguru K' },
  { id: 's4', name: 'Elanthamizhan M' },
  { id: 's5', name: 'Gowtham D' },
  { id: 's6', name: 'Gubendiran M' },
  { id: 's7', name: 'Jokish S' },
  { id: 's8', name: 'Kishore P' },
  { id: 's9', name: 'Lingeshwaran S' },
  { id: 's10', name: 'Mahahalin K' },
  { id: 's11', name: 'Malarmannan M' },
  { id: 's12', name: 'Manikandan M' },
  { id: 's13', name: 'Mukilvannan S' },
  { id: 's14', name: 'Neethiazagan R' },
  { id: 's15', name: 'Pravin M' },
  { id: 's16', name: 'Sachin S' },
  { id: 's17', name: 'Sakthi V' },
  { id: 's18', name: 'Sanjay S' },
  { id: 's19', name: 'Sehwag V' },
  { id: 's20', name: 'Selvaganesh S' },
  { id: 's21', name: 'Shreevishnu K' },
  { id: 's22', name: 'Sibiraj S' },
  { id: 's23', name: 'Simbu M' },
  { id: 's24', name: 'Sunilkumar D' },
  { id: 's25', name: 'Surya D' },
  { id: 's26', name: 'Sutharsan M' },
  { id: 's27', name: 'Tamilmaran G' },
  { id: 's28', name: 'Tamilselvan T' },
  { id: 's29', name: 'Thirumaran K' },
  { id: 's30', name: 'Veeraraj P' },
  { id: 's31', name: 'Vembaran S' },
  { id: 's32', name: 'Vigneshwaran R' },
  { id: 's33', name: 'Vijay Babu B' },
  { id: 's34', name: 'Vishal' },
  { id: 's35', name: 'Vishwa A' },
  { id: 's36', name: 'Vishwa S' },
];

export const payments: Payment[] = [
  { id: 'p1', studentId: 's1', studentName: 'Aadhavan E', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p2', studentId: 's2', studentName: 'Akash S', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p3', studentId: 's3', studentName: 'Balaguru K', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p4', studentId: 's4', studentName: 'Elanthamizhan M', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p5', studentId: 's5', studentName: 'Gowtham D', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p6', studentId: 's6', studentName: 'Gubendiran M', amount: 240, status: 'completed', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p7', studentId: 's7', studentName: 'Jokish S', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p8', studentId: 's8', studentName: 'Kishore P', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p9', studentId: 's9', studentName: 'Lingeshwaran S', amount: 240, status: 'completed', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p10', studentId: 's10', studentName: 'Mahahalin K', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p11', studentId: 's11', studentName: 'Malarmannan M', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p12', studentId: 's12', studentName: 'Manikandan M', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p13', studentId: 's13', studentName: 'Mukilvannan S', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p14', studentId: 's14', studentName: 'Neethiazagan R', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p15', studentId: 's15', studentName: 'Pravin M', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p16', studentId: 's16', studentName: 'Sachin S', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p17', studentId: 's17', studentName: 'Sakthi V', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p18', studentId: 's18', studentName: 'Sanjay S', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p19', studentId: 's19', studentName: 'Sehwag V', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p20', studentId: 's20', studentName: 'Selvaganesh S', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p21', studentId: 's21', studentName: 'Shreevishnu K', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p22', studentId: 's22', studentName: 'Sibiraj S', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p23', studentId: 's23', studentName: 'Simbu M', amount: 240, status: 'completed', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p24', studentId: 's24', studentName: 'Sunilkumar D', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p25', studentId: 's25', studentName: 'Surya D', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p26', studentId: 's26', studentName: 'Sutharsan M', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p27', studentId: 's27', studentName: 'Tamilmaran G', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p28', studentId: 's28', studentName: 'Tamilselvan T', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p29', studentId: 's29', studentName: 'Thirumaran K', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p30', studentId: 's30', studentName: 'Veeraraj P', amount: 240, status: 'completed', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p31', studentId: 's31', studentName: 'Vembaran S', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p32', studentId: 's32', studentName: 'Vigneshwaran R', amount: 240, status: 'completed', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p33', studentId: 's33', studentName: 'Vijay Babu B', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p34', studentId: 's34', studentName: 'Vishal', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p35', studentId: 's35', studentName: 'Vishwa A', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
  { id: 'p36', studentId: 's36', studentName: 'Vishwa S', amount: 240, status: 'pending', timestamp: '2023-10-27T09:00:00Z' },
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
