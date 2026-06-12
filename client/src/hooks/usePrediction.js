import { useMutation } from '@tanstack/react-query';
import { publicApi } from '@/services/publicApi';

export function useSubmitPrediction() {
  return useMutation({
    mutationFn: (data) => publicApi.submitPrediction(data),
  });
}

export function useTrackPrediction() {
  return useMutation({
    mutationFn: (data) => publicApi.trackPrediction(data),
  });
}

export default useSubmitPrediction;
