import Swal, { type SweetAlertOptions } from "sweetalert2";


// Wrap the supplied SVG path fragments in the shared 26px icon markup used by alert dialogs.
const glyph = (paths: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${paths}</svg>`;

// Renders the icons reusable UI component.
// Returns the styled JSX element.
const ICONS = {
  success: glyph('<path d="M20 6 9 17l-5-5"/>'),
  error: glyph('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  warning: glyph(
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'
  ),
} as const;

// Build the shared SweetAlert options, including pixel-theme classes and the danger confirmation style when requested.
const base = (danger = false) =>
  ({
    buttonsStyling: false,
    customClass: {
      container: "swal-pixel-container",
      popup: "swal-pixel-popup",
      icon: "swal-pixel-icon",
      title: "swal-pixel-title",
      htmlContainer: "swal-pixel-text",
      actions: "swal-pixel-actions",
      confirmButton: `swal-pixel-confirm${danger ? " swal-pixel-danger" : ""}`,
      cancelButton: "swal-pixel-cancel",
    },
  }) satisfies SweetAlertOptions;

// Helper function executing show success alert.
export const showSuccessAlert = (title: string, message: string) =>
  Swal.fire({  // Display SweetAlert2 confirmation or notification dialog
    ...base(),
    title,
    text: message,
    icon: "success",
    iconHtml: ICONS.success,
    confirmButtonText: "Onward",
  });

// Helper function executing show error alert.
export const showErrorAlert = (title: string, message: string) =>
  Swal.fire({  // Display SweetAlert2 confirmation or notification dialog
    ...base(),
    title,
    text: message,
    icon: "error",
    iconHtml: ICONS.error,
    confirmButtonText: "Try Again",
  });

// Show a warning SweetAlert with cancel and confirm actions, then return whether the user confirmed the operation.
export const showConfirmAlert = (
  title: string,
  message: string,
  confirmText: string = "Yes",
  cancelText: string = "Cancel"
) =>
  Swal.fire({  // Display SweetAlert2 confirmation or notification dialog
    ...base(true),
    title,
    text: message,
    icon: "warning",
    iconHtml: ICONS.warning,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    focusCancel: true,
  }).then((res) => res.isConfirmed);

// Open a warning textarea prompt for the ban reason and return the entered text, an empty string, or null when cancelled.
export const showBanReasonPrompt = (userName: string): Promise<string | null> => {
  const shell = base(true);
  return Swal.fire({  // Display SweetAlert2 confirmation or notification dialog
    ...shell,
    title: `Ban "${userName}"`,
    text: "This reason is shown to the player when they try to login. Leave blank for none.",
    input: "textarea",
    inputPlaceholder: "e.g. Cheating, harassment, …",
    inputAttributes: { maxlength: "500", "aria-label": "Ban reason" },
    customClass: { ...shell.customClass, input: "swal-pixel-input" },
    icon: "warning",
    iconHtml: ICONS.warning,
    showCancelButton: true,
    confirmButtonText: "Ban Account",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  }).then((res) => (res.isConfirmed ? (res.value ?? "") : null));
};
