'use client';
import { students } from '@/lib/data';
import { StudentPaymentView } from '@/components/student/StudentPaymentView';

export default function Home() {
  const studentList = students;
  
  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-8">
      <StudentPaymentView students={studentList} />
    </div>
  );
}
