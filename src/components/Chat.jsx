import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaRobot,
  FaSpinner,
  FaPlay,
  FaCopy,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";

// 导入头像图片 - 正确位置
// 移除导入头像图片的代码
// import userAvatar from '../assets/user-avatar.png';
// import aiAvatar from '../assets/ai-avatar.png';

// 样式组件
const ChatContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  height: 80vh;
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  margin-bottom: 20px;
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const MessageItem = styled.div`
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease-in-out;
  justify-content: ${(props) => (props.isUser ? "flex-start" : "flex-end")};

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 修改Avatar组件 - 更美观的头像
const Avatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: ${(props) => (props.isUser ? "15px" : "0")};
  margin-left: ${(props) => (props.isUser ? "0" : "15px")};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isUser ? "#4a89dc" : "#6c757d")};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  color: white;
  font-size: 24px;
  order: ${(props) => (props.isUser ? 0 : 1)};
`;

const MessageContent = styled.div`
  flex: 0 1 auto;
  background-color: ${(props) =>
    props.isUser ? "linear-gradient(135deg, #6e8efb, #4a89dc)" : "#ffffff"};
  background: ${(props) =>
    props.isUser ? "linear-gradient(135deg, #6e8efb, #4a89dc)" : "#ffffff"};
  padding: 15px 20px;
  border-radius: 18px;
  max-width: 70%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  color: ${(props) => (props.isUser ? "#ffffff" : "#333333")};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 15px;
    ${(props) => (props.isUser ? "left: -8px" : "right: -8px")};
    width: 15px;
    height: 15px;
    background: ${(props) =>
      props.isUser ? "linear-gradient(135deg, #6e8efb, #4a89dc)" : "#ffffff"};
    transform: rotate(45deg);
    z-index: -1;
  }

  p {
    margin: 0 0 10px 0;
    line-height: 1.5;
  }

  p:last-child {
    margin-bottom: 0;
  }

  code {
    background-color: ${(props) =>
      props.isUser ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)"};
    padding: 2px 5px;
    border-radius: 4px;
    font-family: "Courier New", monospace;
  }

  pre {
    background-color: ${(props) =>
      props.isUser ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.03)"};
    padding: 10px;
    border-radius: 8px;
    overflow-x: auto;
  }
`;

const InputContainer = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 30px;
  padding: 5px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: 30px;
  outline: none;
  font-size: 16px;

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  padding: 12px 25px;
  background: linear-gradient(135deg, #6e8efb, #4a89dc);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 137, 220, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(135deg, #c1c1c1, #a0a0a0);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// 新增：SQL代码块容器
const SqlCodeContainer = styled.div`
  position: relative;
  margin: 10px 0;
`;

// 新增：可折叠代码容器
const CollapsibleCodeContainer = styled.div`
  position: relative;
  max-height: ${(props) => (props.isCollapsed ? "200px" : "none")};
  overflow: ${(props) => (props.isCollapsed ? "hidden" : "visible")};
  transition: max-height 0.3s ease-in-out;

  ${(props) =>
    props.isCollapsed &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
      pointer-events: none;
    }
  `}
`;

// 新增：折叠切换按钮
const CollapseToggle = styled.button`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateX(-50%) translateY(-2px);
  }
`;

// 新增：按钮容器
const CodeBlockActions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
`;

// 新增：动作按钮
const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &.execute-btn {
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #218838, #1abc9c);
      transform: translateY(-1px);
    }
  }

  &.copy-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #6c757d;
    border: 1px solid #dee2e6;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #495057;
    }
  }
`;

// 新增：自定义代码块组件
const CustomCodeBlock = ({ children, className, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");

  // 添加折叠状态
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 判断代码是否过长（超过15行或800字符）
  const isCodeLong = code.split("\n").length > 15 || code.length > 800;

  // 初始化折叠状态
  useEffect(() => {
    setIsCollapsed(isCodeLong);
  }, [isCodeLong]);

  // 判断是否为SQL语句
  const isSqlCode = (lang, codeContent) => {
    // 检查语言标识
    if (
      lang &&
      ["sql", "mysql", "postgresql", "sqlite", "plsql"].includes(
        lang.toLowerCase()
      )
    ) {
      return true;
    }

    // 检查代码内容中的SQL关键字
    const sqlKeywords = [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE",
      "CREATE",
      "DROP",
      "ALTER",
      "FROM",
      "WHERE",
      "JOIN",
      "INNER",
      "LEFT",
      "RIGHT",
      "FULL",
      "GROUP BY",
      "ORDER BY",
      "HAVING",
      "LIMIT",
      "OFFSET",
    ];

    const upperCode = codeContent.toUpperCase();
    return sqlKeywords.some((keyword) => upperCode.includes(keyword));
  };

  // SQL执行处理函数（留空）
  const handleExecuteSql = () => {
    // TODO: 实现SQL执行逻辑
    console.log("执行SQL:", code);
  };

  // 复制代码处理函数
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // 可以添加复制成功的提示
      console.log("代码已复制到剪贴板");
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  // 切换折叠状态
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isSQL = isSqlCode(language, code);

  if (isSQL) {
    return (
      <SqlCodeContainer>
        <CollapsibleCodeContainer isCollapsed={isCollapsed}>
          <SyntaxHighlighter
            style={tomorrow}
            language={language || "sql"}
            PreTag="div"
            {...props}
          >
            {code}
          </SyntaxHighlighter>
          {isCodeLong && (
            <CollapseToggle onClick={toggleCollapse}>
              {isCollapsed ? (
                <>
                  <FaChevronDown size={10} />
                  展开代码
                </>
              ) : (
                <>
                  <FaChevronUp size={10} />
                  收起代码
                </>
              )}
            </CollapseToggle>
          )}
        </CollapsibleCodeContainer>
        <CodeBlockActions>
          <ActionButton
            className="copy-btn"
            onClick={handleCopyCode}
            title="复制代码"
          >
            <FaCopy size={12} />
            复制
          </ActionButton>
          <ActionButton
            className="execute-btn"
            onClick={handleExecuteSql}
            title="执行SQL"
          >
            <FaPlay size={12} />
            执行
          </ActionButton>
        </CodeBlockActions>
      </SqlCodeContainer>
    );
  }

  // 非SQL代码块也支持折叠功能
  return (
    <SqlCodeContainer>
      <CollapsibleCodeContainer isCollapsed={isCollapsed}>
        <SyntaxHighlighter
          style={tomorrow}
          language={language}
          PreTag="div"
          {...props}
        >
          {code}
        </SyntaxHighlighter>
        {isCodeLong && (
          <CollapseToggle onClick={toggleCollapse}>
            {isCollapsed ? (
              <>
                <FaChevronDown size={10} />
                展开代码
              </>
            ) : (
              <>
                <FaChevronUp size={10} />
                收起代码
              </>
            )}
          </CollapseToggle>
        )}
      </CollapsibleCodeContainer>
      {/* 非SQL代码只显示复制按钮 */}
      <CodeBlockActions>
        <ActionButton
          className="copy-btn"
          onClick={handleCopyCode}
          title="复制代码"
        >
          <FaCopy size={12} />
          复制
        </ActionButton>
      </CodeBlockActions>
    </SqlCodeContainer>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 添加自动滚动功能
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 添加欢迎消息
  useEffect(() => {
    const welcomeMessage = {
      text: "您好！我是您的AI助手，有什么可以帮助您的吗？",
      isUser: false,
      time: formatTime(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const ChatHeader = styled.div`
    text-align: center;
    margin-bottom: 30px;

    h1 {
      font-size: 28px;
      color: #333;
      margin-bottom: 10px;
      font-weight: 600;
    }

    p {
      color: #888;
      font-size: 14px;
    }
  `;

  const MessageTime = styled.div`
    font-size: 12px;
    color: ${(props) => (props.isUser ? "rgba(255, 255, 255, 0.7)" : "#aaa")};
    margin-top: 5px;
    text-align: right;
  `;

  // 在Chat组件中添加时间戳
  const formatTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  // 修改handleSendMessage函数
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage = {
      text: input,
      isUser: true,
      time: formatTime(),
    };
    setMessages([...messages, userMessage]);
    setInput("");

    // 设置加载状态
    setIsLoading(true);

    try {
      // 发送请求到后端
      const response = await axios.post("/api/chat", { message: input });

      // 添加AI回复
      const aiMessage = {
        text: response.data.message,
        isUser: false,
        time: formatTime(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // 添加错误消息
      const errorMessage = {
        text: "抱歉，发生了错误，请稍后再试。",
        isUser: false,
        time: formatTime(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      // 无论成功或失败，都关闭加载状态
      setIsLoading(false);
    }
  };

  // 在渲染部分添加标题和时间
  return (
    <ChatContainer>
      <ChatHeader>
        <h1>智能助手</h1>
        <p>随时为您解答问题</p>
      </ChatHeader>

      <MessageList>
        {messages.map((message, index) => (
          <MessageItem key={index} isUser={message.isUser}>
            <Avatar isUser={message.isUser}>
              {message.isUser ? <FaUser /> : <FaRobot />}
            </Avatar>
            <MessageContent isUser={message.isUser}>
              <ReactMarkdown
                components={{
                  code: CustomCodeBlock,
                }}
              >
                {message.text}
              </ReactMarkdown>
              <MessageTime isUser={message.isUser}>{message.time}</MessageTime>
            </MessageContent>
          </MessageItem>
        ))}

        {isLoading && (
          <MessageItem isUser={false}>
            <Avatar isUser={false}>
              <FaRobot />
            </Avatar>
            <MessageContent isUser={false}>
              <LoadingIndicator>
                <FaSpinner size={20} />
              </LoadingIndicator>
            </MessageContent>
          </MessageItem>
        )}
        <div ref={messagesEndRef} />
      </MessageList>

      <InputContainer>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入您的问题..."
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={isLoading}>
          发送
        </Button>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;
