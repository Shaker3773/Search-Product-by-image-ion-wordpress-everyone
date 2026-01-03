jQuery(function ($) {

  let searching = false;     // 🔒 block double search
  let ajaxReq   = null;      // 🔒 abort previous request
  let currentFile = null;

  const z  = $('#aiDropZone');
  const i  = document.getElementById('aiFileInput');
  const p  = $('#aiPreview');
  const ph = $('#aiPlaceholder');
  const r  = $('#aiRemove');
  const l  = $('#aiLoader');

  z.on('click', () => i.click());

  r.on('click', e => {
    e.stopPropagation();
    reset();
  });

  z.on('dragover', e => e.preventDefault());

  z.on('drop', e => {
    e.preventDefault();
    handle(e.originalEvent.dataTransfer.files[0]);
  });

  $('#aiFileInput').on('change', e => {
    handle(e.target.files[0]);
  });

  function handle(file) {
    if (!file || !file.type.startsWith('image/')) return;

    // 🔒 same file ignore
    if (currentFile && currentFile.name === file.name) return;
    currentFile = file;

    const reader = new FileReader();
    reader.onload = ev => {
      p.attr('src', ev.target.result).show();
      ph.text(file.name);
      r.show();
      search(file);
    };
    reader.readAsDataURL(file);
  }

  function search(file) {

    if (searching) return;
    searching = true;

    if (ajaxReq) {
      ajaxReq.abort();
      ajaxReq = null;
    }

    l.show();
    $('#aiModalGrid').empty();

    const data = new FormData();
    data.append('action', 'ai_img_search');
    data.append('image', file);

    ajaxReq = $.ajax({
      url: AI_IMG_SEARCH.ajax,
      type: 'POST',
      data: data,
      processData: false,
      contentType: false,

      success: function (res) {
        l.hide();
        searching = false;

        console.log('AJAX RESPONSE:', res);

        if (!res || !res.products || !res.products.length) {
          $('#aiModalGrid').html('<p class="ai-empty">No product found</p>');
          $('#aiResultModal').fadeIn(200);
          return;
        }

        res.products.forEach(item => {
          $('#aiModalGrid').append(`
            <div class="ai-item">
              <a href="${item.link}">
                <img src="${item.image}">
                <div class="ai-title">${item.title}</div>
              </a>
            </div>
          `);
        });

        $('#aiResultModal').fadeIn(200);
      },

      error: function () {
        searching = false;
        l.hide();
      }
    });
  }

  function reset() {
    currentFile = null;
    searching = false;

    if (ajaxReq) {
      ajaxReq.abort();
      ajaxReq = null;
    }

    p.hide().attr('src', '');
    ph.text('Drag your image or click here');
    r.hide();
    $('#aiModalGrid').empty();
    $('#aiResultModal').fadeOut(200);
    i.value = '';
  }

  $('#aiModalClose, .ai-modal-overlay').on('click', () => {
    $('#aiResultModal').fadeOut(200);
  });

});
