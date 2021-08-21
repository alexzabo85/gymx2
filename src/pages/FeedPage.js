import React from "react";
import DashboardSection from "../components/DashboardSection";
import { requireAuth } from "../util/myAuth.js";

function FeedPage(props) {
  return (
    <DashboardSection
      bgColor="default"
      size="medium"
      bgImage=""
      bgImageOpacity={1}
      title="Fitness Tips"
      subtitle=""
    />
  );
}

// export default requireAuth(DashboardPage);
export default FeedPage;
