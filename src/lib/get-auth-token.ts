import { authClient } from "./auth-client";

export async function getAuthToken() {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Unable to get authentication token.");
  }

  return data.token;
}