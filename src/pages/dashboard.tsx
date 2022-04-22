import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { WithSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const userCanSeeMetrics = useCan({
    roles: ["administrator", "editor"],
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{user?.email}</p>

      {userCanSeeMetrics && <div>Métricas</div>}
    </div>
  );
}
export const getServerSideProps = WithSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("me");

  console.log(response);

  return {
    props: {},
  };
});
