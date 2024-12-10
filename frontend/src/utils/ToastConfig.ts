import { ToastContainerProps } from "react-toastify";

// Create a configuration object with default properties
export const toastConfig: ToastContainerProps = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
};
