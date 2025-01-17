import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import User from "./scenes/user";
import CreateUser from "./scenes/user/create";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import { getlistExercise } from "./api/ExerciseApi";
import ViewUser from "./scenes/user/view";
import Food from "./scenes/food";
import ViewFood from "./scenes/food/view";
import Execrise from "./scenes/execrise";
import ViewExecrise from "./scenes/execrise/view";
import ChatScreen from "./scenes/chat";
import CreateMap from "./scenes/map/CreateMap";
import ListMap from "./scenes/map/ListMap";
import ViewMap from "./scenes/map/ViewMap";
import { useGlobalContext } from "./context/GlobalProvider";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const {user} = useGlobalContext();
  console.log(user);

  const [recom, setRecom] = useState([]);

  const getRecomData = async () => {
    const a = await getlistExercise();
    setRecom(a);
  };

  useEffect(() => {
    getRecomData();
  }, []);


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* {User} */}
              <Route path="/user" element={<User />} />
              <Route path="/createUser" element={<CreateUser />} />
              <Route path="/viewUser" element={<ViewUser />} />

              <Route path="/food" element={<Food />} />
              <Route path="/viewFood" element={<ViewFood />} />

              <Route path="/execrise" element={<Execrise />} />
              <Route path="/viewExecrise" element={<ViewExecrise />} />

              <Route path="/map" element={<ListMap />} />
              <Route path="/createMap" element={<CreateMap />} />
              <Route path="/viewMap" element={<ViewMap />} />

              <Route path="/chat" element={<ChatScreen />} />

              {/* <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
