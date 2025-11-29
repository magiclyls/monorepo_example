// 初始化FB
export function initFacebook(id) {
  const tem = `
    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${id}');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->
  `
  addDom({ str: tem, className: 'facebook-class-name' })
  console.log('window.fbq', window.fbq)
  // setInterval(() => {
  //   if (window.fbq) {
  //     window.fbq('track', 'InitiateCheckout');
  //     window.fbq('track', 'login');
  //     window.fbq('track', 'register');
  //     window.fbq('track', 'promo');
  //   }
  // }, 3 * 1000)
}

export function addDom(map) {
  const div = document.createElement('div')
  div.className = map.className
  div.style.width = '0px'
  div.style.height = '0px'
  div.style.display = 'none'
  document.body.appendChild(div)
  const range = document.createRange()
  range.selectNode(div)
  const doc = range.createContextualFragment(map.str)
  div.appendChild(doc)
}

export function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2)
    return parts.pop().split(';').shift()
}
