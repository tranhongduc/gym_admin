import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/GlobalProvider";
import { user_login } from "../../api/AuthApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn ,setUser, setAccessToken, setRefreshToken  } = useGlobalContext();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra thông tin đăng nhập, có thể là API hoặc kiểm tra cứng.
    // if (username === "admin" && password === "admin123") {
    //     setIsLoggedIn(true);
    //   localStorage.setItem("isLoggedIn", "true"); // Lưu trạng thái đăng nhập
    //   navigate("/app");  // Redirect đến trang chính sau khi đăng nhập thành công
    // } else {
    //   alert("Thông tin đăng nhập không chính xác.");
    // }

    try {
        const response = await axiosInstance.post("/api/auth/login", {
          email: username,
          password: password,
        });
        
        user_login({ email: username, password: password }).then((res) => {
          if (res && res.status === 200) {
            AsyncStorage.setItem("accessToken", res.data.accessToken);
            AsyncStorage.setItem("refreshToken", res.data.refreshToken);
  
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.data.accessToken}`;
            setUser(res.data.user);
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            console.log("done");
            navigate("/app");
            setIsLoggedIn(true);
          } else {
            alert("Thông tin đăng nhập không chính xác.");
            alert(res.data.message);
          }
        });
  
        // Handle successful login
        if (response.status === 200) {
          // Store token or user info, navigate to home screen
          console.log(response.data);
          navigate("/app");
        }
      } catch (error) {
        // Xử lý lỗi
        if (error.response) {
          alert("Lỗi: " + error.response.data.message);
        } else {
          alert("Có lỗi xảy ra: " + error.message);
        }
      }
  };




  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
      <div className="login-box" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ textAlign: 'center' }}>Đăng Nhập</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', border: 'none' }}>
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
