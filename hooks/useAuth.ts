
import { useAuthContext } from '../context/AuthContext';

// Re-exporting from context to maintain hook interface compatibility
export const useAuth = () => {
  return useAuthContext();
};
