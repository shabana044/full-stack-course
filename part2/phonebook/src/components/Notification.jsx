const Notification = ({ message }) => {
  if (message === null) return null;

  const style = {
    color: "green",
    background: "#d3f8d3",
    padding: "10px",
    border: "2px solid green",
    borderRadius: "5px",
    marginBottom: "15px",
    fontSize: "18px",
  };

  return (
    <div style={style}>
      {message}
    </div>
  );
};

export default Notification;
