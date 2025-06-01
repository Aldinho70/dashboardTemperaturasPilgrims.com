export const htmlCreateNotification = (event) => {
  let _notifications = []
  let data = event.getData(); // get data from event
  
  if (data.tp && data.tp == "unm") {
    $("#root-notification-nobody").hide();
    _notifications.push(data)
   $("#notif-count").text(_notifications.length)

    $(".root-notification").append(
      `<div class="toast show w-100 border-0 shadow-sm bg-white" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header bg-warning text-white rounded-top">
            <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
            <strong class="me-auto">${data.name}</strong>
            <small class="text-light">Justo ahora</small>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body text-secondary fw-semibold">
            <span class="text-dark">${data.txt}</span>
          </div>
        </div>`)
  }
}

export function htmlCreateModalNotifications(event) {

}