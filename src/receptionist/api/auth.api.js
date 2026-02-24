import API from "./Api";

export const loginUser = async ({ email, password }) => {
  const { data } = await API.post("/admin/login", {
    email,
    password,
  });

  return data;
};
