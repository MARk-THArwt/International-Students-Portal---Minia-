import { authClient } from "../../lib/auth-client";

export const Login = () => {
  const tryLogin = async () => {
    const { data, error } = await authClient.signIn.email({
      email: "ahmed@gmail.com",
      password: "password123",
    });
    console.log("Login response:", { data, error });
    alert();
  };

  return (
    <div className="grid grid-cols-2">
      <button onClick={() => tryLogin()}>submit</button>
    </div>
  );
};
