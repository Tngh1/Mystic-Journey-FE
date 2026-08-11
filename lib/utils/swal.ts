import Swal, { type SweetAlertOptions } from "sweetalert2";

/* The app's dialog box, as a carved wooden plank rather than SweetAlert's
   default white card.
 *
 * Everything visual now lives in `components/css/swal.css`, keyed off the
 * `swal-pixel-*` classes below. This file used to set `background: "#18181b"`,
 * `confirmButtonColor: "#ffc032"` and `popup: "rounded-2xl"` on every call —
 * three raw hexes the design system forbids, a colour that duplicated
 * `--color-accent`, and a radius the global reset then had to fight. Colours
 * belong to the tokens; this module only decides *which* dialog is being shown.
 */

/* Lucide glyphs as markup, since `iconHtml` takes a string and cannot take a
   React element. Same four icons the components import, hand-inlined: Check,
   X, TriangleAlert, Info. Stroke geometry copied verbatim from the package so
   they stay identical to the rest of the UI. */
const glyph = (paths: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${paths}</svg>`;

const ICONS = {
  success: glyph('<path d="M20 6 9 17l-5-5"/>'),
  error: glyph('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  warning: glyph(
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'
  ),
} as const;

/* Shared shell. `buttonsStyling: false` hands the buttons to our own CSS —
   otherwise the library writes inline background-color from
   confirmButtonColor and wins on specificity. */
/* `satisfies` thay vì annotate: vẫn kiểm tra kiểu, nhưng giữ kiểu suy ra đủ hẹp
   để spread được vào dialog có `input` (SweetAlertOptions là union theo loại
   input, nên spread giá trị đã annotate sẽ vỡ ở nhánh inputValidator). */
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

export const showSuccessAlert = (title: string, message: string) =>
  Swal.fire({
    ...base(),
    title,
    text: message,
    icon: "success",
    iconHtml: ICONS.success,
    confirmButtonText: "Onward",
  });

export const showErrorAlert = (title: string, message: string) =>
  Swal.fire({
    ...base(),
    title,
    text: message,
    icon: "error",
    iconHtml: ICONS.error,
    confirmButtonText: "Try Again",
  });

export const showConfirmAlert = (
  title: string,
  message: string,
  confirmText: string = "Yes",
  cancelText: string = "Cancel"
) =>
  Swal.fire({
    /* Destructive confirms wear crimson, not the gold reserved for "act on
       this" — and the button keeps its explicit verb, so the meaning is never
       carried by colour alone. */
    ...base(true),
    title,
    text: message,
    icon: "warning",
    iconHtml: ICONS.warning,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    /* Cancel first: the safe choice sits where the eye lands, and Escape or an
       outside click already resolves to it. */
    reverseButtons: true,
    focusCancel: true,
  }).then((res) => res.isConfirmed);

/* Prompt nhập lý do ban — trả về lý do (có thể rỗng) hoặc null nếu huỷ.
   Lý do này người chơi sẽ đọc được khi đăng nhập, nên nó là nội dung đối mặt
   người dùng, không phải ghi chú nội bộ. */
export const showBanReasonPrompt = (userName: string): Promise<string | null> => {
  const shell = base(true);
  return Swal.fire({
    ...shell,
    title: `Ban "${userName}"`,
    text: "This reason is shown to the player when they try to log in. Leave blank for none.",
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
