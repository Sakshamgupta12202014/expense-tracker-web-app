import React from "react";
import "./Modals.css";

function Modals({
  heading = "",
  description = "",
  buttonText1 = "",
  buttonText2 = "",
  buttonText3 = "",
  imageUrl = "",
  imageHeight = "100px",
  imageWidth = "100px",
  imageBorderRadius = "5%",
  imageObjectFit = "cover",

  onButtonClick1,  // in this way you use reusbale components(not hardcoding the onClick events)
  onButtonClick2,
  onButtonClick3,
  closeForm,
}) {

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(1px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    overflowY: "auto" /* Add scroll support */,
    padding: "20px",
  };

  return (
    <div style={modalOverlayStyle}>
      <div className="modal-content">
        {imageUrl && (
          <img
            src={imageUrl}
            style={{
              height: imageHeight,
              width: imageWidth,
              borderRadius: imageBorderRadius,
              objectFit: imageObjectFit,
            }}
            className="modal-img"
          />
        )}
        <h2 className="modal-heading">{heading}</h2>
        <p className="modal-description">{description}</p>

        <div className="modal-buttons">
          {buttonText1 && (
            <button className="btn btn-primary" onClick={onButtonClick1}>
              {buttonText1}
            </button>
          )}
          {buttonText2 && (
            <button className="btn btn-secondary" onClick={onButtonClick2}>
              {buttonText2}
            </button>
          )}
          {buttonText3 && (
            <button className="btn btn-secondary" onClick={onButtonClick3}>
              {buttonText3}
            </button>
          )}
        </div>
        <button onClick={closeForm} className="modal-close">
          ✕
        </button>
      </div>
    </div>
  );
}

export default Modals;
