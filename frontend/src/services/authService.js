import api from "@/lib/axios";

export const authService = {
  signUp: async (username, password, email, firstName, lastName) => {
    const res = await api.post("/auth/signup", {
      username,
      password,
      email,
      firstName,
      lastName,
    });
    return res.data;
  },

  signIn: async (username, password) => {
    const res = await api.post("/auth/signin", { username, password });
    return res.data;
  },

  signOut: async () => {
    // body = {}, withCredentials trong config để cookie refreshToken được gửi đi
    return api.post("/auth/signout", {}, { withCredentials: true });
  },

  fetchMe: async () => {
    const res = await api.get("/users/me");
    return res.data.user;
  },

  // FIX: trước đây { withCredentials: true } bị truyền vào BODY thay vì CONFIG
  // api.post(url, body, config) — phải là tham số thứ 3
  refresh: async () => {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true });
    return res.data.accessToken;
  },
};