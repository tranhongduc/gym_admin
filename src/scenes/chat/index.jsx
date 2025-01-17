import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { onValue, ref } from "firebase/database";
import { addDataToFirebase, db } from "../../provider/firebase";

const UserList = ({ users, setActiveUserId, onSearch }) => {
  return (
    <div
      style={{
        width: "200px",
        borderRight: "1px solid #CCC",
        overflowY: "auto",
        backgroundColor: "#F7F7F7",
      }}
    >
      {/* Search Box */}
      <div style={{ padding: "10px", borderBottom: "1px solid #EEE" }}>
        <input
          type="text"
          placeholder="Search user..."
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #CCC",
          }}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      {users.map((user, index) => (
        <div
          key={index}
          style={{
            padding: "10px",
            cursor: "pointer",
            borderBottom: "1px solid #EEE",
            backgroundColor: user.active ? "#E2F163" : "#FFFFFF",
          }}
          onClick={() => setActiveUserId(user)}
        >
          {user}
        </div>
      ))}
    </div>
  );
};

const MessageComponent = ({ message, type }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: type === "user" ? "row-reverse" : "row",
        margin: "8px 10px",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          backgroundColor: type === "user" ? "#B3A0FF" : "#FFFFFF",
          padding: "10px",
          borderRadius: "10px",
          borderBottomRightRadius: type === "user" ? "0" : "10px",
          borderBottomLeftRadius: type === "user" ? "10px" : "0",
          color: "black",
        }}
      >
        {message}
      </div>
    </div>
  );
};

const ChatScreen = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // new
  const [allMessage, setAllMessage] = useState([]);

  const userID = "40"; // get user ID

  const [activeUserId, setActiveUserId] = useState();
  const [inputMessage, setInputMessage] = useState("");

  const handleSearch = (searchText) => {
    // setFilteredUsers(
    //   users.filter((user) =>
    //     user.name.toLowerCase().includes(searchText.toLowerCase())
    //   )
    // );
  };

  const hanldeSendMessage = () => {
    if (activeUserId) {
      addDataToFirebase(`data/chat_app/${activeUserId}`, {
        message: inputMessage,
        userSend: userID,
        create: new Date().getTime(),
      });
      setInputMessage("");
    }
  };

  const renderMessages = useMemo(() => {
    if (activeUserId) {
      const msg = allMessage.find(
        (item) => item.userId === activeUserId.toString()
      )?.message;

      return msg.map((item, index) => {
        return (
          <MessageComponent
            key={index}
            message={item.message}
            type={item.userSend.toString() === userID ? "user" : "admin"}
          />
        );
      });
    }
    return null;
  }, [activeUserId, allMessage]);
  useEffect(() => {
    const dbRef = ref(db, "data/chat_app");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const result = Object.entries(data).map(([userId, messages]) => ({
          userId,
          message: Object.values(messages).map(
            ({ create, message, userSend }) => ({
              create,
              message,
              userSend,
            })
          ),
        }));
        setAllMessage(result);
      } else {
        console.log("No data available");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Chat" subtitle="" />
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
          display: "flex",
        }}
      >
        {/* User List */}
        <UserList
          users={allMessage.map((item) => item.userId)}
          setActiveUserId={setActiveUserId}
          onSearch={handleSearch}
        />

        {/* Chat Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F5F5F5",
          }}
        >
          {/* Header */}
          <div
            style={{
              height: "60px",
              backgroundColor: "#4CAF50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            Chat with
            {/* get profile user at here by userSend is id  */}
          </div>

          {/* Message List */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
            }}
          >
            {renderMessages}
          </div>

          {/* Input Area */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderTop: "1px solid #CCC",
              backgroundColor: "#FFFFFF",
            }}
          >
            <input
              style={{
                flex: 1,
                height: "40px",
                border: "1px solid #CCC",
                borderRadius: "20px",
                padding: "0 15px",
                marginRight: "10px",
              }}
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button
              onClick={hanldeSendMessage}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default ChatScreen;
