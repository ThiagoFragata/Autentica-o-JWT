import { useContext } from "react";
import { Can } from "../components/can";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPIClient } from "../services/api";
import { WithSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{user?.email}</p>

      <button onClick={signOut}>SignOut</button>

      <Can permissions={["metrics.list"]} roles={["administrator", "editor"]}>
        <div>Métricas</div>
      </Can>
    </div>
  );
}
export const getServerSideProps = WithSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("me");

  return {
    props: {},
  };
});
