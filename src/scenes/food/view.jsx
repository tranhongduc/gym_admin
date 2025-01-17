import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker } from "antd";
import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { getUserById, updateUser } from "../../api/UserApi";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { getFood } from "../../api/FoodApi";

const ViewFood = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const location = useLocation();
  const id = location.state; // Lấy dữ liệu đã truyền từ trang trước

  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [foodData, setFoodData] = useState();

  const onFinish = async (values) => {
    console.log("Success:", values);
    // // Cập nhật dữ liệu người dùng với thông tin mới từ form
    // const updatedUser = { ...foodData, ...values };
    // setfoodData(updatedUser); // Cập nhật lại dữ liệu
    // console.log("Updated User:", updatedUser);
    // // Tạo formData để gửi yêu cầu
    // const formData = new FormData();
    // formData.append("full_name", updatedUser.name);
    // // Bạn có thể gửi formData đến API ở đây nếu cần
    // try {
    //   // Gọi hàm updateUser và gửi formData
    //   const response = await updateUser(updatedUser); // Hoặc có thể sử dụng formData ở đây tùy theo yêu cầu
    //   console.log("API Response:", response);
    // } catch (error) {
    //   console.error("Error updating user:", error);
    // }
  };

  const getListData = async () => {
    try {
      const a = await getFood(id);
      console.log("FoodBank", a);
      setFoodData(a);
    } catch (error) {
      console.error("Error fetching user data", error.message);
    }
  };

  useEffect(() => {
    getListData();
  }, []);

  const handleEditSaveClick = () => {
    if (!isEditMode) {
      console.log("ed Clicked");
      form.setFieldsValue({
        name: foodData?.name,
        description: foodData?.description,
        type: foodData?.type,
        allergies: foodData?.allergies,
        dietary: foodData?.dietary,
        dietMode: foodData?.dietMode,
        calories: foodData?.calories,
        cookingTime: foodData?.cookingTime,
      });
      setIsEditMode(!isEditMode); // Chuyển sang chế độ chỉnh sửa
    } else {
      console.log("Save Clicked");
      setIsEditMode(!isEditMode); // Chuyển sang chế độ chỉnh sửa
    }
  };

  return (
    <Box m="20px">
      <Header
        title="Food Information"
        subtitle="Managing the Food Information"
      />

      <Form
        form={form}
        layout="horizontal"
        labelAlign="right"
        labelWrap="true"
        size="large"
        autoComplete="off"
        initialValues={foodData}
        onFinish={onFinish}
        style={{ width: "100%" }}
      >
        <Form.Item
          labelCol={{ span: 4 }}
          label={
            <Typography color={colors.grey[100]} fontWeight="bold" width="100%">
              Pic
            </Typography>
          }
        >
          <img
            src={foodData?.urlImg}
            alt="Avatar"
            style={{ width: "100px", height: "100px" }}
          />
        </Form.Item>

        {/* name */}
        <Form.Item
          name="name"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              NAME
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: `name is required!` }]}
        >
          {isEditMode ? (
            <Input
              style={{ width: "50%" }}
              defaultValue={foodData?.name || ""} // Đồng bộ giá trị nếu có
              placeholder={`Enter name`}
            />
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {foodData?.name}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="description"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Description
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: `Description is required!` }]}
        >
          {isEditMode ? (
            <Input
              style={{ width: "50%" }}
              defaultValue={foodData?.description || ""} // Đồng bộ giá trị nếu có
              placeholder={`Enter Description`}
            />
          ) : (
            <Typography
              color={colors.grey[100]}
              style={{ width: "100%" }}
              fontWeight="bold"
            >
              {foodData?.description}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="type"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Type
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: "Type is required!" }]}
        >
          {isEditMode ? (
            <Select
              style={{ width: "50%" }}
              defaultValue={foodData?.type} // Default to 'male' if foodData doesn't have sex
              placeholder="Select type"
              onChange={(value) => form.setFieldsValue({ type: value })} // Update form value on selection
            >
              <Select.Option value="Breakfast">Breakfast</Select.Option>
              <Select.Option value="Lunch">Lunch</Select.Option>
              <Select.Option value="Dinner">Dinner</Select.Option>
            </Select>
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {foodData?.type === "Breakfast" && "Breakfast"}
              {foodData?.type === "Lunch" && "Lunch"}
              {foodData?.type === "Dinner" && "Dinner"}
              {!foodData?.type && "Not Available"}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="allergies"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Allergies
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: "Allergies is required!" }]}
        >
          {isEditMode ? (
            <Select
              style={{ width: "50%" }}
              defaultValue={foodData?.allergies} // Chọn mặc định nếu có
              placeholder="Select allergies"
              onChange={(value) => form.setFieldsValue({ goal: value })} // Cập nhật giá trị khi chọn
            >
              <Select.Option value="Dairy">Dairy</Select.Option>
              <Select.Option value="Egg">Egg</Select.Option>
              <Select.Option value="Nut">Nut</Select.Option>
              <Select.Option value="Shellfish">Shellfish</Select.Option>
            </Select>
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {foodData?.allergies === "Dairy" && "Dairy "}
              {foodData?.allergies === "Egg" && "Egg "}
              {foodData?.allergies === "Nut" && "Nut "}
              {foodData?.allergies === "Shellfish" && "Shellfish "}
              {!foodData?.allergies && "Not Available"}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="dietary"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Dietary
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: "Dietary is required!" }]}
        >
          {isEditMode ? (
            <Select
              style={{ width: "50%" }}
              defaultValue={foodData?.dietary} // Chọn mặc định nếu có
              placeholder="Select dietary"
              onChange={(value) => form.setFieldsValue({ dietary: value })} // Cập nhật giá trị khi chọn
            >
              <Select.Option value="Kento">Kento</Select.Option>
              <Select.Option value="Vegan">Vegan</Select.Option>
              <Select.Option value="Vegetarian">Vegetarian</Select.Option>
              <Select.Option value="Gluten-Free">Gluto-free</Select.Option>
              <Select.Option value="Paleo">Paleo</Select.Option>
            </Select>
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {foodData?.dietary === "Kento" && "Kento "}
              {foodData?.dietary === "Vegan" && "Vegan "}
              {foodData?.dietary === "Vegetarian" && "Vegetarian "}
              {foodData?.dietary === "Gluten-Free" && "Gluto-free "}
              {foodData?.dietary === "Paleo" && "Paleo "}
              {!foodData?.dietary && "Not Available"}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="dietMode"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Diet
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: "Diet is required!" }]}
        >
          {isEditMode ? (
            <Select
              style={{ width: "50%" }}
              defaultValue={foodData?.dietMode} // Chọn mặc định nếu có
              placeholder="Select diet"
              onChange={(value) => form.setFieldsValue({ dietMode: value })} // Cập nhật giá trị khi chọn
            >
              <Select.Option value="High-protein">High Protein</Select.Option>
              <Select.Option value="Low-carb">Low Carb</Select.Option>
              <Select.Option value="Balanced">Balanced</Select.Option>
              <Select.Option value="Detox">Detox</Select.Option>
            </Select>
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {foodData?.dietMode === "High-protein" && "High Protein "}
              {foodData?.dietMode === "Low-carb" && "Low Carb "}
              {foodData?.dietMode === "Balanced" && "Balanced "}
              {foodData?.dietMode === "Detox" && "Detox "}
              {!foodData?.dietMode && "Not Available"}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="allergies"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Allergies
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: "Allergies is required!" }]}
        >
          {isEditMode ? (
            <Select
              style={{ width: "50%" }}
              defaultValue={foodData?.allergies} // Chọn mặc định nếu có
              placeholder="Select allergies"
              onChange={(value) => form.setFieldsValue({ goal: value })} // Cập nhật giá trị khi chọn
            >
              <Select.Option value="Dairy">Dairy</Select.Option>
              <Select.Option value="Egg">Egg</Select.Option>
              <Select.Option value="Nut">Nut</Select.Option>
              <Select.Option value="Shellfish">Shellfish</Select.Option>
            </Select>
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {foodData?.allergies === "Dairy" && "Dairy "}
              {foodData?.allergies === "Egg" && "Egg "}
              {foodData?.allergies === "Nut" && "Nut "}
              {foodData?.allergies === "Shellfish" && "Shellfish "}
              {!foodData?.allergies && "Not Available"}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="calories"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Calo
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: "Calo is required!" }]}
        >
          {isEditMode ? (
            <Input
              style={{ width: "50%" }}
              placeholder="Enter calo"
              defaultValue={foodData?.calories || ""} // Đồng bộ giá trị nếu có
            />
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {foodData?.calories || "Not Available"}
              {/* Hiển thị nếu không có giá trị */}
            </Typography>
          )}
        </Form.Item>

        <Form.Item
          name="cookingTime"
          label={
            <Typography color={colors.grey[100]} fontWeight="bold">
              Cooking Time
            </Typography>
          }
          labelCol={{ span: 4 }}
          rules={[{ required: true, message: "Time is required!" }]}
        >
          {isEditMode ? (
            <Input
              style={{ width: "50%" }}
              placeholder="Enter Time"
              defaultValue={foodData?.cookingTime || ""} // Đồng bộ giá trị nếu có
            />
          ) : (
            <Typography color={colors.grey[100]} fontWeight="bold">
              {foodData?.cookingTime || "Not Available"}
              {/* Hiển thị nếu không có giá trị */}
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

export default ViewFood;

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
//           value={foodData?.dob ? dayjs(foodData?.dob, "DD/MM/YYYY") : null}
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
//           {foodData?.dob}{" "}
//         </Typography>
//       )}
//     </Form.Item> */}
