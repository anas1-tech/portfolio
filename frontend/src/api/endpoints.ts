import type { ContactPayload, Portfolio, SystemInfo } from "@/types/api";
import { http } from "./client";

type Body = object | FormData;

/** One typed function per backend endpoint. Components never build URLs themselves. */
export const api = {
  portfolio: () => http.get<Portfolio>("/portfolio/").then((r) => r.data),
  me: () => http.get<{ is_admin: boolean }>("/auth/me/").then((r) => r.data),
  login: (username: string, password: string) =>
    http.post<{ token: string }>("/auth/login/", { username, password }).then((r) => r.data),
  logout: () => http.post("/auth/logout/"),
  system: () => http.get<SystemInfo>("/system/").then((r) => r.data),
  contact: (body: ContactPayload) => http.post("/contact/", body),

  create: (endpoint: string, body: Body) => http.post(`/${endpoint}/`, body).then((r) => r.data),
  update: (endpoint: string, id: number, body: Body) => http.patch(`/${endpoint}/${id}/`, body).then((r) => r.data),
  updateSettings: (body: Body) => http.patch("/settings/", body).then((r) => r.data),
  remove: (endpoint: string, id: number) => http.delete(`/${endpoint}/${id}/`),
};
