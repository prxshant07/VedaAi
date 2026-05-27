'use client'

import { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, Download, Share2 } from 'lucide-react'
import { useAssessmentStore } from '@/store/assessmentStore'
import { fetchAssignment, fetchAssessmentByAssignment, fetchJobStatus, regenerateAssessment, downloadPDF } from '@/lib/api'
import { useGenerationSocket } from '@/hooks/useGenerationSocket'
import { DIFFICULTY_COLORS, QUESTION_TYPE_LABELS } from '@/lib/utils'
import { GeneratedPaper, Section, Question } from '@/types'
import { GenerationStatus } from '@/components/assessment/GenerationStatus'

function QuestionItem({ question, index }: { question: Question; index: number }) {
  return (
    <div className="py-4 border-b border-[#F0EFE8] last:border-0 flex gap-3">
      <div className="text-[12px] text-[hsl(215,16%,55%)] font-mono pt-0.5 min-w-[24px] flex-shrink-0">Q{index + 1}.</div>
      <div className="flex-1">
        <p className="text-[13.5px] text-[hsl(222,47%,11%)] leading-relaxed mb-3">{question.question}</p>
        {question.options && (
          <ul className="space-y-1.5 mb-3">
            {question.options.map((opt, i) => (
              <li key={i} className="text-[13px] text-[hsl(215,16%,40%)] flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full border border-[#E5E5E2] flex items-center justify-center text-[10px] font-semibold text-[hsl(215,16%,55%)] mt-0.5">
                  {String.fromCharCode(65+i)}
                </span>
                {opt}
              </li>
            ))}
          </ul>
        )}
        {(question.type === 'short' || question.type === 'long') && (
          <div className="space-y-2 mb-3">
            {Array.from({ length: question.type === 'long' ? 6 : 3 }).map((_, i) => (
              <div key={i} className="h-6 border-b border-[#E5E5E2]" />
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[11px] px-2 py-0.5 rounded-lg border font-semibold ${DIFFICULTY_COLORS[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <span className="text-[11.5px] text-[hsl(215,16%,55%)] font-mono ml-auto">
            [{question.marks} mark{question.marks !== 1 ? 's' : ''}]
          </span>
        </div>
      </div>
    </div>
  )
}

function SectionView({ section, sectionIndex }: { section: Section; sectionIndex: number }) {
  const sectionLetter = String.fromCharCode(65 + sectionIndex)
  return (
    <div className="mb-6">
      <div className="bg-[hsl(222,47%,11%)] text-white rounded-lg px-4 py-2.5 mb-4">
        <h3 className="text-[13px] font-semibold tracking-[0.03em]">Section {sectionLetter}: {section.title}</h3>
        {section.instruction && <p className="text-[11.5px] text-white/70 mt-0.5 italic">{section.instruction}</p>}
      </div>
      {section.questions.map((q, qi) => (
        <QuestionItem key={q.id} question={q} index={qi} />
      ))}
    </div>
  )
}

function PaperView({ paper }: { paper: GeneratedPaper }) {
  return (
    <div id="printable-paper" className="bg-white rounded-[14px] border border-[#E5E5E2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-8 md:p-12">

      {/* School header */}
      <div className="flex items-center gap-4 pb-5 mb-5 border-b-2 border-[hsl(222,47%,11%)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[hsl(222,47%,11%)] text-[hsl(45,100%,54%)] text-[16px] font-bold flex-shrink-0">
          DP
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-[hsl(222,47%,11%)]">Delhi Public School, Sector-4, Bokaro</h2>
          <p className="text-[12.5px] text-[hsl(215,16%,47%)] mt-0.5">{paper.title}</p>
        </div>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-[12.5px] text-[hsl(215,16%,47%)]">
        <span><strong className="text-[hsl(222,47%,11%)]">Time:</strong> {Math.max(30, paper.totalQuestions * 3)} minutes</span>
        <span className="text-center"><strong className="text-[hsl(222,47%,11%)]">Total Marks:</strong> {paper.totalMarks}</span>
        <span className="text-right"><strong className="text-[hsl(222,47%,11%)]">Questions:</strong> {paper.totalQuestions}</span>
      </div>

      <div className="rounded-xl border border-[#E5E5E2] bg-[hsl(48,20%,98%)] px-4 py-2.5 mb-5 text-[12px] text-[hsl(215,16%,47%)] italic">
        All questions are compulsory unless stated otherwise.
      </div>

      {/* Student fields */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {['Name', 'Roll Number', `Class / Section`, `Score: ___ / ${paper.totalMarks}`].map((f) => (
          <div key={f} className="border-b border-[#D0D0CB] pb-1.5 pt-3 text-[12px] text-[hsl(215,16%,55%)]">{f}: _______________</div>
        ))}
      </div>

      {/* Sections */}
      {paper.sections.map((section, si) => (
        <SectionView key={si} section={section} sectionIndex={si} />
      ))}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[#F0EFE8] text-center">
        <p className="text-[11px] text-[hsl(215,16%,70%)]">
          Generated with VedaAI · {new Date(paper.generatedAt).toLocaleDateString()}
          {paper.metadata?.model && ` · ${paper.metadata.model}`}
        </p>
      </div>
    </div>
  )
}

export default function AssessmentPage() {
  const params = useParams()
  const assignmentId = params.id as string
  const {
    currentAssignment, currentPaper, paperLoading, generation,
    setCurrentAssignment, setCurrentPaper, setPaperLoading,
    setGenerationQueued, setGenerationStarted, setGenerationComplete, setGenerationFailed, resetGeneration,
  } = useAssessmentStore()

  useGenerationSocket(assignmentId)
  const fetchedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!assignmentId || fetchedRef.current === assignmentId) return
    fetchedRef.current = assignmentId
    setCurrentAssignment(null); setCurrentPaper(null); resetGeneration()

    Promise.all([
      fetchAssignment(assignmentId).then((r) => {
        setCurrentAssignment(r.assignment)
        if (r.assignment.jobId) {
          if (r.assignment.status === 'queued') setGenerationQueued(r.assignment.jobId)
          else if (r.assignment.status === 'processing') setGenerationStarted(r.assignment.jobId)
          else if (r.assignment.status === 'failed') setGenerationFailed(r.assignment.errorMessage || 'Generation failed')
        }
      }).catch(() => {}),
      (() => {
        setPaperLoading(true)
        return fetchAssessmentByAssignment(assignmentId).then((r) => setCurrentPaper(r.paper)).catch(() => {}).finally(() => setPaperLoading(false))
      })(),
    ])
  }, [assignmentId, setCurrentAssignment, setCurrentPaper, setPaperLoading, setGenerationQueued, setGenerationStarted, setGenerationFailed, resetGeneration])

  useEffect(() => {
    if (!generation.jobId || !['queued','processing'].includes(generation.status)) return
    const poll = async () => {
      try {
        const { status } = await fetchJobStatus(generation.jobId!)
        if (status.status === 'processing' && generation.status === 'queued') setGenerationStarted(generation.jobId!)
        else if (status.status === 'completed' && status.paperId) setGenerationComplete(status.paperId)
        else if (status.status === 'failed') setGenerationFailed(status.error || 'Generation failed')
      } catch {}
    }
    poll()
    const interval = window.setInterval(poll, 3000)
    return () => window.clearInterval(interval)
  }, [generation.jobId, generation.status, setGenerationStarted, setGenerationComplete, setGenerationFailed])

  useEffect(() => {
    if (generation.status === 'completed' && generation.paperId) {
      setPaperLoading(true)
      fetchAssessmentByAssignment(assignmentId).then((r) => setCurrentPaper(r.paper)).catch(() => {}).finally(() => setPaperLoading(false))
    }
  }, [generation.status, generation.paperId, assignmentId, setCurrentPaper, setPaperLoading])

  const handleRegenerate = async () => {
    try { const res = await regenerateAssessment(assignmentId); setGenerationQueued(res.jobId) }
    catch (err) { console.error(err) }
  }

  const handleDownload = async () => {
    try { await downloadPDF(assignmentId) }
    catch { window.print() }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/assignments" className="flex items-center gap-1.5 text-[13px] font-medium text-[hsl(215,16%,47%)] border border-[#E5E5E2] bg-white rounded-xl px-3 py-2 hover:bg-[hsl(48,20%,96%)] transition-colors flex-shrink-0">
            <ArrowLeft size={14} /> Assignments
          </Link>
          <span className="text-[hsl(215,16%,60%)]">/</span>
          <h1 className="text-[15px] font-semibold text-[hsl(222,47%,11%)] truncate">
            {currentAssignment?.title || 'Assessment'}
          </h1>
          {currentPaper && (
            <span className="flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[hsl(45,100%,54%)] text-[hsl(222,47%,11%)]">Generated</span>
          )}
        </div>

        {currentPaper && (
          <div className="flex items-center gap-2 flex-shrink-0 no-print">
            <button onClick={handleRegenerate} className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-medium text-[hsl(215,16%,40%)] border border-[#E5E5E2] rounded-xl hover:bg-[hsl(48,20%,96%)] transition-colors">
              <RotateCcw size={13} /> Regenerate
            </button>
            <button onClick={handleDownload} className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-semibold text-white bg-[hsl(222,47%,11%)] rounded-xl hover:opacity-90 transition-opacity">
              <Download size={13} /> Download PDF
            </button>
          </div>
        )}
      </div>

      {/* Generation status */}
      <GenerationStatus status={generation.status} progress={generation.progress} message={generation.message} error={generation.error} />

      {/* Paper or states */}
      {paperLoading ? (
        <div className="bg-white rounded-[14px] border border-[#E5E5E2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-shimmer rounded-xl" style={{ height: i === 0 ? 48 : 80 }} />
          ))}
        </div>
      ) : currentPaper ? (
        <PaperView paper={currentPaper} />
      ) : generation.status === 'idle' || generation.status === 'failed' ? (
        <div className="bg-white rounded-[14px] border border-[#E5E5E2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[18px] bg-[hsl(48,20%,96%)] border border-[#E5E5E2]">
            <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
              <circle cx="16" cy="16" r="10" fill="#FEF0ED" stroke="#F09575" strokeWidth="1.2"/>
              <line x1="12" y1="12" x2="20" y2="20" stroke="#E8441A" strokeWidth="2" strokeLinecap="round"/>
              <line x1="20" y1="12" x2="12" y2="20" stroke="#E8441A" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-[14px] font-semibold text-[hsl(215,16%,40%)] mb-1">No assessment yet</p>
          <p className="text-[12.5px] text-[hsl(215,16%,55%)] mb-4">Assessment will appear here once generated</p>
          <button onClick={handleRegenerate} className="inline-flex items-center gap-2 rounded-xl bg-[hsl(222,47%,11%)] px-5 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 transition-opacity">
            Generate Now
          </button>
        </div>
      ) : null}
    </div>
  )
}
