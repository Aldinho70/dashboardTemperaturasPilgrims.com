$(document).ready(function () {
  const $sidebar = $('#sidebar');
  const $mainContent = $('#mainContent');
  const $toggleBtn = $('#toggleBtn');
  const $openBtn = $('#openBtn');

  $toggleBtn.on('click', function () {
    $sidebar.toggleClass('closed');
    $mainContent.toggleClass('expanded');

    const isClosed = $sidebar.hasClass('closed');
    $toggleBtn.html(isClosed 
      ? '<i class="bi bi-chevron-right"></i> Mostrar panel' 
      : '<i class="bi bi-chevron-left"></i> Ocultar panel');
    $openBtn.toggle(isClosed);
  });

  $openBtn.on('click', function () {
    $sidebar.removeClass('closed');
    $mainContent.removeClass('expanded');
    $toggleBtn.html('<i class="bi bi-chevron-left"></i> Ocultar panel');
    $openBtn.hide();
  });
});
