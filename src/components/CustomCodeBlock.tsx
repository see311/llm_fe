import { useEffect, useState, FC, PropsWithChildren } from "react";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaPlay, FaCopy, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { publish } from "src/lib/MassageCenter/messageCenter";
import { useNavigate } from "react-router-dom";

const SqlCodeContainer = styled.div`
  position: relative;
`;

const CollapsibleCodeContainer = styled.div<{ isCollapsed: boolean }>`
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

const CodeBlockActions = styled.div`
  display: flex;
  gap: 8px;
`;

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

const CustomCodeBlock: FC<PropsWithChildren<{ className: string }>> = ({
  children,
  className,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isCodeLong = code.split("\n").length > 15 || code.length > 800;

  useEffect(() => {
    setIsCollapsed(isCodeLong);
  }, [isCodeLong]);

  const isSqlCode = (lang: string, codeContent: string) => {
    if (
      lang &&
      ["sql", "mysql", "postgresql", "sqlite", "plsql"].includes(
        lang.toLowerCase()
      )
    ) {
      return true;
    }

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

  const handleExecuteSql = () => {
    // TODO
    console.log("Execute SQL:", code);
    navigate("/app/query-builder", { replace: true });
    publish("loadSQLFromChatBot2QB", { code });
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      console.log("Copy to clipboard");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

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
                  Expand
                </>
              ) : (
                <>
                  <FaChevronUp size={10} />
                  Collapse
                </>
              )}
            </CollapseToggle>
          )}
        </CollapsibleCodeContainer>
        <CodeBlockActions>
          <ActionButton
            className="copy-btn"
            onClick={handleCopyCode}
            title="Copy Code"
          >
            <FaCopy size={12} />
            Copy
          </ActionButton>
          <ActionButton
            className="execute-btn"
            onClick={handleExecuteSql}
            title="Execute SQL in Query Builder"
          >
            <FaPlay size={12} />
            Execute
          </ActionButton>
        </CodeBlockActions>
      </SqlCodeContainer>
    );
  }

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
                Expand
              </>
            ) : (
              <>
                <FaChevronUp size={10} />
                Collapse
              </>
            )}
          </CollapseToggle>
        )}
      </CollapsibleCodeContainer>
      {/* not SQL only support copy */}
      <CodeBlockActions>
        <ActionButton
          className="copy-btn"
          onClick={handleCopyCode}
          title="Copy Code"
        >
          <FaCopy size={12} />
          Copy
        </ActionButton>
      </CodeBlockActions>
    </SqlCodeContainer>
  );
};

export default CustomCodeBlock;
