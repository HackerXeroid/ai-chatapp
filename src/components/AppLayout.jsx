/*
node.js express.js 
*/

import React, { act, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  WechatOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";

import { Button, Layout, Menu, theme, Space, Input } from "antd";
import Loader from "./Loader";
const { Search } = Input;
const { Header, Sider, Content } = Layout;

const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
  },
];

const ChatContent = ({
  allChats,
  isProcessingRequest,
  setIsProcessingRequest,
  activeChatId,
  updateAllChats,
}) => {
  const activeChat = allChats[activeChatId];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [userPrompt, setUserPrompt] = useState("");

  const addToCurrentConversation = (newMessage) => {
    updateAllChats((prevAllChats) => {
      const prevActiveChat = prevAllChats[activeChatId];

      const newConversation = [
        ...prevActiveChat.conversation,
        { id: uuidv4(), ...newMessage },
      ];

      const updatedChat = {
        ...prevActiveChat,
        conversation: newConversation,
      };

      const newAllChats = {
        ...prevAllChats,
        [prevActiveChat.id]: updatedChat,
      };

      return newAllChats;
    });
  };

  const getResponse = async (prompt) => {
    try {
      addToCurrentConversation({
        message: prompt,
        sender: "user",
      });
      setIsProcessingRequest(true);
      setUserPrompt("");
      const response = await axios.post("http://localhost:3000/api/chat", {
        prompt,
      });

      setIsProcessingRequest(false);
      addToCurrentConversation({
        message: response.data,
        sender: "bot",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
      className="flex flex-col"
    >
      <div className="messages flex-1 space-y-4 overflow-auto flex flex-col items-start">
        {activeChat.conversation.map((text) => (
          <div
            key={text.id}
            className={`message p-2 rounded-lg ${text.sender}-chat max-w-xl`}
          >
            <ReactMarkdown>{text.message}</ReactMarkdown>
          </div>
        ))}

        {isProcessingRequest && <Loader />}
      </div>

      <MessageInput
        isProcessingRequest={isProcessingRequest}
        userPrompt={userPrompt}
        setUserPrompt={setUserPrompt}
        getResponse={getResponse}
      />
    </Content>
  );
};

const NoChatContent = ({ allChatsKeys }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl text-gray-400">
          {allChatsKeys.length > 0 && "Select a chat to start messaging"}
          {allChatsKeys.length === 0 && "No chats available.\n Create one."}
        </h1>
      </div>
    </Content>
  );
};

const SideBar = ({ collapsed, activeChatId, setActiveChatId, allChats }) => {
  const allChatsKeys = Object.keys(allChats);
  const activeChat = allChats[activeChatId];
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} className="">
      <div className="demo-logo-vertical" />
      <div className="flex flex-col justify-between h-full px-2">
        <Menu
          className="w-full"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={activeChat?.id}
          onClick={({ key }) => setActiveChatId(key)}
          items={allChatsKeys.map((key) => ({
            key: allChats[key].id,
            icon: <WechatOutlined />,
            label: allChats[key].name,
          }))}
        />
        <Button
          type="ghost"
          className="my-4 border border-gray-400 text-gray-400 flex items-center justify-center mx-auto w-full"
          icon={<PlusOutlined />}
        >
          {!collapsed && "New chat"}
        </Button>
      </div>
    </Sider>
  );
};

const MessageInput = ({
  userPrompt,
  setUserPrompt,
  getResponse,
  isProcessingRequest,
}) => {
  return (
    <div className="send-input mt-4">
      <Space.Compact
        style={{
          width: "100%",
        }}
        className="h-11"
      >
        <Input
          value={userPrompt}
          disabled={isProcessingRequest}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        />
        <Button
          type="primary"
          className="h-full"
          onClick={() => getResponse(userPrompt)}
        >
          Submit
        </Button>
      </Space.Compact>
    </div>
  );
};

const AppLayout = ({
  allChats,
  activeChatId,
  setActiveChatId,
  updateAllChats,
}) => {
  const allChatsKeys = Object.keys(allChats);
  const activeChat = allChats[activeChatId];

  const [collapsed, setCollapsed] = useState(false);
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="h-screen">
      <SideBar {...{ allChats, collapsed, activeChatId, setActiveChatId }} />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>

        {activeChat && (
          <ChatContent
            allChats={allChats}
            isProcessingRequest={isProcessingRequest}
            setIsProcessingRequest={setIsProcessingRequest}
            activeChatId={activeChatId}
            updateAllChats={updateAllChats}
          />
        )}

        {!activeChat && <NoChatContent allChatsKeys={allChatsKeys} />}
      </Layout>
    </Layout>
  );
};

export default AppLayout;
