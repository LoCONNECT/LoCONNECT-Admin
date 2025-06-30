import api from "@/utill/api";
import { create } from "zustand";

type User = {
  id: string;
  name: string;
  role: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  loadUserProfile: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  loadUserProfile: async () => {
    try {
      const res = await api.get<User>("/users/profile");

      console.log("로그인됨", res.data);
      set({ user: res.data });
    } catch (e: any) {
      // 401에러(로그인 안 된 상태)
      if (e?.response?.status === 401) {
        set({ user: null });
      } else {
        console.error(e);
      }
    }
  },
}));
