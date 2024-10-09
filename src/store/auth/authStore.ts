import { create } from 'zustand';
import { IUser } from '@/types/authType';
import { registerUserAPI } from '@/api/auth';

type AuthStoreState = {
  isLogin: boolean;
  user: IUser | null;
  registerStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  registerError: string | null;
};
type AuthStoreActions = {
  setIsLogin: (isLogin: boolean) => void;
  setUser: (user: IUser) => void;
  logout: () => void;
  registerUser: (payload: RegisterUserPayload) => void;
};

type AuthStore = AuthStoreState & AuthStoreActions;

interface RegisterUserPayload {
  email: string;
  password: string;
  name: string;
}

const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  user: null,
  registerStatus: 'idle',
  registerError: null,

  setIsLogin: (isLogin: boolean) => set({ isLogin }),

  setUser: (user: IUser) => set({ user, isLogin: true }),

  logout: () => set({ isLogin: false, user: null }),

  registerUser: async (payload: RegisterUserPayload) => {
    set({ registerStatus: 'loading', registerError: null });
    try {
      const user = await registerUserAPI(payload);
      set({ registerStatus: 'succeeded', user, isLogin: true });
    } catch (error: any) {
      set({
        registerStatus: 'failed',
        registerError: error.message || 'Registration failed',
      });
    }
  },
}));

export default useAuthStore;
