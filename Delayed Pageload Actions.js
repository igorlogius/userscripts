// ==UserScript==
// @name        Delayed Pageload Actions
// @namespace   Userscripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      igorlogius
// @description 9/6/2022, 8:11:26 AM
// ==/UserScript==
  
// Variables 
const current_url = window.location.href; 
const rules = new Map();
let re; 


// -- Begin Rules --

// !!! Add your rules here !!!  

// Example, clicking on a button and then navigating to the source of an image
rules.set('^https://www\.facebook\.com', 
  [
    {action: 'click', delay: 2000, selector: 'button[data-cookiebanner="accept_only_essential_button"]'},
    {action: 'image', delay: 3000, selector: '.fb_logo'}
  ]
);

// Example Rule, just clicking on a link
rules.set('^https://example\.net', 
  [
    {action: 'click', delay: 2000, selector: 'body > div:nth-child(1) > p:nth-child(3) > a:nth-child(1)' }
  ]
);



// -- End Rules --


// actions functions, can be easily extended

function clickAction(el) {
  if(typeof el.click === 'function') {  
            el.click();
  }
}

function imageAction(el){
  if(typeof el.src === 'string'){
    window.location = el.src; 
  }
}

// -- MAIN LOOP-- 
for(const [key, values] of rules) {
  console.log(key, current_url);
  re = new RegExp(key); 
  if(re.test(current_url)){
    console.debug('[DEBUG] match', key, current_url);
    for(const v of values){ 
      if(typeof v.delay === 'number' && v.delay > 0) {
        setTimeout(() => {  
          try {
            const el = document.querySelector(v.selector); 
            if(el && typeof v.action === 'string') {
              switch(v.action.toLowerCase()){
                case 'click': 
                  clickAction(el);
                  break;
                case 'image': 
                  imageAction(el);
                  break;
              }
            }
          }catch(e) {
            console.error(e);
          }
        }, v.delay);
      }
    } 
  }
}
