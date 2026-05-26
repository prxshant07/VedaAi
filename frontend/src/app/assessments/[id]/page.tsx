'use client';
import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAssessmentStore } from '@/store/assessmentStore';
import { fetchAssignment, fetchAssessmentByAssignment, fetchJobStatus, regenerateAssessment, downloadPDF } from '@/lib/api';
import { useGenerationSocket } from '@/hooks/useGenerationSocket';
import { DIFFICULTY_COLORS, QUESTION_TYPE_LABELS } from '@/lib/utils';
import { GeneratedPaper, Section, Question } from '@/types';

function GenerationProgress() {
  const { generation } = useAssessmentStore();

  const statusColors = {
    idle: 'bg-zinc-100',
    queued: 'bg-blue-50 border-blue-200',
    processing: 'bg-violet-50 border-violet-200',
    completed: 'bg-green-50 border-green-200',
    failed: 'bg-red-50 border-red-200',
  };

  if (generation.status === 'idle') return null;

  return (
    <div className={`rounded-xl border p-4 mb-5 ${statusColors[generation.status]}`}>
      <div className="flex items-center gap-2 mb-3">
        {generation.status === 'processing' && (
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
        )}
        {generation.status === 'completed' && <span className="text-green-600 font-medium text-sm">✓</span>}
        {generation.status === 'failed' && <span className="text-red-600 text-sm">✗</span>}
        <span className="text-sm font-medium text-zinc-700">
          {generation.status === 'queued' && 'Queued for generation...'}
          {generation.status === 'processing' && 'Generating assessment...'}
          {generation.status === 'completed' && 'Assessment generated!'}
          {generation.status === 'failed' && `Generation failed: ${generation.error}`}
        </span>
      </div>
      {(generation.status === 'processing' || generation.status === 'queued') && (
        <div>
          <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${generation.progress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">{generation.message}</p>
        </div>
      )}
    </div>
  );
}

function QuestionItem({ question, index }: { question: Question; index: number }) {
  return (
    <div className="py-4 border-b border-zinc-100 last:border-0 flex gap-3">
      <div className="text-xs text-zinc-400 font-mono pt-0.5 min-w-[20px]">Q{index + 1}.</div>
      <div className="flex-1">
        <p className="text-sm text-zinc-800 leading-relaxed mb-3">{question.question}</p>
        {question.options && (
          <ul className="space-y-1.5 mb-3">
            {question.options.map((opt, i) => (
              <li key={i} className="text-sm text-zinc-600">{opt}</li>
            ))}
          </ul>
        )}
        {(question.type === 'short' || question.type === 'long') && (
          <div className="space-y-2 mb-3">
            {Array.from({ length: question.type === 'long' ? 6 : 3 }).map((_, i) => (
              <div key={i} className="h-6 border-b border-zinc-200" />
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${DIFFICULTY_COLORS[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <span className="text-[11px] text-zinc-400 font-mono ml-auto">
            [{question.marks} mark{question.marks !== 1 ? 's' : ''}]
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionView({ section, sectionIndex }: { section: Section; sectionIndex: number }) {
  const sectionLetter = String.fromCharCode(65 + sectionIndex);
  return (
    <div className="mb-6">
      <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3 mb-4">
        <h3 className="text-sm font-semibold text-zinc-700">Section {sectionLetter}: {section.title}</h3>
        <p className="text-xs text-zinc-400 mt-0.5 italic">{section.instruction}</p>
      </div>
      {section.questions.map((q, qi) => (
        <QuestionItem key={q.id} question={q} index={qi} />
      ))}
    </div>
  );
}

function PaperView({ paper }: { paper: GeneratedPaper }) {
  return (
    <div id="printable-paper" className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6">
      {/* Header */}
      <div className="text-center pb-5 mb-5 border-b-2 border-zinc-900">
        <h2 className="text-xl font-serif font-semibold text-zinc-900 mb-1">{paper.title}</h2>
        <p className="text-xs text-zinc-500">
          Total Marks: {paper.totalMarks} &nbsp;·&nbsp; Questions: {paper.totalQuestions} &nbsp;·&nbsp;
          Time: {Math.max(30, paper.totalQuestions * 3)} minutes
        </p>
      </div>

      {/* Student fields */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {['Name', 'Student ID', 'Date', `Score: ___ / ${paper.totalMarks}`].map((f, i) => (
          <div key={i} className="border-b border-zinc-300 pb-1 pt-3 text-xs text-zinc-400">{f}</div>
        ))}
      </div>

      {/* Sections */}
      {paper.sections.map((section, si) => (
        <SectionView key={si} section={section} sectionIndex={si} />
      ))}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-zinc-100 text-center">
        <p className="text-[11px] text-zinc-300">
          Generated with Examify AI · {new Date(paper.generatedAt).toLocaleDateString()}
          {paper.metadata.model && ` · ${paper.metadata.model}`}
          {paper.metadata.generationTimeMs && ` · ${(paper.metadata.generationTimeMs / 1000).toFixed(1)}s`}
        </p>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  const params = useParams();
  const assignmentId = params.id as string;
  const {
    currentAssignment,
    currentPaper,
    paperLoading,
    generation,
    setCurrentAssignment,
    setCurrentPaper,
    setPaperLoading,
    setGenerationQueued,
    setGenerationStarted,
    setGenerationComplete,
    setGenerationFailed,
    resetGeneration,
  } = useAssessmentStore();

  useGenerationSocket(assignmentId);
  const fetchedAssignmentId = useRef<string | null>(null);

  useEffect(() => {
    if (!assignmentId || fetchedAssignmentId.current === assignmentId) return;
    fetchedAssignmentId.current = assignmentId;
    setCurrentAssignment(null);
    setCurrentPaper(null);
    resetGeneration();

    Promise.all([
      fetchAssignment(assignmentId)
        .then(r => {
          setCurrentAssignment(r.assignment);

          if (r.assignment.jobId) {
            if (r.assignment.status === 'queued') {
              setGenerationQueued(r.assignment.jobId);
            } else if (r.assignment.status === 'processing') {
              setGenerationStarted(r.assignment.jobId);
            } else if (r.assignment.status === 'failed') {
              setGenerationFailed(r.assignment.errorMessage || 'Generation failed');
            }
          }
        })
        .catch(() => {}),
      (() => {
        setPaperLoading(true);
        return fetchAssessmentByAssignment(assignmentId)
          .then(r => setCurrentPaper(r.paper))
          .catch(() => {})
          .finally(() => setPaperLoading(false));
      })(),
    ]);
  }, [
    assignmentId,
    setCurrentAssignment,
    setCurrentPaper,
    setPaperLoading,
    setGenerationQueued,
    setGenerationStarted,
    setGenerationFailed,
    resetGeneration,
  ]);

  useEffect(() => {
    if (!generation.jobId || !['queued', 'processing'].includes(generation.status)) {
      return;
    }

    const poll = async () => {
      try {
        const { status } = await fetchJobStatus(generation.jobId!);

        if (status.status === 'processing' && generation.status === 'queued') {
          setGenerationStarted(generation.jobId!);
        } else if (status.status === 'completed' && status.paperId) {
          setGenerationComplete(status.paperId);
        } else if (status.status === 'failed') {
          setGenerationFailed(status.error || 'Generation failed');
        }
      } catch {
        // Socket events or the assignment refresh can still update the UI.
      }
    };

    poll();
    const interval = window.setInterval(poll, 3000);
    return () => window.clearInterval(interval);
  }, [
    generation.jobId,
    generation.status,
    setGenerationStarted,
    setGenerationComplete,
    setGenerationFailed,
  ]);

  // When generation completes, fetch the new paper
  useEffect(() => {
    if (generation.status === 'completed' && generation.paperId) {
      setPaperLoading(true);
      fetchAssessmentByAssignment(assignmentId)
        .then(r => setCurrentPaper(r.paper))
        .catch(() => {})
        .finally(() => setPaperLoading(false));
    }
  }, [generation.status, generation.paperId, assignmentId, setCurrentPaper, setPaperLoading]);

  const handleRegenerate = async () => {
    try {
      const res = await regenerateAssessment(assignmentId);
      setGenerationQueued(res.jobId);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = async () => {
    try {
      await downloadPDF(assignmentId);
    } catch {
      // Fallback to browser print if backend PDF fails
      window.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            {currentAssignment?.title || 'Assessment'}
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {currentAssignment?.totalQuestions} questions · {currentAssignment?.totalMarks} marks
          </p>
        </div>
        {currentPaper && (
          <div className="flex items-center gap-2 no-print">
            <button onClick={handleRegenerate} className="px-3 py-1.5 border border-zinc-200 text-zinc-700 text-xs font-medium rounded-lg hover:bg-zinc-50 transition-colors">
              ↺ Regenerate
            </button>
            <button onClick={handlePrint} className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-700 transition-colors">
              ⬇ Download PDF
            </button>
          </div>
        )}
      </div>

      {/* Live generation progress */}
      <GenerationProgress />

      {/* Paper or loading/empty state */}
      {paperLoading ? (
        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-shimmer rounded-lg" style={{ height: i === 0 ? 48 : 80 }} />
          ))}
        </div>
      ) : currentPaper ? (
        <PaperView paper={currentPaper} />
      ) : generation.status === 'idle' || generation.status === 'failed' ? (
        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm py-16 text-center">
          <div className="text-3xl mb-3 opacity-20">◉</div>
          <p className="text-sm font-medium text-zinc-500 mb-1">No assessment yet</p>
          <p className="text-xs text-zinc-400 mb-4">Assessment will appear here once generated</p>
        </div>
      ) : null}
    </div>
  );
}
