"use client";
/* ==========  frontend/lib/alerts/appAlert.ts  ===============*/

import Swal, { type SweetAlertIcon } from "sweetalert2";

/* ==========  Function buildAlertHtml builds reusable custom modal markup for SweetAlert2 alerts.  ===============*/
function buildAlertHtml(title: string, description?: string) {
  return `
    <div class="ibos-alert-content">
      <h3 class="ibos-alert-title">${title}</h3>
      ${description ? `<p class="ibos-alert-description">${description}</p>` : ""}
    </div>
  `;
}

/* ==========  Function showCustomAlert shows the base custom modal with shared styling and buttons.  ===============*/
export async function showCustomAlert(params: {
  title: string;
  description?: string;
  icon?: SweetAlertIcon;
  confirmText?: string;
  showCancel?: boolean;
  cancelText?: string;
}) {
  const {
    title,
    description,
    icon = "info",
    confirmText = "OK",
    showCancel = false,
    cancelText = "Cancel",
  } = params;

  return Swal.fire({
    icon,
    title: "",
    html: buildAlertHtml(title, description),
    showCancelButton: showCancel,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      popup: "ibos-alert-modal",
      confirmButton: "ibos-alert-confirm",
      cancelButton: "ibos-alert-cancel",
    },
    buttonsStyling: false,
  });
}

/* ==========  Function showTaskSuccess shows a success notification after completing any task.  ===============*/
export async function showTaskSuccess(task: string, description?: string) {
  return showCustomAlert({
    title: `${task} successful`,
    description,
    icon: "success",
    confirmText: "Continue",
  });
}

/* ==========  Function showTaskError shows a failure notification with task specific details.  ===============*/
export async function showTaskError(task: string, description?: string) {
  return showCustomAlert({
    title: `${task} failed`,
    description: description || "Please try again.",
    icon: "error",
    confirmText: "Try again",
  });
}

/* ==========  Function showTaskInfo shows an informational notification for non-error actions.  ===============*/
export async function showTaskInfo(title: string, description?: string) {
  return showCustomAlert({
    title,
    description,
    icon: "info",
    confirmText: "Okay",
  });
}

/* ==========  Function showSessionExpiredAlert warns the user when token refresh fails or session ends.  ===============*/
export async function showSessionExpiredAlert() {
  return showCustomAlert({
    title: "Session expired",
    description: "Please login again to continue your tasks.",
    icon: "warning",
    confirmText: "Login again",
  });
}
