import React from "react";

type HelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "800px",
          width: "80%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ margin: 0 }}>Diagram Editor Help</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3>Basic Controls</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  Action
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Double-click canvas
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Create a new node at that position
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Click and drag node
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Move the node
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Click and drag canvas
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Pan the view
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Select node + drag from handle
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Create an edge connection
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Double-click node/edge label
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Edit the label
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Right-click node/edge
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Open context menu
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Double-click node
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Expand to nested graph
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3>Keyboard Shortcuts</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  Shortcut
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Delete / Backspace
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Delete selected node or edge
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Escape
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Return to parent graph or clear selection
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Ctrl/Cmd + N
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Create new node at center
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Ctrl/Cmd + A
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Select all nodes
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Ctrl/Cmd + +
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Zoom in
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Ctrl/Cmd + -
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Zoom out
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Ctrl/Cmd + 0
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  Reset zoom
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3>Tips</h3>
          <ul>
            <li style={{ marginBottom: "8px" }}>
              Use the Properties Panel on the right to edit the selected
              element's properties
            </li>
            <li style={{ marginBottom: "8px" }}>
              You can create hierarchical diagrams by expanding nodes
              (double-click or use the Expand button)
            </li>
            <li style={{ marginBottom: "8px" }}>
              Export your diagrams regularly to avoid losing work
            </li>
            <li style={{ marginBottom: "8px" }}>
              Right-click on canvas background for additional options
            </li>
          </ul>
        </div>

        <div
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
