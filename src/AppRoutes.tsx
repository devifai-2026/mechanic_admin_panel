import { BrowserRouter as  Routes, Route, useLocation, useNavigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import { Projects } from "./pages/Projects/Projects";
import { Employees } from "./pages/Employees/Employees";
import { Partners } from "./pages/Partners/Partners";
import { Equipments } from "./pages/Equipments/Equipments";
import { Revenue } from "./pages/Revenue/Revenue";
import { StoreLocation } from "./pages/StoreLocation/StoreLocation";
import { Consumable } from "./pages/Consumables/Consumable";
import { Shifts } from "./pages/Shifts/Shifts";
import { Roles } from "./pages/Roles/Roles";
import { useEffect, useState } from "react";
import Loader from "./components/Loader/Loader";

export default function AppRoutes() {

   const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { pathname } = useLocation();

// console.log(App)
// console.log(App)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);



  useEffect(() => {
    // Check if a user is stored in localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      // If no user is found, navigate to the sign-in page
      navigate('/signin');
    } else {
      // If a user exists, set isAuthenticated to true
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

 return isAuthenticated ? (
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/equipments" element={<Equipments />} />
            <Route path="/revenues" element={<Revenue />} />
            <Route path="/store-locations" element={<StoreLocation />} />
            <Route path="/consumables" element={<Consumable />} />
            <Route path="/shifts" element={<Shifts />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>
          </Routes>
      ) : (
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )
}