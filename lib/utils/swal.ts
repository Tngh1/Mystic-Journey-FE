import Swal from "sweetalert2";

export const showSuccessAlert = (title: string, message: string) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: "success",
    background: "#18181b",
    color: "#ffffff",
    confirmButtonColor: "#ffc032",
    confirmButtonText: "OK",
    customClass: {
      title: "swal-title",
      htmlContainer: "swal-text",
      popup: "border border-white/10 rounded-2xl",
    },
  });
};

export const showErrorAlert = (title: string, message: string) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: "error",
    background: "#18181b",
    color: "#ffffff",
    confirmButtonColor: "#ca831f",
    confirmButtonText: "Try Again",
    customClass: {
      title: "swal-title",
      htmlContainer: "swal-text",
      popup: "border border-white/10 rounded-2xl",
    },
  });
};

export const showConfirmAlert = (
  title: string,
  message: string,
  confirmText: string = "Yes",
  cancelText: string = "Cancel"
) => {
  return Swal.fire({
    title,
    text: message,
    icon: "warning",
    background: "#18181b",
    color: "#ffffff",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#3f3f46",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      title: "swal-title",
      htmlContainer: "swal-text",
      popup: "border border-white/10 rounded-2xl",
    },
  });
};
