import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./components/Signup";
import SignIn from "./components/SignIn";
import RequestResetPassword from "./components/RequestResetPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import Categorie from "./components/Categorie";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";
//import PrivateOrderRoute from "./components/PrivateOrderRoute";
import AdminDashboard from "./components/AdminDashboard";
import CreateAdmin from "./components/CreateAdmin";
import "./App.css";
import Header from "./components/Header";
import AddToBalance from "./components/AddToBalance";
import MyOrders from "./components/MyOrders";
import AdminHome from "./components/AdminHome";
import OrdersHistory from "./components/OrdersHistory";
import ActiveOrders from "./components/ActiveOrders";
import UsersList from "./components/UsersList";
import MyPayments from "./components/MyPayments";
import ActivePayments from "./components/ActivePayments";
import PaymentsHistory from "./components/PaymentsHistory";
import Profile from "./components/Profile";
import { AuthProvider } from "../AuthContext";
import CreateCategory from "./components/CreateCategory";
import Create from "./components/Create";
import CreateHome from "./components/CreateHome";
import CreateProduct from "./components/CreateProduct";
import ScrollToTop from "./components/ScrollToTop";
import PrivateProfile from "./components/PrivateProfile";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/request-reset-password"
            element={<RequestResetPassword />}
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-payments" element={<MyPayments />} />
          <Route
            path="/profile/:id"
            element={
              <PrivateProfile>
                <Profile />{" "}
              </PrivateProfile>
            }
          />
          {/* user Dashboard */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="" element={<Home />} />{" "}
            <Route path="category/:id" element={<Categorie />} />
          </Route>
          {/* to be protected from unothorizd users */}
          <Route path="/charge" element={<AddToBalance />} />{" "}
          {/* admin dashboard */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="orders" element={<OrdersHistory />} />
            <Route path="active-orders" element={<ActiveOrders />} />
            <Route path="payments-history" element={<PaymentsHistory />} />
            <Route path="active-payments" element={<ActivePayments />} />
            <Route path="users" element={<UsersList />} />
            <Route path="create-admin" element={<CreateAdmin />} />
            <Route path="create" element={<Create />}>
              <Route index element={<CreateHome />} />
              <Route path="category" element={<CreateCategory />} />
              <Route path="product" element={<CreateProduct />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
