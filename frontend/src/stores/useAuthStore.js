import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (username, password, email, firstName, lastName) => {
    try {
      set({ loading: true });

      // Call API
      await authService.signUp(username, password, email, firstName, lastName);

      toast.success("Registration successful! You will be redirected to the login page.");
    } catch (error) {
      console.error(error);
      toast.error("Registration failed");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIn(username, password);
      get().setAccessToken(accessToken);

      await get().fetchMe(); // Call API to fetch user info and save to state

      toast.success("Welcome back to Helpdesk Library 🎉");
      
      // STEP 1: RETURN USER AFTER SUCCESSFUL FETCH
      return get().user; 
      
    } catch (error) {
      console.error(error);
      toast.error("Login failed!");
      
      // STEP 2: THROW ERROR SO THE FORM DOES NOT PROCEED WITH REDIRECTION
      throw error; 
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });

      // 1. Call authService to send request to Backend
      // Backend will handle deleting the Session in DB and clearing the Browser Cookie
      await authService.signOut(); 

      // 2. Clear current Zustand state on Client side
      set({ 
        accessToken: null, 
        user: null, 
        loading: false 
      });

    } catch (error) {
      console.error("Logout error:", error);
      // Still clear client state even if API fails so user isn't stuck
      set({ accessToken: null, user: null, loading: false }); 
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null });
      toast.error("Error occurred while fetching user data. Please try again!");
    } finally {
      set({ loading: false });
    }
  },

  refresh: async (isSilent = false) => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refresh();

      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      if (!isSilent) {
        console.error(error);
        toast.error("Session expired. Please log in again!");
      }
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));