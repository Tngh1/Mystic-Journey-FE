import Swal from "sweetalert2";

export const showSuccessAlert = (title: string, message: string) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: "success",
    background: "#1a1a2e",
    color: "#ffffff",
    confirmButtonColor: "#5d9e6e",
    confirmButtonText: "OK",
    customClass: {
      title: "swal-title",
      htmlContainer: "swal-text",
    },
  });
};

export const showErrorAlert = (title: string, message: string) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: "error",
    background: "#1a1a2e",
    color: "#ffffff",
    confirmButtonColor: "#d33",
    confirmButtonText: "Try Again",
    customClass: {
      title: "swal-title",
      htmlContainer: "swal-text",
    },
  });
};

export const showLoadingAlert = (title: string = "Loading...") => {
  return Swal.fire({
    title: title,
    allowOutsideClick: false,
    background: "#1a1a2e",
    color: "#ffffff",
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeAlert = () => {
  Swal.close();
};
