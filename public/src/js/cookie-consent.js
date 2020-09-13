window.cookieconsent.initialise({
  container: document.getElementById("cookieconsent"),
  palette:{
   popup: {background: '#223e56', text: '#fff', link: '#fff'},
   button: {background: "#e0e0e0"},
  },
  revokable: true,
  onStatusChange: function(status) {
   console.log(this.hasConsented() ?
    'enable cookies' : 'disable cookies');
  },
  "position": "bottom",
  "theme": "classic",
  "domain": "https://i71n4.csb.app/",
  "secure": true,
  "content": {
    "header": 'Cookies used on the website!',
    "message": 'We use cookies to provide you with a great experience and to help our website run effectively.',
    "dismiss": 'Got it!',
    "allow": 'Allow cookies',
    "deny": 'Decline',
    "link": 'Read more about our policy for cookies here.',
    "href": 'http://localhost:3000/policy',
    "close": '&#x274c;',
    "policy": 'Cookie Policy',
    "target": '_blank',
    }
 });