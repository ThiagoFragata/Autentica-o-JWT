import { setupAPIClient } from "../services/api";
import { WithSSRAuth } from "../utils/withSSRAuth";

import decode from "jwt-decode";

export default function Metrics() {
  return (
    <div>
      <h1>Metrics</h1>
    </div>
  );
}
export const getServerSideProps = WithSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("me");

    // console.log(response);

    return {
      props: {},
    };
  },
  {
    permissions: ["metrics.list"],
    // roles: ["administrator"],
  }
);
