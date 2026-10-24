(function(){
  var slides=[].slice.call(document.querySelectorAll('.slide')),i=0;
  var b=document.body,cnt=document.getElementById('pcount');
  function show(n){i=Math.max(0,Math.min(slides.length-1,n));slides.forEach(function(s,k){s.classList.toggle('on',k===i)});cnt.textContent=(i+1)+' / '+slides.length;window.scrollTo(0,0);history.replaceState(null,'','#'+(slides[i].id||''))}
  function enter(){b.classList.add('present');var h=location.hash.slice(1),k=slides.findIndex(function(s){return s.id===h});show(k<0?0:k)}
  function exit(){b.classList.remove('present');slides.forEach(function(s){s.classList.remove('on')});var s=slides[i];if(s)s.scrollIntoView()}
  document.getElementById('pres').onclick=enter;
  document.getElementById('pexit').onclick=exit;
  document.getElementById('pnext').onclick=function(){show(i+1)};
  document.getElementById('pprev').onclick=function(){show(i-1)};
  document.addEventListener('keydown',function(e){
    if(!b.classList.contains('present')){if(e.key==='p'&&!e.ctrlKey&&!e.metaKey)enter();return}
    if(['ArrowLeft','PageDown',' '].indexOf(e.key)>=0){e.preventDefault();show(i+1)}
    else if(['ArrowRight','PageUp'].indexOf(e.key)>=0){e.preventDefault();show(i-1)}
    else if(e.key==='Escape')exit();
    else if(e.key==='Home')show(0);else if(e.key==='End')show(slides.length-1);
  });
  if(/[?&]present\b/.test(location.search))enter();
})();
