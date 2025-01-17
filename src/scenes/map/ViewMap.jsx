import React, { useState, useEffect, useRef } from "react";
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

const fakeGymData = {
  name: "Fitness Center",
  address: "123 Gym Street, District 1, Ho Chi Minh City",
  latitude: 10.8231,
  longitude: 106.6297,
};

const ViewMap = ({ gymData = fakeGymData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [form] = Form.useForm();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(gymData?.address || "");
  const [markers, setMarkers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useLoadScript({
    libraries: ["places"],
  });

  useEffect(() => {
    console.log("Gym Data:", gymData);
    if (gymData && gymData.latitude && gymData.longitude) {
      setLocation({
        lat: gymData.latitude,
        lng: gymData.longitude,
      });

      setMarkers([{ lat: gymData.latitude, lng: gymData.longitude }]);
      console.log("Gym Data:", markers);
    } else {
      setLocation({
        lat: 10.8231,
        lng: 106.6297,
      });
      setMarkers([{ lat: 10.8231, lng: 106.6297 }]);
    }
  }, [gymData]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Chuyển trạng thái chỉnh sửa
  };

  const handlePlaceChange = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setLocation({ lat, lng });
      setAddress(place.formatted_address);
      setMarkers([{ lat, lng }]);
    }
  };

  const handleMapClick = (e) => {
    if (isEditing && isSelectingLocation) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setLocation({ lat, lng });
      setMarkers([{ lat, lng }]);
      setIsSelectingLocation(false); // Dừng chế độ chọn
    }
  };

  const handleConfirmLocation = () => {
    setIsSelectingLocation(true);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Box m="20px">
      <Header title="Gym Information" subtitle="Viewing Gym Information" />
      <Form form={form} layout="horizontal" size="large" autoComplete="off">
        <Form.Item label="Full Name">
          <Input
            style={{ width: "50%" }}
            value={gymData?.name || "N/A"}
            readOnly={!isEditing} // Chỉ cho phép chỉnh sửa khi isEditing = true
          />
        </Form.Item>

        <Form.Item label="Address">
          <Input
            style={{ width: "50%" }}
            value={address}
            readOnly={!isEditing} // Chỉ cho phép chỉnh sửa khi isEditing = true
            onChange={(e) => setAddress(e.target.value)} // Cập nhật giá trị khi chỉnh sửa
          />
        </Form.Item>

        {isEditing && ( // Hiển thị chỉ khi chỉnh sửa
          <Form.Item label="Search Address">
            <Autocomplete
              onLoad={(autocomplete) =>
                (autocompleteRef.current = autocomplete)
              }
              onPlaceChanged={handlePlaceChange}
            >
              <Input
                style={{ width: "50%" }}
                placeholder="Search for address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Autocomplete>
          </Form.Item>
        )}

        {/* Bản đồ Google Maps */}
        <Form.Item label="Location">
          <GoogleMap
            zoom={10}
            center={location || { lat: 10.8231, lng: 106.6297 }}
            mapContainerStyle={{ height: "300px", width: "100%" }}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              zoomControl: true,
              gestureHandling: "greedy",
            }}
            onClick={handleMapClick} // Chọn vị trí khi nhấp vào bản đồ
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker}
                draggable={isEditing} // Chỉ cho phép di chuyển marker khi isEditing = true
              />
            ))}
          </GoogleMap>
        </Form.Item>

        <Form.Item>
          <Button type="default" onClick={handleEditToggle}>
            {isEditing ? "Stop Editing" : "Edit"}
          </Button>

          {isEditing && (
            <Button
              type="default"
              onClick={handleConfirmLocation}
              style={{ marginLeft: "10px" }}
            >
              <FaMapMarkerAlt style={{ marginRight: "5px" }} />
              Select Location
            </Button>
          )}
        </Form.Item>
      </Form>
    </Box>
  );
};

export default ViewMap;
