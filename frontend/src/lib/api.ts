import axios from 'axios';
import { Assignment, AssignmentFormData, GeneratedPaper, JobStatus } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Assignments
export async function createAssignment(
  data: AssignmentFormData,
  fileInfo?: { filename: string; originalName: string; mimeType: string; extractedText?: string }
): Promise<{ assignment: { id: string; title: string; status: string; jobId: string } }> {
  const payload = { ...data, uploadedFile: fileInfo };
  const res = await api.post('/api/assignments', payload);
  return res.data;
}

export async function fetchAssignments(): Promise<{ assignments: Assignment[]; pagination: { total: number } }> {
  const res = await api.get('/api/assignments');
  return res.data;
}

export async function fetchAssignment(id: string): Promise<{ assignment: Assignment }> {
  const res = await api.get(`/api/assignments/${id}`);
  return res.data;
}

export async function deleteAssignment(id: string): Promise<void> {
  await api.delete(`/api/assignments/${id}`);
}

// Assessments
export async function fetchAssessmentByAssignment(assignmentId: string): Promise<{ paper: GeneratedPaper }> {
  const res = await api.get(`/api/assessments/by-assignment/${assignmentId}`);
  return res.data;
}

export async function fetchAssessment(id: string): Promise<{ paper: GeneratedPaper }> {
  const res = await api.get(`/api/assessments/${id}`);
  return res.data;
}

export async function regenerateAssessment(assignmentId: string): Promise<{ jobId: string }> {
  const res = await api.post(`/api/assessments/regenerate/${assignmentId}`);
  return res.data;
}

export async function fetchJobStatus(jobId: string): Promise<{ status: JobStatus }> {
  const res = await api.get(`/api/assessments/job/${jobId}/status`);
  return res.data;
}

// File upload
export async function uploadFile(file: File): Promise<{
  file: { filename: string; originalName: string; mimeType: string; extractedText?: string; preview?: string };
}> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// PDF download
export async function downloadPDF(assignmentId: string): Promise<void> {
  const res = await api.get(`/api/pdf/assignment/${assignmentId}`, {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `assessment-${assignmentId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
