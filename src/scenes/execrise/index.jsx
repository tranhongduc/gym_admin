import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";
import { getlistUser } from "../../api/UserApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { getlistExercise } from "../../api/ExerciseApi";

const Execrise = () => {
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
      cellClassName: "name-column--cell",
    },
    {
      field: "type",
      headerName: "Type",

      cellClassName: "name-column--cell",
    },
    {
      field: "num_of_exercises",
      headerName: "Number of Exercises",
      flex: 1,
    },

    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 1,
    // },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   flex: 1,
    //   renderCell: () => (
    //     <Box
    //       display="flex"
    //       justifyContent="space-around"
    //       alignItems="center"
    //       width="100%"
    //     >
    //       <AdminPanelSettingsOutlinedIcon />
    //       <LockOpenOutlinedIcon />
    //       <SecurityOutlinedIcon />
    //     </Box>
    //   ),
    // },
  ];
  const navigate = useNavigate();

  const handleCellClick = (params) => {
    console.log(params);
    navigate("/app/viewExecrise", { state: params.row.id });
  };

  const [listEx, setListEx] = useState([]);

  const getListData = async () => {
    try {
      const a = await getlistExercise();
      console.log("list", a);
      setListEx(a);
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
        <Header title="Execrise" subtitle="" />

        <Box>
          <Button
            onClick={() => {
              navigate("/app/createUser");
            }}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Create Execrise
          </Button>
        </Box>
      </Box>{" "}
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
          rows={listEx}
          columns={columns}
          onCellDoubleClick={handleCellClick}
        />
      </Box>
    </Box>
  );
};

export default Execrise;
