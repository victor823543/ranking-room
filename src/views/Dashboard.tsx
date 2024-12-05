import LoadingPage from "../components/common/Loading/LoadingPage/LoadingPage";
import DashboardHeader from "../components/dashboard/DashboardHeader/DashboardHeader";
import DashboardNav from "../components/dashboard/DashboardNav/DashboardNav";
import GridLayout from "../components/layout/GridLayout/GridLayout";
import Layout from "../components/layout/Layout/Layout";
import { useAuth } from "../provider/authProvider";

const Dashboard = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return <LoadingPage name="Dashboard" />;
  }

  if (user === null) {
    return (
      <Layout name="Dashboard">
        <div></div>
      </Layout>
    );
  }
  return (
    <Layout name="Dashboard">
      <GridLayout
        topLeftShortWide={<DashboardHeader user={user} />}
        bottomLeftBaseWide={<DashboardNav />}
      />
    </Layout>
  );
};

export default Dashboard;
