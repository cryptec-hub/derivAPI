import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import "./styles.css";

const DialogDemo = ({ onSaveToken }) => {
  const [authToken, setAuthToken] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleSaveChanges = () => {
    console.log("Token:", authToken);
    const expirationTime = new Date().getTime() + 3600 * 1000; // 1 hour from now
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("tokenExpiration", expirationTime);
    setIsOpen(false);
    onSaveToken(authToken); // Call the parent's function to pass the authToken
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Disclaimer⚠️</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Please note that ML Models aren't 100% accurate. As such, you are
            prone to losses. This, however, shouldn't deter you as we work on
            improving the accuracy.
          </Dialog.Description>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="authToken">
              Token
            </label>
            <input
              className="Input"
              id="authToken"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              placeholder="Enter your authorization token"
            />
          </fieldset>
          <div
            style={{
              display: "flex",
              marginTop: 25,
              justifyContent: "flex-end",
            }}
          >
            <Dialog.Close asChild>
              <button className="Button green" onClick={handleSaveChanges}>
                Save Token
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogDemo;
