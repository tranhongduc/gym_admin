import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Button } from "antd";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { FaMapMarkerAlt } from "react-icons/fa";
import { addGym } from "../../api/GymApi";
import { Router, useNavigate } from "react-router-dom";

const CreateMap = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [form] = Form.useForm();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [markers, setMarkers] = useState([]);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDtQE6rnEqn3l2PulOF7sPyYfh6Rd_XKSY", // Thay bằng API key của bạn
    libraries: ["places"],
  });

  const onFinish = (values) => {
    console.log("Form Values:", values);
    console.log("Selected Location:", location);
    // Xử lý lưu dữ liệu vào DB ở đây
  };

  const handlePlaceChange = () => {
    const place = autocompleteRef.current.getPlace();
    console.log("Selected Place:", place);

    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      // Di chuyển bản đồ đến vị trí mới
      mapRef.current.panTo(place.geometry.location);
      mapRef.current.setZoom(15); // Điều chỉnh độ zoom nếu cần

      // Cập nhật địa chỉ và thông tin vị trí
      setAddress(place.formatted_address);
      setLocation({ lat, lng });
      setSelectedPlace(place);

      // Đánh dấu vị trí chọn trên bản đồ
      setMarkers([{ lat, lng }]);
    }
  };

  const handleMarkerDragEnd = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLocation({ lat, lng });
    setMarkers([{ lat, lng }]);
  };

  const handleMapClick = (e) => {
    if (isSelectingLocation) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setLocation({ lat, lng });
      setMarkers([{ lat, lng }]);
      setIsSelectingLocation(!isSelectingLocation);
    }
  };

  const handleConfirmLocation = async () => {
    if (markers.length > 0) {
      try {
        // Kiểm tra và lấy thông tin từ form
        const values = await form.validateFields();

        const confirmedData = {
          name: values.name, // Tên từ form
          address: values.address, // Địa chỉ từ form
          urlImg: "http://example.com/gym-image.jpg", // Link hình ảnh mẫu
          latitude: markers[0].lat,
          longitude: markers[0].lng,
        };

        // Gọi API hoặc hàm addGym để thêm thông tin vào cơ sở dữ liệu
        const a = await addGym(confirmedData);
        console.log("Gym added successfully:", a);
        navigate("/app/map");
      } catch (error) {
        console.error("Validation failed or adding gym failed:", error);
      }
    } else {
      console.log("No location selected");
    }
  };

  useEffect(() => {
    if (location) {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(location.lat, location.lng);
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          setAddress(results[0].formatted_address);
        }
      });
    }
  }, [location]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Box m="20px">
      <Header
        title="User Information"
        subtitle="Managing the User Information"
      />
      <Form
        form={form}
        layout="horizontal"
        size="large"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Name is required!" }]}
        >
          <Input style={{ width: "50%" }} placeholder="Enter name" />
        </Form.Item>

        {/* Trường nhập address (không còn Autocomplete nữa) */}
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Address is required!" }]}
        >
          <Input
            style={{ width: "50%" }}
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Item>

        {/* Trường nhập Search cho Autocomplete */}
        <Form.Item label="Search Address" name="searchAddress">
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChange}
          >
            <Input
              style={{ width: "50%" }}
              placeholder="Search for address"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
            />
          </Autocomplete>
        </Form.Item>

        {/* Bản đồ Google Maps */}
        <Form.Item label="Select Location" name="location">
          <GoogleMap
            zoom={10}
            center={location || { lat: 10.8231, lng: 106.6297 }}
            mapContainerStyle={{ height: "300px", width: "100%" }}
            onClick={handleMapClick}
            onLoad={(map) => (mapRef.current = map)}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              zoomControl: true,
              gestureHandling: "greedy",
            }}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker}
                draggable
                onDragEnd={handleMarkerDragEnd}
              />
            ))}
          </GoogleMap>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={handleConfirmLocation}
            disabled={!markers.length}
          >
            Confirm Location
          </Button>
          <Button
            type="default"
            onClick={() => {
              setMarkers([]);
              setIsSelectingLocation(true);
            }}
            style={{ marginRight: "10px" }}
          >
            <FaMapMarkerAlt style={{ marginRight: "5px" }} />
            Select Location
          </Button>
        </Form.Item>
      </Form>
    </Box>
  );
};

export default CreateMap;
