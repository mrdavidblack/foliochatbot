export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const query = url.search || '';

  const js = `
  (function(){
    if (document.getElementById('portfolio-chat-widget')) return;

    // Hover animation
    var style = document.createElement('style');
    style.textContent = [
      '#portfolio-chat-widget{transition:transform .18s ease,box-shadow .18s ease}',
      '#portfolio-chat-widget:hover{transform:translateY(-1px) scale(1.03);box-shadow:0 12px 28px rgba(0,0,0,.28)}'
    ].join('\\n');
    document.head.appendChild(style);

    // Launcher (closed state)
    const btn = document.createElement('button');
    btn.id = 'portfolio-chat-widget';
    btn.setAttribute('aria-label','Open chat');
    btn.title = 'Chat with DAVE:5000';
    btn.style.cssText = [
      'position:fixed',
      'right:16px',
      'bottom:16px',
      'min-height:56px',
      'padding:14px 22px',
      'border-radius:999px',
      'background:#040711',
      'color:#fff',
      'border:none',
      'box-shadow:0 8px 20px rgba(0,0,0,.25)',
      'cursor:pointer',
      'z-index:9999',
      'display:inline-flex',
      'align-items:center',
      'justify-content:center',
      'gap:12px',
      'font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'font-size:15px',
      'font-weight:500',
      'line-height:1'
    ].join(';');

    // Icon (HAL 9000 eye) with label
    btn.innerHTML = [
      '<span style="color:#f5f7ff;white-space:nowrap;">Chat to me</span>',
      '<span style="display:inline-flex;width:32px;height:32px;align-items:center;justify-content:center"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" fill="#1a1a1a" stroke="#666" stroke-width="1"/><circle cx="16" cy="16" r="10" fill="#cc0000"/><circle cx="16" cy="16" r="6" fill="#ff3333"/><circle cx="18" cy="14" r="2" fill="#ff6666" opacity="0.8"/></svg></span>'
    ].join('');

    // Panel (open state)
    const frame = document.createElement('iframe');
    frame.src = '${origin}/chat-widget' + '${query}';
    frame.setAttribute('title','DAVE:5000');
    frame.style.cssText = [
      'position:fixed',
      'right:16px',
      'bottom:84px',
      'width:360px',
      'max-width:calc(100vw - 32px)',
      'height:540px',
      'background:#0c0f19',
      'border:1px solid #727b95',
      'border-radius:16px',
      'overflow:hidden',
      'box-shadow:0 12px 32px rgba(0,0,0,.3)',
      'display:none',
      'z-index:9999'
    ].join(';');

    btn.addEventListener('click', function(){
      frame.style.display = (frame.style.display === 'none') ? 'block' : 'none';
      frame.style.border = '1px solid #727b95';
    });

    // Listen for close message from iframe
    window.addEventListener('message', function(e){
      if (e.data && e.data.type === 'CLOSE_CHAT_WIDGET') {
        frame.style.display = 'none';
      }
    });

    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && frame.style.display === 'block') frame.style.display = 'none';
    });

    document.body.appendChild(btn);
    document.body.appendChild(frame);
  })();`;

  return new Response(js, { headers: { 'content-type': 'application/javascript' } });
}
