import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '@/services/adminApi';

export function useAdminAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: admin, isLoading, isError } = useQuery({
    queryKey: ['admin', 'me'],
    queryFn: async () => {
      const { data } = await adminApi.me();
      return data.data;
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials) => adminApi.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'me'] });
      navigate('/admin');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => adminApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(['admin', 'me'], null);
      navigate('/admin/login');
    },
  });

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin && !isError,
    isSuperAdmin: admin?.role === 'SUPER_ADMIN',
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}

export default useAdminAuth;
