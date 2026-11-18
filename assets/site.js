/* NEW M METAFORA – wersja 2 (bez bibliotek, bez efektów)
   Widoki po #hash: start, prace[/dziedzina[/typ]], indeks[/dziedzina], (stare: projekty, domy… → przekierowanie),
   o-nas, proces, woodgood, zespol, media, filmy, kontakt, p-<id> (podstrona projektu). */
(function(){
"use strict";
const $=s=>document.querySelector(s);
const P=(window.PROJEKTY||[]).filter(p=>!p.x);   // x:1 = projekt ukryty (czeka na opracowanie)
const pad=n=>String(n).padStart(2,"0");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nb=s=>esc(s).replace(/(^|[\s(„])([aiouwzAIOUWZ])\s+(?=\S)/g,"$1$2\u00a0").replace(/(^|[\s(„])([aiouwzAIOUWZ])\s+(?=\S)/g,"$1$2\u00a0").replace(/(^|\s)(ul\.|ok\.|nr|art\.|ust\.|lit\.|np\.|tzw\.)\s+/g,"$1$2\u00a0").replace(/\s+–/g,"\u00a0–");
const plN=(n,a,b,c)=>n===1?a:(n%10>=2&&n%10<=4&&(n%100<12||n%100>14))?b:c;   // twarde spacje po spójnikach
const ver=p=>p.v?"?v="+p.v:"";
const yr=p=>{const m=String(p.y||"").match(/\d{4}/g);return m?+m[m.length-1]:0};

/* ═══ DZIEDZINY I TYPY – JEDNO MIEJSCE DO ZMIAN (menu wg UX: PRACE · INDEKS · STUDIO · KONTAKT) ═══
   Każda praca ma jeden typ (pole "t2" w danych albo przypisanie z kategorii GALERII poniżej),
   typ należy do jednej dziedziny. Dziedziny i typy bez prac są ukryte – pojawią się same po dodaniu prac. */
const DZ=[["architektura","Architektura"],["wnetrza","Wnętrza"],["design","Design"],["grafika","Grafika"],["sztuka","Sztuka"]];
const TY=[["domy","architektura","Domy"],["mieszkaniowe","architektura","Mieszkaniowe"],["przemysl","architektura","Przemysł i usługi"],
  ["mieszkalne","wnetrza","Mieszkalne"],["hotelowe","wnetrza","Hotelowe"],["biura","wnetrza","Biura i komercja"],
  ["meble","design","Meble"],["oswietlenie","design","Oświetlenie"],["produkt","design","Produkt"],
  ["identyfikacja","grafika","Identyfikacja wizualna"],["plakat","grafika","Plakat"],["druk","grafika","Druk reklamowy"],
  ["malarstwo","sztuka","Malarstwo"],["fotografia","sztuka","Fotografia"],["scenografia","sztuka","Scenografia"]];
const Z_KAT={domy:"domy",mieszkaniowe:"mieszkaniowe",hotele:"hotelowe",komercyjne:"przemysl",wnetrza:"mieszkalne",scena:"scenografia"};
P.forEach(p=>{
  let t=p.t2||Z_KAT[p.k];
  if(!t&&p.k==="design")t=/fotel|krzes|stol|mebel|sofa|regal/.test(p.s)?"meble":/lamp|swiat|oswiet/.test(p.s)?"oswietlenie":"produkt";
  const y=TY.find(x=>x[0]===t)||TY[0];p.T=y[0];p.D=y[1];
});
const DN=Object.fromEntries(DZ),TN=Object.fromEntries(TY.map(x=>[x[0],x[2]]));
/* nazwa typu przy pojedynczej pracy (kafel, Indeks); filtry zostają w liczbie mnogiej */
const TS={domy:"Dom",mieszkaniowe:"Zabudowa mieszkaniowa",przemysl:"Obiekt usługowy",mieszkalne:"Wnętrze mieszkalne",hotelowe:"Wnętrze hotelowe",biura:"Biuro",meble:"Mebel",oswietlenie:"Oświetlenie",produkt:"Produkt",plakat:"Plakat"},TNs=t=>TS[t]||TN[t];
const ofD=d=>P.filter(p=>p.D===d),ofT=t=>P.filter(p=>p.T===t);
const DZA=DZ.filter(([d])=>ofD(d).length);                                         // dziedziny z pracami
const TYA=d=>TY.filter(x=>x[1]===d&&ofT(x[0]).length);                              // typy z pracami w dziedzinie
const KN=TN;                                                                        // zgodność: nazwa typu

/* ───── menu: PRACE · INDEKS · STUDIO · KONTAKT ───── */
const MENU=[
  {t:"Prace",h:"prace",o:DZA.map(([d,n])=>["prace/"+d,n])},
  {t:"Indeks",h:"indeks"},
  {t:"Studio",h:"o-nas",o:[["o-nas","Pracownia"],["proces","Proces"],["zespol","Zespół"],["woodgood","WoodGood"],["media","Media"],["filmy","Filmy"]]},
  {t:"Kontakt",h:"kontakt"}];
$("#nav").innerHTML="<ul>"+MENU.map(m=>`<li><a href="#${m.h}" data-g="${m.h}">${m.t}</a>${m.o?`<ul class="sub">${m.o.map(([h,t])=>`<li><a href="#${h}" data-h="${h}">${t}</a></li>`).join("")}</ul>`:""}</li>`).join("")+"</ul>";
$("#mnavL").innerHTML=MENU.map((m,i)=>`<div class="grp"><div class="row"><a href="#${m.h}">${m.t}</a>${m.o?`<button type="button" aria-expanded="false" aria-controls="mo${i}" aria-label="Pokaż opcje: ${m.t}">+</button>`:""}</div>${m.o?`<div class="opts" id="mo${i}" hidden>${m.o.map(([h,t])=>`<a href="#${h}">${t}</a>`).join("")}</div>`:""}</div>`).join("");
$("#mnavL").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const o=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",String(!o));b.textContent=o?"+":"–";document.getElementById(b.getAttribute("aria-controls")).hidden=o});
const mnav=$("#mnav"),mb=$("#menuB");
const inertBg=o=>document.querySelectorAll("#hdr,main#main,footer.foot").forEach(e=>{if(o)e.setAttribute("inert","");else e.removeAttribute("inert")});
const setMenu=o=>{mnav.hidden=!o;mb.setAttribute("aria-expanded",String(o));document.body.style.overflow=o?"hidden":"";inertBg(o);if(o)$("#menuX").focus()};
mb.addEventListener("click",()=>setMenu(true));$("#menuX").addEventListener("click",()=>{setMenu(false);mb.focus()});
mnav.addEventListener("click",e=>{if(e.target.closest("a"))setMenu(false)});

/* stopka: Prace · Studio · Kontakt */
$("#footG").innerHTML=`<a class="logo" href="#start" aria-label="Metafora Architekci – strona główna"><img loading="lazy" src="img/logo-grafit.png" width="600" height="447" alt="Metafora Architekci"></a>
<div><h2>Prace</h2><ul>${DZA.map(([d,n])=>`<li><a href="#prace/${d}">${n}</a></li>`).join("")}<li><a href="#indeks">Indeks</a></li></ul></div>
<div><h2>Studio</h2><ul><li><a href="#o-nas">Pracownia</a></li><li><a href="#zespol">Zespół</a></li><li><a href="#proces">Proces</a></li><li><a href="#media">Media</a></li><li><a href="#kontakt">Kontakt</a></li></ul></div>
<div><h2>Kontakt</h2><ul><li><a href="tel:+48606355220">+48 606 355 220</a></li><li><a href="mailto:biuro@metaforaarchitekci.pl">biuro@metaforaarchitekci.pl</a></li><li>ul. Legnicka 55/10<br>54-203 Wrocław</li></ul></div>`;

/* ───── elementy wspólne ───── */
/* status obrazów projektu (uczciwość przekazu): pole st w danych */
/* status budynku: pole st – proj = projekt, real = realizacja */
const ST={proj:"Projekt",real:"Realizacja"};
/* linia pod tytułem: pierwszy człon (typ) prowadzi do kategorii, reszta to zwykły tekst */
const catHref=p=>"#prace/"+p.D+(TYA(p.D).length>1?"/"+p.T:"");
const metaOf=p=>[TN[p.T]?`<a class="cat" href="${catHref(p)}">${esc(TNs(p.T))}</a>`:esc(p.typ||""),...[p.w||p.kl,p.y,ST[p.st]].map(x=>x?esc(x):"")].filter(Boolean).join("<i>|</i>");
/* rodzaj obrazu (podpis w prawym dolnym rogu ekranu przy najechaniu na zdjęcie):
   pole im = domyślny rodzaj dla projektu, imx = wyjątki {numer pliku: rodzaj} */
const IMT={w:"wizualizacja",wa:"wizualizacja · retusz AI",f:"fotografia",fa:"fotografia · retusz AI"};
/* srcset: mniejsze wersje WebP (tools/warianty.py); w podglądzie wyłączone, na serwerze włączone przez build */
const SRCSET=true;
const SSW={g:[800,1200],h:[800,1200,1800],t:[600,1000]},SSJ={g:1800,h:2560,t:1400};
function ss(base,k,v,sz){if(!SRCSET)return "";return ` srcset="${SSW[k].map(w=>`${base}-${w}.webp${v} ${w}w`).join(", ")}, ${base}.jpg${v} ${SSJ[k]}w" sizes="${sz}"`}
const altKind=(p,n)=>({w:"wizualizacja",wa:"wizualizacja",f:"zdjęcie realizacji",fa:"zdjęcie realizacji"})[(p.imx&&p.imx[n])||p.im]||"ryc.";
function imgKind(src){
  const m=/p\/([^/]+)\/(\d+|t)(?:-\d+)?\.(?:jpg|webp)/.exec(src||"");if(!m)return "";
  const p=(window.PROJEKTY||[]).find(x=>x.s===m[1]);if(!p)return "";
  const n=m[2]==="t"?p.img[0][0]:+m[2];
  if((p.pl||[]).some(x=>x[0]===n))return "";
  const k=(p.imx&&p.imx[n])||p.im;return IMT[k]||"";
}
const tile=(p,w)=>`<div class="tile${w?" w":""}"><a class="tile-a" href="#p-${p.s}"><span class="tile-ph"><img loading="lazy" decoding="async" src="p/${p.s}/t.jpg${ver(p)}"${ss("p/"+p.s+"/t","t",ver(p),w?"(max-width:700px) 100vw, 66vw":"(max-width:700px) 100vw, (max-width:1000px) 50vw, 34vw")} alt="" width="1400" height="1050"></span><span class="ttl">${esc(p.t)}</span>${p.d?`<span class="d">${nb(p.d)}</span>`:""}</a><span class="meta">${metaOf(p)}</span></div>`;
/* rzędy jak u Norm: 3 projekty (szeroki + 2 wąskie, kolejność się zmienia) albo 2 szerokie */
/* każda galeria: do prawej krawędzi ekranu, z lewej wąski pasek z hasłem */
const TAG=`<b>In</b> love <b>with</b> life <b>in</b> architecture`;
const blg=(g,c)=>`<div class="bl-r"><aside class="bl-s" aria-hidden="true"><span class="vtag">${TAG}</span></aside><div class="bl-c${c?" "+c:""}">${g}</div></div>`;
function mix(list,start){
  const n=list.length,rows=[];let r3=Math.floor(n/3),rest=n%3,r2=0;
  if(rest===1){if(r3>0){r3--;r2=2}else r2=0}else if(rest===2)r2=1;
  let i=0,k=start||0;
  for(let a=0;a<r3;a++){const pat=[[1,0,0],[0,0,1],[0,1,0]][k++%3],grp=list.slice(i,i+3);i+=3;
    // pionowa okładka nie trafia do szerokiego kadru – zamiana w obrębie rzędu
    const wi=pat.indexOf(1),pr=x=>(x.img[0]||[0,1.5])[1];
    if(pr(grp[wi])<1){const j=[0,1,2].find(q=>q!==wi&&pr(grp[q])>=1);if(j!==undefined)[grp[wi],grp[j]]=[grp[j],grp[wi]]}
    rows.push(pat.map((w,q)=>tile(grp[q],w)).join(""))}
  for(let a=0;a<r2;a++)rows.push(tile(list[i++],1)+tile(list[i++],1));
  if(i<n)rows.push(tile(list[i++],1));
  return blg(`<div class="grid mix">${rows.join("")}</div>`);
}
const head=(t,p)=>`<div class="pg-h"><h1>${t}</h1>${p?`<p>${p}</p>`:""}</div>`;
const ratio=(s,n)=>{const p=P.find(x=>x.s===s),i=p&&p.img.find(x=>x[0]===n);return i?i[1]:1.5};
const byYear=[...P].sort((a,b)=>yr(b)-yr(a));

/* ───── widoki ───── */
const V={};
/* galeria na stronie głównej: do prawej krawędzi ekranu, z lewej wąski pasek z hasłem */
const bl=(t,g,m)=>`<section class="sec bl"><h2 class="sec-t">${t}</h2>${g}<p class="sec-m">${m}</p></section>`;
V.start=()=>{
  /* zdjęcie frontowe: losowo spośród wszystkich projektów na stronie (okładka A_ w GALERII) z Architektury i Wnętrz,
     z poziomą okładką; przy każdym wejściu inne niż poprzednio */
  const pool=P.filter(p=>(p.D==="architektura"||p.D==="wnetrza")&&p.img&&p.img[0]&&p.img[0][1]>=1.3);
  let f=pool[Math.floor(Math.random()*pool.length)];
  try{const last=localStorage.getItem("mf-hero");if(pool.length>1&&f&&f.s===last){const o=pool.filter(p=>p.s!==last);f=o[Math.floor(Math.random()*o.length)]}if(f)localStorage.setItem("mf-hero",f.s)}catch(_){}
  if(!f)f=byYear.find(p=>p.img&&p.img[0]&&p.img[0][1]>=1.3)||byYear[0];
  const shown=new Set([f.s]);
  const newest=byYear.filter(p=>p.s!==f.s).slice(0,3);newest.forEach(p=>shown.add(p.s));
  let h=`<section class="hero" aria-label="Najnowszy projekt"><a href="#p-${f.s}" tabindex="-1" aria-hidden="true"><img src="p/${f.s}/${pad(f.img[0][0])}.jpg${ver(f)}"${ss("p/"+f.s+"/"+pad(f.img[0][0]),"h",ver(f),"100vw")} alt="" fetchpriority="high"></a>
  <div class="hero-s"><p class="k">Wdzięczni Bogu, kochając życie</p><h1>Projektujemy architekturę<br>w&nbsp;której się po prostu <span class="nw">„dobrze żyje”</span></h1><p class="l">Dbając o&nbsp;relacje między ludźmi w&nbsp;przestrzeni, projektujemy domy, wnętrza, hotele, budynki mieszkalne i&nbsp;usługowe, scenografie i&nbsp;produkt. Dotykamy krajobrazu, bryły i&nbsp;detalu, optyki i&nbsp;haptyki doświadczenia.</p></div>
  <div class="hero-t"><span class="lbl">Wybrany projekt</span><h2 class="ttl"><a href="#p-${f.s}">${esc(f.t)}</a></h2><p class="meta">${metaOf(f)}</p><a class="more" href="#p-${f.s}">Zobacz projekt</a></div></section>`;
  h+=bl("Najnowsze",mix(newest,0),`<a class="more" href="#prace">Wszystkie prace</a>`);
  /* sekcja „Witamy” – treść przeniesiona na pierwszy ekran (18.11.2026) */
  h+=`<section class="dz-strip" aria-label="Dziedziny"><span class="lbl">Co projektujemy</span><ul>${DZA.map(([d,n])=>`<li><a href="#prace/${d}"><span class="ttl">${n}</span><span class="n">${ofD(d).length}</span></a></li>`).join("")}</ul><a class="more" href="#indeks">Indeks wszystkich prac (${P.length})</a></section>`;
  let si=0;
  DZA.forEach(([d,n])=>{
    const all=ofD(d),list=all.filter(p=>!shown.has(p.s)).slice(0,3);
    if(!list.length)return;
    h+=bl(n,list.length===3?mix(list,++si):mix(list,0),`<a class="more" href="#prace/${d}">${n}: wszystkie prace (${all.length})</a>`);
  });
  return h;
};
/* filtry jak u Norm: rząd dziedzin, pod nim typy wybranej dziedziny */
function chips(base,d,t){
  let h=`<nav class="flt" aria-label="Filtr prac"><ul>`+[["",`Wszystkie`,P.length],...DZA.map(([k,n])=>[k,n,ofD(k).length])].map(([k,n,c])=>`<li><a href="#${base}${k?"/"+k:""}"${(d||"")===k?' aria-current="true"':""}>${n}<sup>${c}</sup></a></li>`).join("")+`</ul>`;
  if(d){const ty=TYA(d);if(ty.length>1)h+=`<ul class="t2">`+[["","Wszystkie",ofD(d).length],...ty.map(([k,,n])=>[k,n,ofT(k).length])].map(([k,n,c])=>`<li><a href="#${base}/${d}${k?"/"+k:""}"${(t||"")===k?' aria-current="true"':""}>${n}<sup>${c}</sup></a></li>`).join("")+`</ul>`}
  return h+`</nav>`;
}
function prace(d,t){
  if(d&&!DN[d])d="";if(t&&!(TN[t]&&TY.find(x=>x[0]===t)[1]===d))t="";
  const list=t?ofT(t):d?ofD(d):DZA.flatMap(([k])=>ofD(k));
  return head(d?DN[d]:"Prace")+chips("prace",d,t)+(list.length?mix(list,0):`<p class="empty">Wkrótce.</p>`);
}
function indeks(d,t){
  if(d&&!DN[d])d="";if(t&&!(d&&TN[t]&&TY.find(x=>x[0]===t)[1]===d))t="";
  const grp=(d?DZA.filter(x=>x[0]===d):DZA).map(([k,n])=>{
    const l=(t?ofT(t):ofD(k)).sort((a,b)=>TY.findIndex(x=>x[0]===a.T)-TY.findIndex(x=>x[0]===b.T)||yr(b)-yr(a));
    return `<section class="ix-g"><h2 class="ix-h"><span class="ttl">${n}</span><span class="n">${l.length}</span></h2><ol class="ix">${l.map(p=>`<li><a href="#p-${p.s}" data-th="p/${p.s}/${SRCSET?"t-600.webp":"t.jpg"}${ver(p)}"><span class="ix-t">${esc(p.t)}</span><span class="ix-k">${esc(TNs(p.T))}</span><span class="ix-w">${esc(p.w||"")}</span><span class="ix-y">${esc(p.y||"")}</span></a></li>`).join("")}</ol></section>`}).join("");
  return head("Indeks",`Wszystkie prace w&nbsp;jednym miejscu – ${P.length}&nbsp;${plN(P.length,"pozycja","pozycje","pozycji")}.`)+chips("indeks",d,t)+`<div class="ix-w8">${grp}</div><img class="ix-pv" id="ixPv" alt="" hidden>`;
}
V.prace=()=>prace("","");V.indeks=()=>indeks("");
/* stare adresy (#projekty, #domy, #hotele…) prowadzą do nowych */
const OLD={projekty:"prace",design:"prace/design",scena:"prace/sztuka/scenografia"};
/* PRA-16: stare adresy projektów z oznaczeniami klientów */
Object.assign(OLD,{"p-dom-anik-pod-sleza":"p-dom-sleza","p-dom-clt-probono-czerna":"p-dom-czerna","p-dom-ostrow-p":"p-dom-ostrow","p-dom-wilczyce-r":"p-dom-wilczyce","p-dom-mati-z-pergola":"p-dom-z-pergola"});
Object.entries(Z_KAT).forEach(([k,t])=>{const y=TY.find(x=>x[0]===t);OLD[k]="prace/"+y[1]+"/"+t});
OLD.wnetrza="prace/wnetrza";
/* pusty typ albo dziedzina → poziom wyżej */
Object.keys(OLD).forEach(k=>{let s=OLD[k].split("/");if(s[2]&&!ofT(s[2]).length)OLD[k]="prace/"+s[1];s=OLD[k].split("/");if(s[1]&&!ofD(s[1]).length)OLD[k]="prace"});

V["o-nas"]=()=>head("Pracownia")+`<p class="statement">Architektura to przede wszystkim relacje – między ludźmi oraz między człowiekiem a&nbsp;przestrzenią.</p>
<div class="about">
  <figure class="f1"><img loading="lazy" src="img/o-nas/relacje.jpg" width="1050" height="1400" alt="Grzegorz i Hanna Kłopoccy z zespołu Metafory"><figcaption>Od spotkania zaczyna się każdy projekt</figcaption></figure>
  <div class="t1">
    <p>Każdy z&nbsp;nas ma za sobą lata samodzielnej praktyki architektonicznej – najdłuższa sięga 1997 roku. W&nbsp;2026 roku założyliśmy pracownię METAFORA ARCHITEKCI, w&nbsp;której pracujemy razem, w&nbsp;dojrzale dobranym zespole. Projektujemy dla Ciebie po prostu dobrą architekturę.</p>
    <p>Mówi się, że architekturę kupujemy oczami. Tak naprawdę kupujemy jednak dobre samopoczucie – nasze wyobrażenie, jak będziemy się czuć w&nbsp;tej przestrzeni. Bez człowieka, który dobrze się w&nbsp;niej czuje, nawet najpiękniejsza forma traci sens. A&nbsp;człowiek potrzebuje drugiego człowieka.</p>
    <p>Dlatego projektujemy przede wszystkim domy i&nbsp;wnętrza mieszkalne – tam potrzeby ludzi widać najwyraźniej. To, czego się o&nbsp;nich uczymy, przenosimy na hotele i&nbsp;obiekty usługowe.</p>
    <p>W&nbsp;każdym projekcie dbamy o&nbsp;zdrowie użytkowników i&nbsp;o&nbsp;ich środowisko. Kochamy drewno i&nbsp;wierzymy, że to jeden z&nbsp;najlepszych materiałów budowlanych. Świadomie specjalizujemy się w&nbsp;budynkach z&nbsp;drewna klejonego krzyżowo (CLT).</p>
    <p>Wokół siebie mamy dobrych ludzi: przyjaciół, kolegów, sprawdzonych specjalistów. Dzięki temu architekturę możemy Ci nie tylko zaprojektować, ale też pomóc ją zrealizować – sami nie budujemy, ale prowadzimy nadzór autorski i&nbsp;polecamy zaufanych wykonawców. W&nbsp;dobrych relacjach.</p>
  </div>
  <div class="facts lines">
    <div><span class="n">1997</span><p>pierwsze projekty naszych architektów</p></div>
    <div><span class="n">2026</span><p>powstaje pracownia METAFORA ARCHITEKCI sp. z&nbsp;o.o.</p></div>
    <div><span class="n">ponad&nbsp;160</span><p>domów jednorodzinnych w&nbsp;dorobku naszych architektów</p></div>
    <a class="wgl" href="#woodgood"><img loading="lazy" src="img/logo-woodgood.png" width="900" height="625" alt="WoodGood"><p>Nasza marka produktowa: domy modułowe z&nbsp;drewna klejonego krzyżowo (CLT).</p></a>
  </div>
  <figure class="f2"><img loading="lazy" src="img/o-nas/portret.jpg" width="995" height="1400" alt="Hanna Kłopocka, artystka i scenografka z zespołu Metafory, w fotelu"></figure>
</div>`;

const FAZY=[
["Marzenia, wizje","Projektowanie wstępne","4–8 tygodni",["To faza gromadzenia informacji, analiz i wniosków, które stają się fundamentem kolejnych faz. Poznajemy Twoje potrzeby, styl życia, cele i założenia.","Zapraszamy Cię na sesję twórczą: poznajemy się, inspirujemy się nawzajem, rozmawiamy o marzeniach, rozwiewamy obawy i urealniamy obraz. Analizujemy warunki terenowe – klimat, wiatry, nasłonecznienie, grunt, zieleń, sąsiedztwo, kontekst historyczny, prawo miejscowe i budowlane – a potem nakładamy na nie filtry zależne od Ciebie: styl życia, upodobania, budżet, terminy i cele. Tak powstaje pierwsza przymiarka domu na działce i wstępny program."],["Analizy warunków i wytycznych wyjściowych","Szkice proponowanych rozwiązań","Wytyczne do sposobu zabudowy","Wstępny program inwestycji","Wstępny budżet i harmonogram"],"Karty projektu i kwestionariusza do sesji twórczej (wzory wysyłamy), wypisu i wyrysu z rejestru gruntów, miejscowego planu albo decyzji o warunkach zabudowy, opinii geotechnicznej, mapy 1:500 – a przede wszystkim otwartości, szczerości i zaufania. Brakujące dokumenty możemy zlecić w Twoim imieniu."],
["Koncept","Projektowanie koncepcyjne","6–12 tygodni",["Układamy sposób i jakość życia w przestrzeni. Świadomie projektujemy relacje między domownikami, między ludźmi a przestrzenią i w samej przestrzeni. Powstaje bryła budynku i idea elewacji wpisana w krajobraz.","Z wielu idei i szkiców wyłaniamy koncepcję spójną formalnie, programowo, budżetowo i funkcjonalnie – po akceptacji jest podstawą dalszej pracy. To dobry moment, żeby nadać inwestycji nazwę z charakterem, na przykład „Zakątek pod dębami”."],["Kilka spotkań twórczych","Koncepcja zagospodarowania terenu","Rzuty kondygnacji i elewacje","Model 3D","Wstępny kosztorys szacunkowy","Skorygowany harmonogram","Wizualizacje – na życzenie"],"Zaangażowania i czasu: decyzji o programie użytkowym, technologii i materiałach, akceptacji układu pomieszczeń i wstępnego budżetu oraz pełnomocnictwa do reprezentowania Cię w urzędach i u dostawców mediów."],
["Rozwój","Projektowanie zasadnicze, model cyfrowy i uzgodnienia","2–4 tygodnie + uzgodnienia",["Na podstawie zatwierdzonej koncepcji tworzymy cyfrowy model budynku i dokładnie sytuujemy go na mapie do celów projektowych. Doprecyzowujemy relacje przestrzenne i szczegóły, ostatecznie uzgadniamy technologie.","Do pracy zapraszamy inżynierów i specjalistów innych branż. To również czas na wystąpienie o warunki przyłączenia mediów i zjazd z drogi – jeśli chcesz, załatwimy to w Twoim imieniu. Rysunki wyglądają już jak budowlane, ale na ich podstawie nie można jeszcze budować."],["Projekt zagospodarowania terenu z sieciami","Rzuty kondygnacji","Elewacje z dyspozycją materiałową","Model cyfrowy 3D","Podkłady dla branż","Kosztorys szacunkowy"],"Ostatecznych decyzji o konstrukcji, elewacjach, dachu i technologiach. Do tego warunków przyłączenia mediów, wyłączenia gruntu z produkcji rolnej, uzgodnienia zjazdu, a na terenach chronionych – uzgodnienia konserwatorskiego."],
["Pozwolenia","Projektowanie budowlane – rysunki „dla urzędu”","3–5 tygodni + ok. 90 dni procedury",["Na podstawie wcześniejszych opracowań i wspólnych decyzji przygotowujemy projekt budowlany potrzebny do uzyskania pozwolenia na budowę. Jego zakres służy weryfikacji w urzędzie, a po wydaniu decyzji staje się wiążący dla dalszych opracowań.","Jeśli zechcesz, reprezentujemy Cię w postępowaniu. Urząd ma na decyzję 65 dni, do tego dochodzą doręczenia i uprawomocnienie – realnie pozwolenia można się spodziewać po około 90 dniach od złożenia dokumentów."],["Projekt budowlany","Projekt zagospodarowania terenu","Złożenie wniosku w Twoim imieniu","Koordynacja administracyjna"],"Niewiele – większość decyzji już zapadła. Kontakty z urzędem, które bywają czasochłonne, możemy poprowadzić za Ciebie."],
["Technologia","Projektowanie techniczne – rysunki „dla budowlańców”","8–10 tygodni",["Równolegle z procedurą w urzędzie przygotowujemy projekt techniczny: koordynujemy branże i uzupełniamy projekt budowlany o dane technologiczne, konstrukcyjne i instalacyjne. Na jego podstawie można formalnie rozpocząć budowę i rozmawiać z wykonawcami.","To odpowiedni moment na wybór kierownika budowy. Pomagamy w rozmowach z wykonawcami, w negocjacjach i układaniu harmonogramu. Projekt techniczny nie jest jeszcze dokumentacją wykonawczą."],["Koordynacja międzybranżowa","Wielobranżowy projekt techniczny","Oświadczenie o wykonaniu projektu technicznego"],"Udziału w rozmowach z wykonawcami. Warto już teraz pomyśleć o projekcie wnętrz (faza 7) – przyłącza i instalacje ustawione na tym etapie to mniej zmian i kosztów na budowie."],
["Produkcja","Projektowanie wykonawcze, realizacja i nadzór","4–10 tygodni + 10–20 wizyt",["Wykonujemy rysunki szczegółowe: od detali architektonicznych przez konstrukcję po instalacje. Zakres ustalamy z kierownikiem budowy – im więcej wyjaśnimy w projekcie, tym mniej zostaje do interpretacji wykonawcy i tym mniej okazji do zmian w umówionych pracach.","Przy budowie prywatnej rysunki powstają sukcesywnie, z wyprzedzeniem prac. W tym czasie jesteśmy Twoim doradcą w kontaktach z wykonawcami i pomagamy podejmować decyzje techniczne."],["Rysunki wykonawcze konstrukcji, architektury i instalacji","Spotkania koordynacyjne z kierownikiem budowy","Nadzór autorski na budowie","Kosztorys inwestorski"],"Akceptacji niektórych rozwiązań szczegółowych. Najlepiej, gdy ta faza zazębia się z projektem wnętrz – unikamy wtedy zmian w trakcie prac wykończeniowych."],
["Haptyka","Projektowanie wnętrz, krajobrazu i zieleni","10–20 tygodni",["Projektujemy wnętrza: wspólnie dobieramy materiały, kolory, struktury i faktury, wygodne meble stałe i ruchome, oświetlenie i wyposażenie. Zestawiamy i zamawiamy materiały, a potem nadzorujemy ich montaż.","Projektujemy też otoczenie budynku – plany widokowe, sceny, perspektywy, może sad albo zielnik. Inwestycja to cała posesja, więc dom, wnętrze i ogród układamy spójnie, z pomocą specjalistów od zieleni i prac ogrodowych."],["Koncepcja wnętrz","Rysunki realizacyjne wnętrz","Projekt krajobrazu i zieleni","Nadzór autorski"],"Dużego zaangażowania: wyboru wykończeń i wczucia się w to, jak będziesz żyć w przestrzeni – w domu i wokół niego. My podpowiadamy scenariusze, decyzje są Twoje."],
["Praktyka","Wprowadzenie się, wyposażenie, organizacja","3–6 tygodni",["Wspólnie planujemy miejsce każdego elementu wyposażenia – od tkanin po naczynia i drobiazgi codziennego użytku. Dobrze ułożona przestrzeń od początku to łatwy porządek na lata.","Pomagamy dobrać nowe wyposażenie kolorystycznie, stylowo i ilościowo, a na koniec złożyć zawiadomienie o zakończeniu budowy. Potem po prostu przyjeżdżasz i zaczynasz mieszkać, pracować, tworzyć. Gratulacje!"],["Dyspozycja i adresacja wyposażenia","Indywidualny charakter wnętrza przez dobór detali","Katalog wyposażenia","Zawiadomienie o zakończeniu budowy"],"Bardzo dużego zaangażowania – to Ty będziesz używać każdego zakamarka. Każdą decyzję podejmujemy razem, świadomie i celowo."]];
V.proces=()=>head("Proces")+`<p class="lead-c">Wypracowaliśmy nasz standard współpracy. Możemy Cię wesprzeć od rozmowy o&nbsp;marzeniach po otwarcie drzwi w&nbsp;pierwszy dzień zamieszkania. Każda faza procesu kończy się konkretnym opracowaniem i&nbsp;Twoją akceptacją, a&nbsp;fazę&nbsp;1 traktujemy jako fundament każdej współpracy.</p><ol class="phases">`+
  FAZY.map((f,i)=>`<li class="ph"><button class="ph-b" type="button" aria-expanded="false" aria-controls="ph-${i+1}"><span class="no">Faza ${i+1}</span><span class="nm">${esc(f[0])}</span><span class="ds">${nb(f[1])}</span><span class="tm">${esc(f[2])}</span><span class="pl" aria-hidden="true">+</span></button><div class="ph-p" id="ph-${i+1}" hidden><div class="c1">${f[3].map(t=>`<p>${nb(t)}</p>`).join("")}</div><div class="c2"><span class="lbl">Wyniki</span><ul>${f[4].map(t=>`<li>${nb(t)}</li>`).join("")}</ul><span class="lbl">Potrzebujemy od Ciebie</span><p>${nb(f[5])}</p></div></div></li>`).join("")+`</ol>`;

V.woodgood=()=>`<div class="pg-h"><h1>WoodGood</h1></div><div class="wg-h"><img src="img/logo-woodgood.png" width="900" height="625" alt="WoodGood"><p>Nasza marka produktowa i&nbsp;kierunek rozwoju do&nbsp;2030: domy modułowe z&nbsp;drewna klejonego krzyżowo (CLT). Prefabrykacja, szybka budowa i&nbsp;zdrowy mikroklimat.</p></div>${mix(P.filter(p=>p.b==="wg"),0)}`;

const Z1=[["team-grzegorz","arch. Grzegorz Kłopocki","założyciel, prezes zarządu, architekt prowadzący","","gklopocki@metaforaarchitekci.pl",["upr. bez ograniczeń 156/01/DUW","członek <abbr title=\"Dolnośląska Okręgowa Izba Architektów RP\">DOIA RP</abbr>, nr DS‑0315","członek <abbr title=\"Gminna Komisja Urbanistyczno-Architektoniczna\">GKUiA</abbr> w&nbsp;Miękini"]],["team-klementyna","arch. Klementyna Kopczyńska‑Kłopocka","architekt prowadzący","","kklopocka@metaforaarchitekci.pl",["upr. bez ograniczeń 157/01/DUW","członkini <abbr title=\"Dolnośląska Okręgowa Izba Architektów RP\">DOIA RP</abbr>, nr DS‑0334"]],["team-patryk","arch. Patryk Flis","architekt","","biuro@flispatryk.pl"],["team-marianna","Marianna Łata","arch. praktykantka"],["team-hania","Hanna Kłopocka","artysta, scenografka","","haniaklopocka@gmail.com"]];
const Z2=[["branza-najbar","inż. Grzegorz Najbar","konstrukcje","","grzegorz.nr@gmail.com"],["branza-puzanowski","inż. Tomasz Puzanowski","instalacje sanitarne","PROINSTAL","proinstal.tp@wp.pl"],["branza-nejman","inż. Marcin Nejman","instalacje elektryczne i teletechniczne","SELVPRO","biuro@selvpro.pl"],["branza-majda","inż. Mirosław Majda","kierownik budów, nadzory","","mirek.majda61@gmail.com"],["branza-steczkiewicz","Krzysztof Steczkiewicz","oświetlenie architektury","2KS","k.steczkiewicz2ks@gmail.com"]];
const Z3=[["branza-delineszew","Nikolaj Delineszew †","nauczyciel, mentor, konstruktor artysta – in memoriam"]];
const personT=([f,n,r,fi,ml])=>`<div class="person pt"><span class="pn">${esc(n)}</span><span class="pr">${esc(r)}</span>${fi?`<span class="pf">${esc(fi)}</span>`:""}${ml?`<a class="pm" href="mailto:${esc(ml)}">${esc(ml)}</a>`:""}</div>`;
const person=([f,n,r,fi,ml,up])=>`<figure class="person"><div class="pic"><img loading="lazy" decoding="async" src="img/zespol/${f}.jpg" width="900" height="1200" alt="${esc(n.replace(/^(arch\.|inż\.)\s/,"").replace(" †",""))}"></div><figcaption><span class="pn">${esc(n)}</span><span class="pr">${esc(r)}</span>${up?`<span class="pqs">${up.map(u=>`<span class="pq">${u}</span>`).join("")}</span>`:""}${fi?`<span class="pf">${esc(fi)}</span>`:""}${ml?`<a class="pm" href="mailto:${esc(ml)}">${esc(ml)}</a>`:""}</figcaption></figure>`;
V.zespol=()=>head("Zespół","Dzięki fantastycznym ludziom nasze projekty stają się architekturą.")+`<div class="team">${Z1.map(person).join("")}</div><div class="sub-h"><h2 class="lbl">Specjaliści, z&nbsp;którymi współpracujemy</h2></div><div class="team sm w7">${Z2.map(personT).join("")}${Z3.map(person).join("").replace('class="person"','class="person memo"')}</div>`;

V.media=()=>head("Media","Publikacje, wyróżnienia i&nbsp;filmy o&nbsp;naszych projektach.")+`<div class="mlist">
<div class="mrow"><span class="n">2018</span><span class="t">Murator</span><p>Wyróżnienie w&nbsp;konkursie Remont Roku 2018 miesięcznika „Murator” dla koncepcji mieszkania w&nbsp;poznańskiej kamienicy.</p><a class="more" href="#p-wnetrze-poznan-jezyce">Zobacz projekt</a></div>
<div class="mrow"><span class="n">2026</span><span class="t">Film o&nbsp;pracowni</span><p>Krótki film o&nbsp;tym, jak projektujemy.</p><a class="more" href="#filmy">Obejrzyj</a></div>
</div>`;
V.filmy=()=>head("Filmy")+`<div class="film"><video controls playsinline preload="none" poster="video/hero-poster.jpg"><source src="video/hero.mp4" type="video/mp4" media="(min-width: 901px)"><source src="video/hero-720.mp4" type="video/mp4"></video><p class="meta">Metafora Architekci<i>|</i>film o&nbsp;pracowni</p></div>`;

/* mapa w kontakcie: najpierw obie lokalizacje, „Mapa” pod adresem przybliża dane biuro */
const KMAP0=`<svg viewBox="0 0 1400 600" role="img" aria-label="Mapa: Wrocław, biuro główne"><image href="map/przeglad.jpg" width="1400" height="600"/>
<g class="kpin" data-map="wro" transform="translate(950 505)"><circle class="r" r="20"/><circle class="d" r="8"/><text class="t1" x="24" y="-10">WROCŁAW</text><text class="t2" x="24" y="22">biuro główne</text></g></svg>`;
const KMAP={wro:["Wrocław – biuro główne","https://www.google.com/maps/search/?api=1&query=Legnicka%2055%2C%2054-203%20Wroc%C5%82aw"]},kmC={};
function kmShow(id){
  const box=$("#kmIn");if(!box)return;const k=$("#kmK"),b=$("#kmB"),g=$("#kmG");
  const put=html=>{box.classList.add("fade");setTimeout(()=>{box.innerHTML=html;box.classList.remove("fade")},180)};
  if(!id||!KMAP[id]){put(KMAP0);k.innerHTML="Wrocław – biuro główne";b.hidden=true;g.href="https://www.google.com/maps/search/?api=1&query=Legnicka%2055%2C%2054-203%20Wroc%C5%82aw";return}
  k.textContent=KMAP[id][0];b.hidden=false;g.href=KMAP[id][1];
  if(kmC[id])put(kmC[id]);else fetch("map/"+id+".svg").then(r=>r.text()).then(s=>{kmC[id]=s.replace(/<metadata>[\s\S]*?<\/metadata>/,"");put(kmC[id])}).catch(()=>{});
  const m=$("#kmap");if(m&&m.getBoundingClientRect().top>innerHeight-200)m.scrollIntoView({behavior:"smooth",block:"center"});
}
document.addEventListener("click",e=>{const t=e.target.closest("[data-map]");if(t){e.preventDefault();kmShow(t.dataset.map);return}if(e.target.closest("#kmB"))kmShow("")});
V.kontakt=()=>head("Kontakt")+`<div class="contact"><div class="cl">
  <p class="note">Opowiedz nam o&nbsp;swoim miejscu. Zapraszamy na półgodzinną bezpłatną konsultację.</p>
  <div class="it2"><div class="it"><span class="lbl">Telefon</span><a class="v" href="tel:+48606355220">+48 606 355 220</a><span class="acts"><button type="button" data-copy="+48606355220">Kopiuj</button></span></div>
  <div class="it"><span class="lbl">E-mail</span><a class="v" href="mailto:biuro@metaforaarchitekci.pl">biuro@metaforaarchitekci.pl</a><span class="acts"><button type="button" data-copy="biuro@metaforaarchitekci.pl">Kopiuj</button></span></div></div>
  <div class="it2"><div class="it"><span class="lbl">Wrocław – biuro główne</span><span class="v">ul. Legnicka 55/10<br>54-203 Wrocław</span><span class="acts"><button type="button" data-map="wro">Mapa</button></span></div>
  <div class="it"><span class="lbl">Wilkszyn</span><span class="v">spotkania po wcześniejszym umówieniu</span></div></div>
  <div class="kmap" id="kmap">
    <div class="kmap-h"><span class="lbl" id="kmK">Wrocław – biuro główne</span><button type="button" id="kmB" hidden>Cała mapa</button><a id="kmG" href="https://www.google.com/maps/search/?api=1&amp;query=Legnicka%2055%2C%2054-203%20Wroc%C5%82aw" target="_blank" rel="noopener">Google Maps</a></div>
    <div class="kmap-in" id="kmIn">${KMAP0}</div>
    <p class="kmap-src">Mapa: © autorzy OpenStreetMap</p>
  </div>
  <form class="kf" id="kform" novalidate>
    <input type="text" name="www" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
    <input type="hidden" name="place" value="Kontakt">
    <label><span class="lbl">Imię i nazwisko</span><input name="name" required autocomplete="name"></label>
    <div class="kf2"><label><span class="lbl">E-mail</span><input name="email" type="email" required autocomplete="email"></label>
    <label><span class="lbl">Telefon (opcjonalnie)</span><input name="tel" type="tel" autocomplete="tel"></label></div>
    <label><span class="lbl">Wiadomość</span><textarea name="msg" rows="4" required minlength="3" placeholder="Opowiedz krótko o swoim miejscu i planach"></textarea></label>
    <p class="rodo">Administratorem Twoich danych jest METAFORA ARCHITEKCI sp. z&nbsp;o.o., ul. Legnicka 55/10, 54-203 Wrocław. Dane z&nbsp;formularza przetwarzamy, aby odpowiedzieć na wiadomość i&nbsp;ewentualnie przygotować ofertę (art. 6 ust. 1 lit. b i&nbsp;f RODO). Więcej, w&nbsp;tym o&nbsp;Twoich prawach: <a href="polityka-prywatnosci.html">Polityka prywatności</a>.</p>
    <div class="kf-f"><button class="more" type="submit">Wyślij wiadomość</button><span class="kf-st" id="kfSt" role="status"></span></div>
  </form>
</div><figure><img loading="lazy" src="p/dom-czerna/06.jpg"${ss("p/dom-czerna/06","g","","(max-width:900px) 100vw, 50vw")} alt="Wnętrze domu z CLT w Czernej" style="aspect-ratio:${ratio("dom-czerna",6)}"></figure></div>`;

/* formularz kontaktowy: na serwerze przez kontakt.php, w podglądzie – przez program pocztowy */
document.addEventListener("submit",async e=>{
  const form=e.target.closest("#kform");if(!form)return;e.preventDefault();
  const stt=form.querySelector("#kfSt");if(!form.reportValidity())return;
  const fd=new FormData(form);stt.classList.remove("err");stt.textContent="Wysyłamy…";
  const fail=()=>{stt.classList.add("err");stt.innerHTML='Nie udało się wysłać wiadomości. Zadzwoń: <a href="tel:+48606355220">+48&nbsp;606&nbsp;355&nbsp;220</a> albo napisz: <a href="mailto:biuro@metaforaarchitekci.pl">biuro@metaforaarchitekci.pl</a>.'};
  if(location.protocol==="file:"||!/metaforaarchitekci\.pl$/.test(location.hostname)){
    const b=`Imię i nazwisko: ${fd.get("name")}\nE-mail: ${fd.get("email")}\nTelefon: ${fd.get("tel")}\n\n${fd.get("msg")}`;
    location.href=`mailto:biuro@metaforaarchitekci.pl?subject=${encodeURIComponent("Strona www – zapytanie")}&body=${encodeURIComponent(b)}`;
    stt.textContent="Otworzyliśmy program pocztowy z gotową wiadomością – wystarczy ją wysłać.";return}
  try{const r=await fetch("kontakt.php",{method:"POST",body:fd});const j=await r.json().catch(()=>null);
    if(r.ok&&j&&j.ok){stt.textContent="Dziękujemy! Wiadomość wysłana, odezwiemy się wkrótce.";form.reset()}
    else if(r.status===400){stt.classList.add("err");stt.textContent="Uzupełnij imię, poprawny e-mail i treść wiadomości."}
    else fail()}catch(_){fail()}
});

/* podstrona projektu */
let LB=[];
/* galeria projektu: pod dużym zdjęciem najpierw rząd 2 zdjęć, potem rzędy po 3 (nagłówek grupy zaczyna nowy rząd) */
function rows(items){
  const out=[];let i=0;
  while(i<items.length){
    // jedna grupa zdjęć (do następnego nagłówka)
    let j=i+1;while(j<items.length&&!items[j].g)j++;
    const seg=[];let a=i;
    while(a<j){const k=out.length||seg.length?3:2,c=Math.min(k,j-a);seg.push(items.slice(a,a+c));a+=c}
    const n=seg.length;
    if(n>1&&seg[n-1].length===1){if(seg[n-2].length===3)seg[n-1].unshift(seg[n-2].pop());else seg[n-2].push(seg.pop()[0])}   // samotne zdjęcie: 3+1 → 2+2, 2+1 → 3
    out.push(...seg);i=j;
  }
  return out;
}
const groupOf=(p,q)=>{if(!p.g)return "";let g="";Object.keys(p.g).map(Number).sort((a,b)=>a-b).forEach(k=>{if(k<=q)g=p.g[k]});return g};
function project(p){
  const v=ver(p),c=p.img[0];
  const items=p.img.map(([n,r],q)=>({n,r,q,g:p.g&&p.g[q]}));
  LB=items.map(it=>({src:`p/${p.s}/${pad(it.n)}.jpg${v}`,cap:p.t+(groupOf(p,it.q)?" – "+groupOf(p,it.q):""),r:it.r}));
  const DEF=["Dom jednorodzinny","Zabudowa mieszkaniowa","Hotel","Obiekt komercyjny","Wnętrze","Design","Scenografia"];
  const dl=[["Miejsce",p.w],["Klient",p.kl],["Zakres",p.zk],["Rok",p.y],["Dziedzina",DN[p.D]+" · "+TN[p.T]],["Typ",DEF.includes(p.typ)?"":p.typ]].filter(x=>x[1]);
  let h=`<figure class="p-img${c[1]>=1.3?" hero":""}" data-i="0"><img src="p/${p.s}/${pad(c[0])}.jpg${v}"${ss("p/"+p.s+"/"+pad(c[0]),c[0]===1?"h":"g",v,c[1]>=1.3?"100vw":"(max-width:900px) 100vw, 60vw")} alt="${esc(p.t)}" style="--r:${c[1]}" fetchpriority="high"></figure>
  <div class="p-t"><h1>${esc(p.t)}</h1><p class="meta">${metaOf(p)}</p></div>
  ${p.d?`<div class="p-info"><dl class="p-dl">${dl.map(([a,b])=>`<div><dt>${a}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl><div class="p-d"><p>${nb(p.d)}</p>${p.b==="wg"?`<a class="wg" href="#woodgood"><img src="img/logo-woodgood.png" width="900" height="625" alt="WoodGood">Projekt marki WoodGood</a>`:""}</div></div>`:`<div class="p-sp"></div>`}<div class="bl-r"><aside class="bl-s" aria-hidden="true"><span class="vtag">${TAG}</span></aside><div class="bl-c gal">`;
  if(p.g&&p.g[0])h+=`<div class="ghead lbl">${esc(p.g[0])}</div>`;
  rows(items.slice(1)).forEach(row=>{
    if(row[0].g)h+=`<div class="ghead lbl">${esc(row[0].g)}</div>`;
    const portr=row.length>1&&row.every(x=>x.r<.95);
    h+=`<div class="grow${portr?" portr":""}">`+row.map(x=>`<figure style="flex:${x.r} 1 0" data-i="${x.q}"><img loading="lazy" decoding="async" src="p/${p.s}/${pad(x.n)}.jpg${v}"${ss("p/"+p.s+"/"+pad(x.n),"g",v,"(max-width:700px) 100vw, 50vw")} alt="${esc(p.t)} – ${esc(altKind(p,x.n))} ${x.q+1}" style="--r:${x.r}"></figure>`).join("")+`</div>`;
  });
  h+=`</div></div>`;
  if(p.pl&&p.pl.length){
    const base=LB.length;
    p.pl.forEach(([n,r])=>LB.push({src:`p/${p.s}/${pad(n)}.jpg${v}`,cap:p.t+" – "+(p.ph||"Rzut"),r}));
    const lines=(p.pr||[]).map(([a,b])=>`<div><span>${esc(a)}</span><span>${esc(b)}</span></div>`).join("")+(p.pu?`<div class="sum"><span>Powierzchnia użytkowa</span><span>${esc(p.pu)}</span></div>`:"");
    h+=`<section class="plan" aria-label="Rzut"><div class="pi"><h2>${esc(p.ph||"Rzut")}</h2>${lines?`<div class="lines">${lines}</div><p class="note">Powierzchnie orientacyjne.</p>`:""}</div><div class="pd">${p.pl.map(([n,r],k)=>`<figure data-i="${base+k}"><img loading="lazy" decoding="async" src="p/${p.s}/${pad(n)}.jpg${v}"${ss("p/"+p.s+"/"+pad(n),"g",v,"(max-width:700px) 100vw, 40vw")} alt="${esc(p.t)} – ${esc(p.ph||"rzut")}" style="--r:${r}"></figure>`).join("")}</div></section>`;
  }
  const same=ofT(p.T).length>1?ofT(p.T):ofD(p.D),nx=same[(same.indexOf(p)+1)%same.length];
  h+=`<nav class="next" aria-label="Nawigacja projektów"><a href="#prace/${p.D}${TYA(p.D).length>1?"/"+p.T:""}"><span class="lbl">Wróć</span><span class="ttl">${esc(DN[p.D]+(TYA(p.D).length>1?" · "+TN[p.T]:""))}</span></a>${nx!==p?`<a class="r nx" href="#p-${nx.s}"><span class="nx-t"><span class="lbl">Następny projekt</span><span class="ttl">${esc(nx.t)}</span><span class="meta">${metaOf(nx)}</span></span><span class="nx-ph"><img loading="lazy" decoding="async" src="p/${nx.s}/t.jpg${ver(nx)}"${ss("p/"+nx.s+"/t","t",ver(nx),"(max-width:700px) 100vw, 50vw")} alt="" width="1400" height="933"></span></a>`:""}</nav>`;
  return h;
}

/* ───── routing ───── */
const view=$("#view");
/* tytuł karty i opis dla wyszukiwarek / podglądów linków */
const DEF_T="Metafora Architekci – pracownia architektoniczna, Wrocław";
const DEF_D="Metafora Architekci – pracownia architektoniczna we Wrocławiu. Projektujemy domy jednorodzinne, wnętrza, zabudowę mieszkaniową, budynki usługowe i produkt; specjalizujemy się w budynkach z drewna CLT.";
const pDesc=p=>{const a=[p.t,TN[p.T],p.w,p.y].filter(Boolean).join(" · ");const d=(p.d||"").replace(/\s+/g," ");return (a+(d?" – "+d:" – projekt pracowni Metafora Architekci, Wrocław.")).slice(0,300)};
function setDesc(s){for(const sel of ['meta[name="description"]','meta[property="og:description"]']){const m=document.querySelector(sel);if(m)m.setAttribute("content",s)}const o=document.querySelector('meta[property="og:title"]');if(o)o.setAttribute("content",document.title)}
let lastH=null;
const PLN={start:"Strona główna","o-nas":"Pracownia",proces:"Proces",woodgood:"WoodGood",zespol:"Zespół",media:"Media",filmy:"Filmy",kontakt:"Kontakt"};
function placeName(x){const s=x.split("/");if(s[0]==="indeks")return "Indeks"+(DN[s[1]]?" · "+DN[s[1]]:"");if(s[0]==="prace")return DN[s[1]]?[DN[s[1]],TN[s[2]]].filter(Boolean).join(" · "):"Prace";return PLN[x]||null}
function route(){
  let h=decodeURIComponent(location.hash.slice(1))||"start",html=null,group=h,title=DEF_T,desc=DEF_D;
  if(OLD[h]){history.replaceState(null,"","#"+OLD[h]);h=OLD[h]}
  const seg=h.split("/");
  if(window.__lbReset)window.__lbReset();
  if(h==="main"){history.replaceState(null,"",lastH?"#"+lastH:"#start");const m=$("#main");m.setAttribute("tabindex","-1");m.focus();return}
  if(h.startsWith("p-")){const p=P.find(x=>x.s===h.slice(2));if(p){html=project(p);group="prace";title=p.t+" · Metafora Architekci";desc=pDesc(p)}else{history.replaceState(null,"","#prace");return route()}}
  else if(seg[0]==="prace"){const d=DN[seg[1]]?seg[1]:"",t=(d&&TN[seg[2]]&&TY.find(x=>x[0]===seg[2])[1]===d)?seg[2]:"";html=prace(d,t);group=d?"prace/"+d:"prace";title=(d?[DN[d],TN[t]].filter(Boolean).join(" · "):"Prace")+" · Metafora Architekci"}
  else if(seg[0]==="indeks"){html=indeks(seg[1]||"",seg[2]||"");group="indeks";title="Indeks – Metafora Architekci"}
  if(html===null){if(!V[h]){if(h!=="start")history.replaceState(null,"","#start");h="start"}html=V[h]();group=h;const n={"o-nas":"Pracownia",proces:"Proces",woodgood:"WoodGood",zespol:"Zespół",media:"Media",filmy:"Filmy",kontakt:"Kontakt"}[h];if(n)title=n+" · Metafora Architekci"}
  view.innerHTML=html;document.title=title;setDesc(desc);
  document.body.classList.toggle("hero-on",!!view.querySelector(".hero"));
  const top=MENU.find(m=>m.h===group||group.startsWith(m.h+"/")||(m.o&&m.o.some(o=>o[0]===group)));
  document.querySelectorAll("#nav a").forEach(a=>{const on=(a.dataset.g&&top&&a.dataset.g===top.h)||(a.dataset.h&&a.dataset.h===group);a.setAttribute("aria-current",on?"true":"false")});
  const hasHero=!!view.querySelector(".hero");
  document.querySelectorAll("#nav>ul>li").forEach(li=>li.classList.toggle("open",!hasHero&&!!top&&!!top.o&&li.firstElementChild.dataset.g===top.h));
  scrollTo(0,0);subOpen();heroText();hdrState();stkCache();
  document.querySelectorAll("#mnav a").forEach(a=>{const x=(a.getAttribute("href")||"").slice(1);a.setAttribute("aria-current",x&&(x===h||x===group)?"true":"false")});
  view.querySelectorAll("figure[data-i]").forEach(f=>{f.tabIndex=0;f.setAttribute("role","button");f.setAttribute("aria-label","Powiększ zdjęcie")});
  view.querySelectorAll(".tile img").forEach((im,i)=>{if(i<3){im.loading="eager";im.setAttribute("fetchpriority","high")}});
  /* UX-28: „Wróć” prowadzi tam, skąd się przyszło (strona główna, Indeks, kategoria…) */
  if(h.startsWith("p-")&&lastH&&!lastH.startsWith("p-")){const nm=placeName(lastH),a=view.querySelector(".next a");
    if(nm&&a){a.setAttribute("href","#"+lastH);a.querySelector(".ttl").textContent=nm;a.addEventListener("click",e=>{if(history.length>1){e.preventDefault();history.back()}})}}
  if(lastH!==null){const f=view.querySelector("h1")||$("#main");f.setAttribute("tabindex","-1");f.focus({preventScroll:true})}
  lastH=h;
}
/* rozwinięte podmenu (np. Studio → Pracownia, Proces…): biały pasek kończy się na górze napisów podmenu,
   tytuł strony odsuwa się pod podmenu, przy przewijaniu zatrzymuje się pod nim i płynnie znika, gdy dojeżdża następny napis */
const SUBGAP=56,STKGAP=26;let stkTop=0;
function subOpen(){
  const b=document.body,s=innerWidth>900&&document.querySelector("#nav li.open>.sub");
  if(!s){b.classList.remove("subopen");b.style.removeProperty("--cut");b.style.removeProperty("--subpad");stkTop=hdrEl.offsetHeight+STKGAP;return}
  const r=s.getBoundingClientRect(),a=s.querySelector("a").getBoundingClientRect(),hb=hdrEl.getBoundingClientRect();
  b.classList.add("subopen");
  b.style.setProperty("--cut",Math.round(a.top-hb.top)+"px");
  b.style.setProperty("--subpad",Math.max(0,Math.round(r.bottom-hb.bottom+SUBGAP))+"px");
  stkTop=Math.round(r.bottom+STKGAP);
}
/* każdy napis na stronach z nagłówkiem (Studio, Prace, Indeks, Kontakt): dojeżdża do linii pod menu, zatrzymuje się,
   a gdy z dołu nachodzi następny napis – płynnie znika; potem to samo robi kolejny */
const STK_SEL="h1,h2,h3,p,figcaption,dt,dd,.ph-b,.ph-p li,.ph-p .lbl,.lines>*,.mrow,.it,.ix-h,.ix li,.facts>*,.flt";
const STK_NOT=".tile,.bl-r,.hero,.gal,.plan,.next,.p-t,.p-info";
let STK=[],STOP=[];
function stkCache(){
  STK.forEach(o=>{o.el.style.transform="";o.el.style.opacity="";o.el.style.visibility=""});STK=[];STOP=[];
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  if(innerWidth<=900||!view.querySelector(".pg-h"))return;
  let els=[...view.querySelectorAll(STK_SEL)].filter(el=>!el.closest(STK_NOT)&&el.offsetParent);
  els=els.filter(el=>!els.some(o=>o!==el&&o.contains(el)));     // całe bloki, bez zagnieżdżeń
  STK=els.map(el=>({el,n:el.getBoundingClientRect().top+scrollY,h:el.offsetHeight})).sort((a,b)=>a.n-b.n);
  // zdjęcia i galerie nie stają, ale też „nachodzą” na napis i go wygaszają
  STOP=[...view.querySelectorAll(".bl-r,figure,.tile,.team")].filter(el=>!el.closest(".bl-r")||el.classList.contains("bl-r")).map(el=>el.getBoundingClientRect().top+scrollY).sort((a,b)=>a-b);
  stickAll();
}
function stickAll(){
  if(!STK.length)return;
  const S=stkTop,y=scrollY;
  for(let i=0;i<STK.length;i++){
    const o=STK[i],sh=Math.max(0,y+S-o.n);
    o.el.style.transform=sh?`translateY(${sh}px)`:"";
    if(!sh){if(o.el.style.opacity){o.el.style.opacity="";o.el.style.visibility=""}continue}
    // następny napis niżej w dokumencie (pomijamy te w tej samej linii)
    let nx=null;for(let j=i+1;j<STK.length;j++)if(STK[j].n>o.n+4){nx=STK[j];break}
    let top=nx?nx.n-y+Math.max(0,y+S-nx.n):document.querySelector(".foot").getBoundingClientRect().top;
    const st=STOP.find(v=>v>o.n+4);if(st!==undefined)top=Math.min(top,st-y);
    const d=top-(S+o.h);
    const op=Math.max(0,Math.min(1,(d-8)/90));
    o.el.style.opacity=op<1?op.toFixed(3):"";o.el.style.visibility=op<=0?"hidden":"";
  }
}
let stkT=0;const stkLater=()=>{clearTimeout(stkT);stkT=setTimeout(stkCache,120)};
addEventListener("scroll",stickAll,{passive:true});
addEventListener("resize",()=>{subOpen();stkLater()});
view.addEventListener("load",stkLater,true);
document.addEventListener("click",e=>{if(e.target.closest(".ph-b"))stkLater()});
/* strona projektu: tytuł stoi najpierw na dużym zdjęciu, przy przewijaniu zjeżdża na swoje miejsce pod zdjęciem */
function heroText(){
  const tt=view.querySelector(".p-img.hero + .p-t");if(!tt)return;
  if(matchMedia("(max-width:700px) and (orientation:portrait), (prefers-reduced-motion: reduce)").matches){tt.style.transform="";tt.classList.remove("on-img");return}
  const h=tt.previousElementSibling,pad=Math.min(90,Math.max(48,innerHeight*.08));
  const off=Math.max(0,tt.offsetTop-(h.offsetHeight-tt.offsetHeight-pad)),sh=Math.max(0,off-scrollY);
  tt.style.transform=sh?`translateY(${-sh}px)`:"";
  tt.classList.toggle("on-img",tt.offsetTop-sh+tt.offsetHeight*.5<h.offsetTop+h.offsetHeight);
}
addEventListener("scroll",heroText,{passive:true});addEventListener("resize",heroText);

/* indeks: podgląd zdjęcia przy najechaniu (tylko mysz) */
const fine=matchMedia("(hover:hover) and (pointer:fine)");
document.addEventListener("mouseover",e=>{const pv=document.getElementById("ixPv");if(!pv||!fine.matches)return;const a=e.target.closest(".ix a");if(!a){pv.hidden=true;return}pv.src=a.dataset.th;pv.hidden=false});
document.addEventListener("mousemove",e=>{const pv=document.getElementById("ixPv");if(!pv||pv.hidden)return;pv.style.transform=`translate(${Math.min(e.clientX+24,innerWidth-340)}px,${Math.min(e.clientY-120,innerHeight-260)}px)`});
const hdrEl=document.getElementById("hdr");
function hdrState(){
  const hero=view.querySelector(".hero");
  // pasek bieleje dopiero, gdy pierwszy napis (podpis na zdjęciu albo tytuł pod nim) dochodzi do menu
  heroSticky();
  // strona główna: tekst zatrzymuje się pod menu, więc pasek bieleje dopiero, gdy schodzi zdjęcie
  if(hero&&hero.querySelector(".hero-s")){document.body.classList.toggle("solid",hero.getBoundingClientRect().bottom<hdrEl.offsetHeight+90);return}
  const txt=hero&&(hero.querySelector(".hero-t")||hero.nextElementSibling);
  const solid=!hero||!txt||txt.getBoundingClientRect().top<hdrEl.offsetHeight+90;   // zapas na płynne przejście (0,7 s)
  document.body.classList.toggle("solid",solid);
}
/* strona główna: tekst „Wdzięczni Bogu…” przy przewijaniu opiera się o menu i znika razem ze zdjęciem;
   podpis wybranego projektu gaśnie, gdy do niego dojeżdża */
function heroSticky(){
  const hero=view.querySelector(".hero"),hs=hero&&hero.querySelector(".hero-s");if(!hs)return;
  const ht=hero.querySelector(".hero-t"),hr=hero.getBoundingClientRect(),h=hs.offsetHeight;
  const nat=hr.top+hr.height*(innerWidth<=700?.40:.44)-h/2,tgt=Math.max(nat,hdrEl.offsetHeight+24),sh=tgt-nat;
  hs.style.transform=sh>0.5?`translate(-50%,calc(-50% + ${sh}px))`:"";
  if(ht){const d=ht.getBoundingClientRect().top-(tgt+h);const o=Math.max(0,Math.min(1,(d-12)/90));ht.style.opacity=o<1?o.toFixed(3):"";ht.style.visibility=o<=0?"hidden":""}
}
addEventListener("scroll",hdrState,{passive:true});addEventListener("resize",hdrState);
addEventListener("hashchange",route);
route();

/* ───── interakcje ───── */
document.addEventListener("click",e=>{
  const b=e.target.closest(".ph-b");
  if(b){const o=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",String(!o));b.querySelector(".pl").textContent=o?"+":"–";document.getElementById(b.getAttribute("aria-controls")).hidden=o;return}
  const c=e.target.closest("[data-copy]");
  if(c){const t=c.dataset.copy,l=c.textContent;const sel=()=>{const v=c.closest(".it").querySelector(".v"),r=document.createRange();r.selectNodeContents(v);const s=getSelection();s.removeAllRanges();s.addRange(r);c.textContent="Zaznaczono";setTimeout(()=>c.textContent=l,1600)};
    try{navigator.clipboard.writeText(t).then(()=>{c.textContent="Skopiowano";setTimeout(()=>c.textContent=l,1600)},sel)}catch(_){sel()}return}
  const f=e.target.closest("figure[data-i]");if(f)openLb(+f.dataset.i,f);
});

/* lightbox: klik w zdjęcie galerii powiększa, klik gdziekolwiek / Esc / „Zamknij” wraca do galerii */
/* lightbox: klik powiększa zdjęcie z miejsca w galerii; klik, Esc albo przewinięcie w dół pomniejsza je z powrotem do galerii */
/* podpis rodzaju obrazu – stały, delikatny, w prawym dolnym rogu ekranu */
const imk=document.createElement("div");imk.className="imk";imk.setAttribute("aria-hidden","true");document.body.appendChild(imk);
/* przy przejściu na inne zdjęcie podpis najpierw gaśnie, potem pojawia się na nowo */
let imkT=0,imkEl=null;
const showImk=(s,el)=>{
  clearTimeout(imkT);
  if(!s){imkEl=null;imkT=setTimeout(()=>imk.classList.remove("on"),120);return}
  if(el&&el===imkEl&&imk.classList.contains("on"))return;
  const was=imk.classList.contains("on");imkEl=el||null;
  if(was){imk.classList.remove("on");imkT=setTimeout(()=>{imk.textContent=s;imk.classList.add("on")},260)}
  else{imk.textContent=s;imk.classList.add("on")}
};
document.addEventListener("mouseover",e=>{const im=e.target.closest("img");showImk(im?imgKind(im.currentSrc||im.src):"",im)});
/* czytelność: sprawdzamy jasność tego, co leży pod napisem, i dobieramy ciemne albo jasne litery */
const lumC={};
function lumImg(img,x,y){
  try{
    const src=img.currentSrc||img.src;if(!img.complete||!img.naturalWidth)return null;
    let c=lumC[src];
    if(!c){const w=96,h=Math.max(1,Math.round(w*img.naturalHeight/img.naturalWidth));c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);c._d=c.getContext("2d").getImageData(0,0,w,h).data;lumC[src]=c}
    const r=img.getBoundingClientRect(),fit=getComputedStyle(img).objectFit,nw=img.naturalWidth,nh=img.naturalHeight;
    let sx=r.width/nw,sy=r.height/nh;if(fit==="cover"){sx=sy=Math.max(sx,sy)}else if(fit==="contain"){sx=sy=Math.min(sx,sy)}
    const ox=(r.width-nw*sx)/2,oy=(r.height-nh*sy)/2;
    const u=Math.min(c.width-1,Math.max(0,Math.floor((x-r.left-ox)/sx/nw*c.width))),v=Math.min(c.height-1,Math.max(0,Math.floor((y-r.top-oy)/sy/nh*c.height)));
    const i=(v*c.width+u)*4,d=c._d;return (0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2])/255;
  }catch(e){return null}
}
function imkTone(){
  if(!imk.classList.contains("on"))return;
  const r=imk.getBoundingClientRect();let s=0,n=0;
  for(const fx of [.15,.5,.85]){const x=r.left+r.width/2,y=r.top+r.height*fx;
    const el=document.elementsFromPoint(x,y).find(e=>e!==imk);let L=1;
    if(el&&el.tagName==="IMG"){const l=lumImg(el,x,y);if(l!==null)L=l}
    else if(el&&getComputedStyle(el).backgroundColor==="rgba(0, 0, 0, 0)"&&el.closest(".hero"))L=0.2;
    s+=L;n++}
  imk.classList.toggle("dk",s/n<0.5);
}
let imkR=0;const imkTick=()=>{cancelAnimationFrame(imkR);imkR=requestAnimationFrame(imkTone)};
addEventListener("scroll",imkTick,{passive:true});addEventListener("resize",imkTick);
new MutationObserver(imkTick).observe(imk,{attributes:true,attributeFilter:["class"],childList:true});
const lb=$("#lb"),lbI=$("#lbI");let lastF=null,srcF=null,busy=false,lbR=1.5;
/* zdjęcie zawsze wypełnia ekran: na całą szerokość albo na całą wysokość */
function fitLb(){const w=Math.min(innerWidth,innerHeight*lbR);lbI.style.width=Math.round(w)+"px";lbI.style.height=Math.round(w/lbR)+"px"}
addEventListener("resize",()=>{if(!lb.hidden)fitLb()});
const RM=matchMedia("(prefers-reduced-motion: reduce)");
function flip(from,toRect){const sx=from.width/toRect.width,sy=from.height/toRect.height;return `translate(${from.left-toRect.left}px,${from.top-toRect.top}px) scale(${sx},${sy})`}
function openLb(i,fig){
  const it=LB[i];if(!it||busy)return;lastF=document.activeElement;srcF=fig||null;
  lbI.src=it.src;lbI.alt=it.cap;lbR=it.r||1.5;fitLb();showImk(imgKind(it.src));lb.hidden=false;document.body.style.overflow="hidden";
  const im=fig&&fig.querySelector("img");
  const go=()=>{
    if(RM.matches||!im){lb.classList.add("on");return}
    const to=lbI.getBoundingClientRect(),from=im.getBoundingClientRect();
    if(!to.width||!from.width){lb.classList.add("on");return}
    lbI.style.transition="none";lbI.style.transformOrigin="0 0";lbI.style.transform=flip(from,to);
    lbI.getBoundingClientRect();
    lbI.style.transition="";lbI.style.transform="";lb.classList.add("on");
  };
  if(lbI.complete&&lbI.naturalWidth)go();else{lbI.onload=()=>{lbI.onload=null;go()};lbI.onerror=()=>{lbI.onerror=null;lb.classList.add("on")}}
  $("#lbX").focus({preventScroll:true});
}
function closeLb(){
  if(lb.hidden||busy)return;showImk("");
  const y=scrollY,im=srcF&&srcF.querySelector("img"),fin=()=>{lb.hidden=true;lb.classList.remove("on");lbI.style.transform="";lbI.style.transition="";document.body.style.overflow="";busy=false;try{lastF&&lastF.focus&&lastF.focus({preventScroll:true})}catch(_){}if(scrollY!==y)scrollTo(0,y)};
  lb.classList.remove("on");
  if(RM.matches||!im){fin();return}
  const from=im.getBoundingClientRect(),to=lbI.getBoundingClientRect();
  if(!to.width||!from.width||from.bottom<0||from.top>innerHeight){fin();return}
  busy=true;lbI.style.transformOrigin="0 0";lbI.style.transform=flip(from,to);
  setTimeout(fin,430);
}
lb.addEventListener("click",closeLb);
lb.addEventListener("wheel",e=>{if(Math.abs(e.deltaY)>4)closeLb()},{passive:true});
let ty0=null;lb.addEventListener("touchstart",e=>{ty0=e.touches.length>1?null:e.touches[0].clientY},{passive:true});
lb.addEventListener("touchmove",e=>{if(e.touches.length>1){ty0=null;return}if(ty0!==null&&Math.abs(ty0-e.touches[0].clientY)>24){ty0=null;closeLb()}},{passive:true});
document.addEventListener("keydown",e=>{if(!lb.hidden&&["ArrowDown","ArrowUp","PageDown","PageUp"," "].includes(e.key)){e.preventDefault();closeLb()}});
/* UX-03: zmiana adresu (np. „wstecz”) zamyka powiększenie od razu */
window.__lbReset=()=>{if(lb.hidden)return;lb.hidden=true;lb.classList.remove("on");lbI.style.transform="";lbI.style.transition="";document.body.style.overflow="";busy=false;showImk("")};
/* PRA-22: w powiększeniu Tab nie wychodzi poza okno */
document.addEventListener("keydown",e=>{if(e.key==="Tab"&&!lb.hidden){e.preventDefault();$("#lbX").focus()}});
/* UX-04: zdjęcie galerii otwiera się też z klawiatury */
document.addEventListener("keydown",e=>{const f=e.target.closest&&e.target.closest("figure[data-i]");if(f&&lb.hidden&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openLb(+f.dataset.i,f)}});
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(!lb.hidden)closeLb();else if(!mnav.hidden){setMenu(false);mb.focus()}});
})();
