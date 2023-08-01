import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import "./styles.css";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const DialogDemo = ({ onSaveToken }) => {
  const [authToken, setAuthToken] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [saveTokenButton, setSaveTokenButton] = useState(false);

  const app_id = 36942;
  const connection = new WebSocket(
    `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
  );

  const api = new DerivAPIBasic({ connection });

  const handleSaveChanges = async () => {
    setSaveTokenButton(true);
    setVerifying(true);
    try {
      await api.authorize(authToken);
      const expirationTime = new Date().getTime() + 3600 * 1000; // 1 hour from now
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("tokenExpiration", expirationTime);
      setIsOpen(false);
      onSaveToken(authToken); // Call the parent's function to pass the authToken
    } catch (error) {
      // console.log(error);
      toast.error(`${error.error.message}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        toastId: `${error.error.message}`,
      });
      setAuthToken("");
    }
    setVerifying(false);
    setSaveTokenButton(false);
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Disclaimer⚠️</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Trading in financial markets involves inherent risks. It is
            essential to conduct thorough research, seek professional advice,
            and use risk management techniques before engaging in any trading
            activities. Please note that ML Models aren't 100% accurate. As
            such, you are prone to losses.This, however, shouldn't deter you as
            we work on improving the accuracy.
          </Dialog.Description>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="dark"
            // limit={1}
          />
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
              <button
                className="Button green"
                onClick={handleSaveChanges}
                disabled={saveTokenButton}
              >
                {verifying ? "Verifying" : "Save Token"}
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
