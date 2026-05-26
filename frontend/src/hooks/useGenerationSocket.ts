'use client';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAssessmentStore } from '@/store/assessmentStore';
import {
  GenerationStartedPayload,
  GenerationProgressPayload,
  GenerationCompletePayload,
  GenerationFailedPayload,
} from '@/types';

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function useGenerationSocket(assignmentId: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const {
    setGenerationStarted,
    setGenerationProgress,
    setGenerationComplete,
    setGenerationFailed,
  } = useAssessmentStore();

  useEffect(() => {
    if (!assignmentId) return;

    const sock = getSocket();
    socketRef.current = sock;

    sock.emit('join-assignment', assignmentId);

    sock.on('generation-started', (data: GenerationStartedPayload) => {
      console.log('🚀 Generation started:', data);
      setGenerationStarted(data.jobId);
    });

    sock.on('generation-progress', (data: GenerationProgressPayload) => {
      console.log('📊 Progress:', data.progress, data.message);
      setGenerationProgress(data.progress, data.message);
    });

    sock.on('generation-complete', (data: GenerationCompletePayload) => {
      console.log('✅ Generation complete:', data);
      setGenerationComplete(data.paperId);
    });

    sock.on('generation-failed', (data: GenerationFailedPayload) => {
      console.error('❌ Generation failed:', data.error);
      setGenerationFailed(data.error);
    });

    return () => {
      sock.emit('leave-assignment', assignmentId);
      sock.off('generation-started');
      sock.off('generation-progress');
      sock.off('generation-complete');
      sock.off('generation-failed');
    };
  }, [assignmentId, setGenerationStarted, setGenerationProgress, setGenerationComplete, setGenerationFailed]);

  return socketRef.current;
}
