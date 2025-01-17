import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, Upload, message } from "antd";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { UploadOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import { user_register } from "../../api/AuthApi";
import { UploadUser } from "../../api/MediaApi";

const CreateUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [avatar, setAvatar] = useState(null); // Trạng thái lưu ảnh đã chọn
  const [form] = Form.useForm();
  const [userData, setUserData] = useState();
  const [file, setFile] = useState();

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  // const onFinish = async (values) => {
  //   // Cập nhật dữ liệu người dùng với thông tin mới từ form
  //   const updatedUser = { ...userData, ...values };
  //   setUserData(updatedUser); // Cập nhật lại dữ liệu

  //   const formData = new FormData();
  //   if (file) {
  //     formData.append("avatar", file);
  //   }
  //   console.log(formData.get("avatar"));

  //   console.log("?>>>>>>", file);
  //   try {
  //     // const registerResponse = await user_register(userData); // Gọi API đăng ký tài khoản
  //     // console.log("User Registration Response:", registerResponse);

  //     const uploadResponse = await UploadUser(formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     console.log("Upload response", uploadResponse);
  //   } catch (error) {
  //     console.error("Error during upload or registration:", error);
  //   }
  // };

  const onFinish = async (values) => {
    try {
      // Chuyển blob URL thành Blob
      const response = await fetch(avatar);
      const blob = await response.blob();

      // Tạo đối tượng File từ Blob (nếu cần, bạn có thể tùy chỉnh tên file và kiểu MIME)
      const file = new File([blob], "uploaded-image.jpg", {
        type: "image/jpeg",
      });

      // Tạo FormData và thêm file vào
      const formData = new FormData();
      formData.append("media", file);
      console.log("formData", formData.get("media"));

      // Gửi tệp lên server
      const res = await UploadUser(formData); // Sử dụng await để đợi kết quả trả về
      console.log(res); // Kiểm tra kết quả trả về từ server
    } catch (error) {
      console.error("Error during upload:", error);
      message.error("Failed to create user");
    }
  };
  const handleCreateClick = () => {
    console.log("Create Clicked");
  };

  // Kiểm tra trước khi upload (ví dụ: kiểm tra định dạng và kích thước ảnh)
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2; // Kiểm tra kích thước ảnh < 2MB
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return false; // Nếu không phải JPG hoặc PNG, không cho phép upload
    }
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return false; // Nếu kích thước lớn hơn 2MB, không cho phép upload
    }

    return true; // Nếu đúng định dạng và kích thước, cho phép upload
  };

  // Xử lý sự kiện khi ảnh upload thành công
  const handleUploadChange = ({ file }) => {
    console.log("aaafile", file);
    setFile(file);
    if (file.originFileObj) {
      const imageUrl = URL.createObjectURL(file.originFileObj);
      setAvatar(imageUrl); // Cập nhật state để hiển thị ảnh
      message.success("Avatar uploaded successfully");
    } else {
      message.error("File not valid");
    }
  };

  useEffect(() => {}, []);

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
          name="avatar"
          label={
            <Typography color={colors.grey[0]} fontWeight="bold" width="100%">
              AVATAR
            </Typography>
          }
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Hiển thị ảnh avatar nếu có */}
            {avatar && (
              <img
                src={avatar} // Hiển thị ảnh avatar tạm thời
                alt="Avatar"
                style={{
                  width: "100px",
                  height: "100px",
                  marginBottom: "10px",
                }}
              />
            )}

            {/* Upload ảnh */}
            <Upload
              name="avatar"
              showUploadList={false}
              customRequest={dummyRequest}
              beforeUpload={beforeUpload} // Kiểm tra trước khi upload
              onChange={handleUploadChange} // Xử lý thay đổi upload
            >
              <Button icon={<UploadOutlined />}>Click to Upload Avatar</Button>
            </Upload>
          </div>
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
          <Input style={{ width: "50%" }} placeholder={`Enter name`} />
        </Form.Item>

        <Form.Item
          name="email"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Email
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[
            { required: true, message: `Email is required!` },
            { type: "email", message: `Invalid email format!` },
          ]}
        >
          <Input style={{ width: "50%" }} placeholder={`Enter Email`} />
        </Form.Item>

        <Form.Item
          name="password"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              PASSWORD
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[
            { required: true, message: `Password is required!` },
            { min: 6, message: `Password must be at least 6 characters!` },
          ]}
        >
          <Input.Password
            style={{ width: "50%" }}
            placeholder={`Enter password`}
          />
        </Form.Item>

        <Form.Item
          name="repeatPassword"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              REPEAT PASSWORD
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[
            { required: true, message: `Please confirm your password!` },

            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            style={{ width: "50%" }}
            placeholder={`Repeat your password`}
          />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Phone Number
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[
            { required: true, message: `phone number is required!` },
            {
              pattern: /^[0-9]{10,12}$/,
              message: `Phone number must be 10-12 digits!`,
            },
          ]}
        >
          <Input style={{ width: "50%" }} placeholder={`Enter number`} />
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
          <Select
            style={{ width: "50%" }}
            defaultValue={userData?.sex} // Default to 'male' if userData doesn't have sex
            placeholder="Select gender"
            onChange={(value) => form.setFieldsValue({ sex: value })} // Update form value on selection
          >
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
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
          <Input
            placeholder="Enter height"
            style={{ width: "50%" }}
            defaultValue={userData?.height || ""} // Đồng bộ giá trị nếu có
          />
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
          <Input
            style={{ width: "50%" }}
            placeholder="Enter weight"
            defaultValue={userData?.weight || ""} // Đồng bộ giá trị nếu có
          />
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
          <Select
            style={{ width: "50%" }}
            placeholder="Select goal"
            onChange={(value) => form.setFieldsValue({ goal: value })} // Cập nhật giá trị khi chọn
          >
            <Select.Option value="muscle_gain">Muscle Gain</Select.Option>
            <Select.Option value="fat_loss">Fat Loss</Select.Option>
            <Select.Option value="maintenance">Maintenance</Select.Option>
          </Select>
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
          <Select
            style={{ width: "50%" }}
            placeholder="Select activity level"
            onChange={(value) => form.setFieldsValue({ activityLevel: value })} // Cập nhật giá trị khi chọn
          >
            <Select.Option value="low">Low</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="high">High</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Box display="flex" justifyContent="flex-end" mt="20px">
            <Button
              htmlType="submit"
              type="submit"
              style={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
              }}
              onClick={handleCreateClick}
            >
              Save
            </Button>
          </Box>
        </Form.Item>
      </Form>
    </Box>
  );
};

export default CreateUser;

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
