import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/services/publicApi';

export function useActiveTournament() {
  return useQuery({
    queryKey: ['tournament', 'active'],
    queryFn: async () => {
      const { data } = await publicApi.getActiveTournament();
      return data.data;
    },
  });
}

export function useMatches(filter, date) {
  const params = {};
  if (filter && filter !== 'all') params.filter = filter;
  if (date) params.date = date;

  return useQuery({
    queryKey: ['matches', filter, date],
    queryFn: async () => {
      const { data } = await publicApi.getMatches(params);
      return data;
    },
    enabled: filter !== null,
  });
}

export default useMatches;
