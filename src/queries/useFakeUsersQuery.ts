import { useQuery } from '@tanstack/react-query';
import { fetchFakeUsers } from '../api/fakeUsers';

export function useFakeUsersQuery(options?: { quantity?: number; seed?: number }) {
  const quantity = options?.quantity ?? 20;
  const seed = options?.seed ?? 123;

  return useQuery({
    queryKey: ['fakeUsers', { quantity, seed }],
    queryFn: () => fetchFakeUsers({ quantity, seed }),
  });
}

