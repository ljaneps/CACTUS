import LoginComponent from "../components/LoginComponent";

function LoginPage({ onLogin }) {
  return (
    <div>
      <LoginComponent onLogin={onLogin} />
    </div>
  );
}

export default LoginPage;

