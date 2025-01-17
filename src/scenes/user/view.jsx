import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker } from "antd";
import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { getUserById, updateUser } from "../../api/UserApi";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

const ViewUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const location = useLocation();
  const id = location.state; // Lấy dữ liệu đã truyền từ trang trước

  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState();

  const onFinish = async (values) => {
    console.log("Success:", values);

    // Cập nhật dữ liệu người dùng với thông tin mới từ form
    const updatedUser = { ...userData, ...values };
    setUserData(updatedUser); // Cập nhật lại dữ liệu
    console.log("Updated User:", updatedUser);
    // Tạo formData để gửi yêu cầu
    const formData = new FormData();
    formData.append("full_name", updatedUser.name);

    // Bạn có thể gửi formData đến API ở đây nếu cần

    try {
      // Gọi hàm updateUser và gửi formData
      const response = await updateUser(updatedUser); // Hoặc có thể sử dụng formData ở đây tùy theo yêu cầu
      console.log("API Response:", response);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const getListData = async () => {
    try {
      const a = await getUserById(id);
      setUserData(a); // Lưu dữ liệu người dùng
      form.setFieldsValue(a); // Đồng bộ giá trị form với dữ liệu người dùng
    } catch (error) {
      console.error("Error fetching user data", error.message);
    }
  };

  useEffect(() => {
    getListData();
  }, []);

  //   const handleSaveClick = () => {
  //     console.log("Save Clicked");
  //     const updatedUser = form.getFieldsValue(); // Lấy dữ liệu từ form
  //     setUserData(updatedUser); // Cập nhật lại userData với thông tin mới

  //     // Chuyển về chế độ xem
  //     setIsEditMode(false);

  //     console.log("Saved Data:", updatedUser);
  //   };

  const handleEditSaveClick = () => {
    if (!isEditMode) {
      console.log("ed Clicked");
      //   form.setFieldsValue({
      //     avatar: userData?.avatar,
      //     name: userData?.name,
      //     email: userData?.email,
      //     phoneNumber: userData?.phoneNumber,
      //     dob: userData?.dob,
      //   });
      setIsEditMode(!isEditMode); // Chuyển sang chế độ chỉnh sửa
    } else {
      console.log("Save Clicked");
      setIsEditMode(!isEditMode); // Chuyển sang chế độ chỉnh sửa
    }
  };

  return (
    <Box m="20px">
      <Header
        title="User Information"
        subtitle="Managing the User Information"
      />

      <Form
        form={form}
        layout="horizontal"
        labelAlign="right"
        labelWrap="true"
        size="large"
        autoComplete="off"
        initialValues={userData}
        onFinish={onFinish}
        style={{ width: "100%" }}
      >
        <Form.Item
          labelCol={{ span: 4 }}
          label={
            <Typography color={colors.grey[100]} fontWeight="bold" width="100%">
              AVTAR
            </Typography>
          }
        >
          <img
            src={userData?.avatar}
            alt="Avatar"
            style={{ width: "100px", height: "100px" }}
          />
        </Form.Item>

        {/* name */}
        <Form.Item
          name="name"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              FULL NAME
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: `name is required!` }]}
        >
          {isEditMode ? (
            <Input style={{ width: "50%" }} placeholder={`Enter name`} />
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {userData?.name}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="email"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Email
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: `Email is required!` }]}
        >
          {isEditMode ? (
            <Input style={{ width: "50%" }} placeholder={`Enter Email`} />
          ) : (
            <Typography
              color={colors.grey[100]}
              style={{ width: "100%" }}
              fontWeight="bold"
            >
              {userData?.email}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Phone Number
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: `phone number is required!` }]}
        >
          {isEditMode ? (
            <Input style={{ width: "50%" }} placeholder={`Enter number`} />
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {userData?.phoneNumber}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="sex"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Gender:
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: "Gender is required!" }]}
        >
          {isEditMode ? (
            <Select
              style={{ width: "50%" }}
              defaultValue={userData?.sex} // Default to 'male' if userData doesn't have sex
              placeholder="Select gender"
              onChange={(value) => form.setFieldsValue({ sex: value })} // Update form value on selection
            >
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
            </Select>
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {userData?.sex === "male" && "Male"}
              {userData?.sex === "female" && "Female"}
              {!userData?.sex && "Not Available"}
            </Typography>
          )}
        </Form.Item>
        <Form.Item
          name="height"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Height
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: "Height is required!" }]}
        >
          {isEditMode ? (
            <Input
              placeholder="Enter height"
              style={{ width: "50%" }}
              defaultValue={userData?.height || ""} // Đồng bộ giá trị nếu có
            />
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {userData?.height || "Not Available"}{" "}
              {/* Hiển thị nếu không có giá trị */}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="weight"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Weight
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: "Weight is required!" }]}
        >
          {isEditMode ? (
            <Input
              style={{ width: "50%" }}
              placeholder="Enter weight"
              defaultValue={userData?.weight || ""} // Đồng bộ giá trị nếu có
            />
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {userData?.weight || "Not Available"}{" "}
              {/* Hiển thị nếu không có giá trị */}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="goal"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Goal
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: "Goal is required!" }]}
        >
          {isEditMode ? (
            <Select
              style={{ width: "50%" }}
              defaultValue={userData?.goal || "muscle_gain"} // Chọn mặc định nếu có
              placeholder="Select goal"
              onChange={(value) => form.setFieldsValue({ goal: value })} // Cập nhật giá trị khi chọn
            >
              <Select.Option value="muscle_gain">Muscle Gain</Select.Option>
              <Select.Option value="weight_loss">Weight Loss</Select.Option>
              <Select.Option value="maintenance">Maintenance</Select.Option>
            </Select>
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {userData?.goal === "muscle_gain" && "Muscle Gain"}
              {userData?.goal === "weight_loss" && "Weight Loss"}
              {userData?.goal === "maintenance" && "Maintenance"}
              {!userData?.goal && "Not Available"}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="activityLevel"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Activity Level
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: "Activity level is required!" }]}
        >
          {isEditMode ? (
            <Select
              style={{ width: "50%" }}
              defaultValue={userData?.activityLevel || "low"} // Mặc định là 'low' nếu không có giá trị
              placeholder="Select activity level"
              onChange={(value) =>
                form.setFieldsValue({ activityLevel: value })
              } // Cập nhật giá trị khi chọn
            >
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="moderate">Moderate</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
          ) : (
            <Typography
              style={{ width: "50%" }}
              color={colors.grey[100]}
              fontWeight="bold"
            >
              {userData?.activityLevel === "low" && "Low"}
              {userData?.activityLevel === "moderate" && "Moderate"}
              {userData?.activityLevel === "high" && "High"}
              {!userData?.activityLevel && "Not Available"}
            </Typography>
          )}
        </Form.Item>

        <Form.Item>
          <Box display="flex" justifyContent="flex-end" mt="20px">
            {isEditMode ? (
              <Button
                type="default"
                style={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                }}
                onClick={handleEditSaveClick}
              >
                Save
              </Button>
            ) : (
              <Button
                htmlType="submit"
                type="submit"
                style={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                }}
                onClick={handleEditSaveClick}
              >
                Edit
              </Button>
            )}
          </Box>
        </Form.Item>
      </Form>
    </Box>
  );
};

export default ViewUser;

// {/*
//     <Form.Item
//       name="dob"
//       label={
//         <Typography
//           color={colors.grey[100]}
//           fontWeight="bold"
//           sx={{ m: "0 0 5px 0" }}
//         >
//           Date of Birth:
//         </Typography>
//       }
//       rules={[{ required: true, message: "Date of birth is required!" }]}
//     >
//       {isEditMode ? (
//         <DatePicker
//           value={userData?.dob ? dayjs(userData?.dob, "DD/MM/YYYY") : null}
//           format="DD/MM/YYYY" // Hiển thị định dạng ngày
//           onChange={(date, dateString) =>
//             form.setFieldsValue({ dob: dateString })
//           } // Cập nhật giá trị khi người dùng thay đổi
//         />
//       ) : (
//         <Typography
//           color={colors.grey[100]}
//           fontWeight="bold"
//           sx={{ m: "0 0 5px 0" }}
//         >
//           {userData?.dob}{" "}
//         </Typography>
//       )}
//     </Form.Item> */}
