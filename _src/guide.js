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
(function(){
  var b=document.body,side=document.getElementById('side'),crumb=document.getElementById('crumb');
  var scrim=document.createElement('div');scrim.className='scrim';b.appendChild(scrim);
  document.getElementById('menu').onclick=function(){b.classList.toggle('menu')};
  scrim.onclick=function(){b.classList.remove('menu')};
  side.addEventListener('click',function(e){if(e.target.closest('a'))b.classList.remove('menu')});
  var secs=[].slice.call(document.querySelectorAll('.slide[id]'));
  var links={};[].slice.call(side.querySelectorAll('a[href^="#"]')).forEach(function(a){links[a.getAttribute('href').slice(1)]=a});
  var chapOf={},cur='partA';secs.forEach(function(s){if(s.classList.contains('chapter'))cur=s.id;chapOf[s.id]=/^s\d/.test(s.id)?cur:s.id});
  var last=null;
  function spy(){
    if(b.classList.contains('present'))return;
    var y=window.scrollY+110,id=secs[0].id;
    for(var i=0;i<secs.length;i++){if(secs[i].offsetTop<=y)id=secs[i].id;else break}
    if(id===last)return;last=id;
    side.querySelectorAll('.on').forEach(function(e){e.classList.remove('on')});
    var a=links[id];if(a){a.classList.add('on');var g=a.closest('.grp');if(g)g.classList.add('on')}
    var ch=links[chapOf[id]];if(ch){var g2=ch.closest('.grp');if(g2)g2.classList.add('on')}
    var h=document.getElementById(id).querySelector('h2,h1');
    crumb.textContent=id==='top'?'פתיחה':(h?h.textContent:'');
    if(a&&a.scrollIntoView&&side.querySelector('.side-nav').scrollHeight>side.clientHeight)a.scrollIntoView({block:'nearest'});
  }
  window.addEventListener('scroll',spy,{passive:true});spy();
})();
