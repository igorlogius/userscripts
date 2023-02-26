    // ==UserScript==
    // @name        Inline Reddit Preview Images
    // @namespace   Violentmonkey Scripts
    // @match       *://old.reddit.com/*
    // @match       *://new.reddit.com/*
    // @match       *://www.reddit.com/*
    // @grant       none
    // @version     1.0
    // @author      igorlogius
    // @description 2/20/2023, 12:10:58 PM
    // ==/UserScript==

    let timerID;

    function onChange(){

      let tmp;
      let all_anchors = Array.from(document.querySelectorAll('a[href^="https://preview.redd.it/"]'));
      let all_img_srcs = Array.from(document.querySelectorAll('img[src^="https://preview.redd.it/"]')).map( i => { tmp = new URL(i.src); tmp = tmp.origin + tmp.pathname; return tmp;});

      for(let a of all_anchors){
          tmp = new URL(a.href);
          tmp = tmp.origin + tmp.pathname;

          if(!all_img_srcs.includes(tmp)){
              // link to preview.reddit.com not yet visible
              // so we add/append a image with the source
              let img = document.createElement('img');
              img.src = a.href;
              img.classList.add('preview'); // reddit specific
              a.prepend(img); // to place image before the anchor
              //a.appendChild(img); // to place image after the anchor
          }
      }
    }

    // if we have many mution events, wait until the site has settled
    function delayed_onChange(){
        clearTimeout(timerID);
        timerID = setTimeout(onChange, 500);
    }

    function init() {
        // start observer
        (new MutationObserver(delayed_onChange)).observe(document.body, { attributes: false, childList: true, subtree: true });
        delayed_onChange();
    }

    setTimeout(init, 500);
