import { useEffect } from 'react';
import { useCandidateStore } from '@/store/candidateStore';

export const useBehaviorTracking = (examId: string, candidateId: string) => {
  const { logBehavior, currentAttempt } = useCandidateStore();

  useEffect(() => {
    if (!currentAttempt || currentAttempt.status !== 'in_progress') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logBehavior({
          examId,
          candidateId,
          eventType: 'tab_switch',
        });
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logBehavior({
          examId,
          candidateId,
          eventType: 'fullscreen_exit',
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [examId, candidateId, logBehavior, currentAttempt]);
};
