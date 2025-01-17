import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";
import { getlistUser } from "../../api/UserApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { getlistGym } from "../../api/GymApi";

const ListMap = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,

      cellClassName: "name-column--cell",
    },
  ];
  const navigate = useNavigate();

  const handleCellClick = (params) => {
    console.log(params);
    navigate("/app/viewMap", { state: params.row.id });
  };

  const [listUser, setListUser] = useState([]);

  const getListData = async () => {
    try {
      const list = await getlistGym();
      setListUser(list);
    } catch (error) {
      console.error("", error.message);
      console.log("", error);
    }
  };

  useEffect(() => {
    getListData();
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="GYM MAP" subtitle="" />

        <Box>
          <Button
            onClick={() => {
              navigate("/app/CreateMap");
            }}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Add Gym
          </Button>
        </Box>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={listUser}
          columns={columns}
          onCellDoubleClick={handleCellClick}
        />
      </Box>
    </Box>
  );
};

export default ListMap;
