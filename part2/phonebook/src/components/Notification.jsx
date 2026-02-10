const Notification = ({ message }) => {
  if (message === null) return null

  const style = {
    color: message.type === "error" ? "red" : "green",
    background: "#f2f2f2",
    fontSize: "20px",
    border: `3px solid ${message.type === "error" ? "red" : "green"}`,
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "15px"
  }

  return <div style={style}>{message.text}</div>
}

export default Notification
