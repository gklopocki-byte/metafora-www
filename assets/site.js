/* NEW M METAFORA – wersja 2 (bez bibliotek, bez efektów)
   Widoki po #hash: start, prace[/dziedzina[/typ]], indeks[/dziedzina], (stare: projekty, domy… → przekierowanie),
   o-nas, proces, woodgood, zespol, media, filmy, kontakt, p-<id> (podstrona projektu). */
(function(){
"use strict";
const $=s=>document.querySelector(s);
const P=(window.PROJEKTY||[]).filter(p=>!p.x);   // x:1 = projekt ukryty (czeka na opracowanie)
const pad=n=>String(n).padStart(2,"0");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nb=s=>esc(s).replace(/(^|\s)([aiouwzAIOUWZ])\s/g,"$1$2 ");   // twarde spacje po spójnikach
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
const setMenu=o=>{mnav.hidden=!o;mb.setAttribute("aria-expanded",String(o));document.body.style.overflow=o?"hidden":"";if(o)$("#menuX").focus()};
mb.addEventListener("click",()=>setMenu(true));$("#menuX").addEventListener("click",()=>{setMenu(false);mb.focus()});
mnav.addEventListener("click",e=>{if(e.target.closest("a"))setMenu(false)});

/* stopka: Projekty · Studio · Obserwuj */
$("#footG").innerHTML=`<a class="logo" href="#start" aria-label="Metafora Architekci – strona główna"><img loading="lazy" src="img/logo-grafit.png" width="600" height="447" alt="Metafora Architekci"></a>
<div><h2>Prace</h2><ul>${DZA.map(([d,n])=>`<li><a href="#prace/${d}">${n}</a></li>`).join("")}<li><a href="#indeks">Indeks</a></li></ul></div>
<div><h2>Studio</h2><ul><li><a href="#o-nas">Pracownia</a></li><li><a href="#zespol">Zespół</a></li><li><a href="#proces">Proces</a></li><li><a href="#media">Media</a></li><li><a href="#kontakt">Kontakt</a></li></ul></div>
<div><h2>Obserwuj</h2><ul><li>Facebook</li><li>Instagram</li><li>LinkedIn</li><li>TikTok</li><li>Pinterest</li></ul></div>`;

/* ───── elementy wspólne ───── */
const metaOf=p=>[TN[p.T]||p.typ,p.w,p.y].filter(Boolean).map(esc).join("<i>|</i>");
const tile=(p,w)=>`<a class="tile${w?" w":""}" href="#p-${p.s}"><span class="tile-ph"><img loading="lazy" decoding="async" src="p/${p.s}/t.jpg${ver(p)}" alt="" width="1400" height="1050"></span><span class="ttl">${esc(p.t)}</span>${p.d?`<span class="d">${nb(p.d)}</span>`:""}<span class="meta">${metaOf(p)}</span></a>`;
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
  const f=byYear.find(p=>p.img&&p.img[0]&&p.img[0][1]>=1.3)||byYear[0],shown=new Set([f.s]);
  const newest=byYear.filter(p=>p.s!==f.s).slice(0,3);newest.forEach(p=>shown.add(p.s));
  let h=`<section class="hero" aria-label="Najnowszy projekt"><a href="#p-${f.s}" tabindex="-1" aria-hidden="true"><img src="p/${f.s}/${pad(f.img[0][0])}.jpg${ver(f)}" alt="" fetchpriority="high"></a>
  <div class="hero-t"><span class="lbl">Najnowszy projekt</span><h2 class="ttl"><a href="#p-${f.s}">${esc(f.t)}</a></h2><p class="meta">${metaOf(f)}</p><a class="more" href="#p-${f.s}">Zobacz projekt</a></div></section>`;
  h+=bl("Najnowsze",mix(newest,0),`<a class="more" href="#prace">Wszystkie prace</a>`);
  h+=`<section class="welcome" aria-label="Witamy"><span class="lbl">Witamy</span><h2>Wdzięczni i&nbsp;zafascynowani życiem</h2><p class="s">Projektujemy architekturę w&nbsp;trosce o&nbsp;życie</p><p class="t">Dbając o&nbsp;relacje między ludźmi w&nbsp;przestrzeni, projektujemy domy, wnętrza, hotele, budynki mieszkalne i&nbsp;usługowe, scenografie i&nbsp;produkt. Jest 2026, zaczynamy nowy rozdział.</p><a class="more" href="#o-nas">O nas</a></section>`;
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
  if(d){const ty=TYA(d);if(ty.length>1)h+=`<ul class="t2">`+[["","Wszystko",ofD(d).length],...ty.map(([k,,n])=>[k,n,ofT(k).length])].map(([k,n,c])=>`<li><a href="#${base}/${d}${k?"/"+k:""}"${(t||"")===k?' aria-current="true"':""}>${n}<sup>${c}</sup></a></li>`).join("")+`</ul>`}
  return h+`</nav>`;
}
function prace(d,t){
  if(d&&!DN[d])d="";if(t&&!(TN[t]&&TY.find(x=>x[0]===t)[1]===d))t="";
  const list=t?ofT(t):d?ofD(d):DZA.flatMap(([k])=>ofD(k));
  return head(d?DN[d]:"Prace")+chips("prace",d,t)+(list.length?mix(list,0):`<p class="empty">Wkrótce.</p>`);
}
function indeks(d){
  if(d&&!DN[d])d="";
  const grp=(d?DZA.filter(x=>x[0]===d):DZA).map(([k,n])=>{
    const l=ofD(k).sort((a,b)=>TY.findIndex(x=>x[0]===a.T)-TY.findIndex(x=>x[0]===b.T)||yr(b)-yr(a));
    return `<section class="ix-g"><h2 class="ix-h"><span class="ttl">${n}</span><span class="n">${l.length}</span></h2><ol class="ix">${l.map(p=>`<li><a href="#p-${p.s}" data-th="p/${p.s}/t.jpg${ver(p)}"><span class="ix-t">${esc(p.t)}</span><span class="ix-k">${esc(TN[p.T])}</span><span class="ix-w">${esc(p.w||"")}</span><span class="ix-y">${esc(p.y||"")}</span></a></li>`).join("")}</ol></section>`}).join("");
  return head("Indeks",`Wszystkie prace pracowni w&nbsp;jednym miejscu – ${P.length} pozycji.`)+chips("indeks",d,"")+`<div class="ix-w8">${grp}</div><img class="ix-pv" id="ixPv" alt="" hidden>`;
}
V.prace=()=>prace("","");V.indeks=()=>indeks("");
/* stare adresy (#projekty, #domy, #hotele…) prowadzą do nowych */
const OLD={projekty:"prace",design:"prace/design",scena:"prace/sztuka/scenografia"};
Object.entries(Z_KAT).forEach(([k,t])=>{const y=TY.find(x=>x[0]===t);OLD[k]="prace/"+y[1]+"/"+t});

V["o-nas"]=()=>head("O nas")+`<p class="statement">Architektura to przede wszystkim relacje: relacje między ludźmi, relacje między człowiekiem a&nbsp;przestrzenią.</p>
<div class="about">
  <figure class="f1"><img loading="lazy" src="img/o-nas/relacje.jpg" width="1050" height="1400" alt="Ludzie Metafory przy wspólnym stole"><figcaption>Relacje – od nich zaczyna się każdy projekt</figcaption></figure>
  <div class="t1">
    <p>Po naszych 30-letnich doświadczeniach jako samodzielni architekci zaczynamy w&nbsp;2026 nowy rozdział, w&nbsp;dojrzale dobranym zespole. Projektujemy dla Ciebie dobrą architekturę.</p>
    <p>Mówi się, że architekturę kupujemy oczami. Tak naprawdę kupujemy jednak dobre samopoczucie – nasze wyobrażenie, jak będziemy się czuć w&nbsp;tej przestrzeni. Bez człowieka, który dobrze się w&nbsp;niej czuje, nawet najpiękniejsza forma traci sens. A&nbsp;człowiek potrzebuje drugiego człowieka.</p>
    <p>Dlatego projektujemy przede wszystkim domy i&nbsp;wnętrza mieszkalne – tam potrzeby ludzi widać najwyraźniej. To, czego się o&nbsp;Nich uczymy, przenosimy na hotele i&nbsp;obiekty usługowe.</p>
    <p>W&nbsp;każdym projekcie dbamy o&nbsp;zdrowie użytkownika oraz ekologię Jego środowiska. Kochamy drewno, wierzymy, że jest to jeden z&nbsp;najlepszych materiałów budowlanych. Świadomie specjalizujemy się w&nbsp;projektowaniu głównie w&nbsp;technologii CLT.</p>
    <p>Wokół siebie mamy dobrych ludzi: przyjaciół, kolegów, sprawdzonych specjalistów. Dzięki temu architekturę możemy Wam nie tylko zaprojektować, ale i&nbsp;zrealizować. W&nbsp;dobrych relacjach.</p>
  </div>
  <div class="facts lines">
    <div><span class="n">1997</span><p>początek historii projektowej, od&nbsp;2005 pod marką Metafora</p></div>
    <div><span class="n">2026</span><p>nowa forma działalności – spółka z&nbsp;o.o.</p></div>
    <div><span class="n">160+</span><p>zaprojektowanych domów jednorodzinnych</p></div>
    <a class="wgl" href="#woodgood"><img loading="lazy" src="img/logo-woodgood.png" width="900" height="625" alt="WoodGood"><p>Nasza marka produktowa: domy modułowe z&nbsp;drewna klejonego krzyżowo (CLT).</p></a>
  </div>
  <figure class="f2"><img loading="lazy" src="img/o-nas/portret.jpg" width="995" height="1400" alt="Portret w fotelu"></figure>
</div>`;

const FAZY=[
["Marzenia, wizje","Projektowanie wstępne","4–8 tygodni",["To faza gromadzenia informacji, analiz i wniosków, które stają się fundamentem kolejnych faz. Poznajemy Twoje potrzeby, styl życia, cele i założenia.","Zapraszamy Cię na sesję twórczą: poznajemy się, inspirujemy, rozmawiamy o marzeniach, rozwiewamy obawy i urealniamy obraz. Analizujemy warunki terenowe – klimat, wiatry, nasłonecznienie, grunt, zieleń, sąsiedztwo, kontekst historyczny, prawo miejscowe i budowlane – a potem nakładamy na nie filtry zależne od Ciebie: styl życia, upodobania, budżet, terminy i cele. Tak powstaje pierwsza przymiarka domu na działce i wstępny program."],["Analizy warunków i wytycznych wyjściowych","Szkice proponowanych rozwiązań","Wytyczne do sposobu zabudowy","Wstępny program inwestycji","Wstępny budżet i harmonogram"],"Karta projektu i kwestionariusz do sesji twórczej (wzory wysyłamy), wypis i wyrys z rejestru gruntów, miejscowy plan albo warunki zabudowy, opinia geotechniczna, mapa 1:500 – a przede wszystkim otwartość, szczerość i zaufanie. Brakujące dokumenty możemy zlecić w Twoim imieniu."],
["Koncept","Projektowanie koncepcyjne","6–12 tygodni",["Układamy sposób i jakość życia w przestrzeni. Świadomie projektujemy relacje między domownikami, między ludźmi a przestrzenią i w samej przestrzeni. Powstaje bryła budynku, idea elewacji i jej kompozycja z krajobrazem.","Z wielu idei i szkiców wyłaniamy koncepcję spójną formalnie, programowo, budżetowo i funkcjonalnie – po akceptacji jest podstawą dalszej pracy. To dobry moment, żeby nadać inwestycji nazwę z charakterem, na przykład „Zakątek pod dębami”."],["Kilka spotkań twórczych","Koncepcja zagospodarowania terenu","Rzuty kondygnacji i elewacje","Model 3D","Wstępny kosztorys szacunkowy","Skorygowany harmonogram","Wizualizacje – na życzenie"],"Zaangażowania i czasu: decyzji o programie użytkowym, technologii i materiałach, akceptacji układu pomieszczeń i wstępnego budżetu oraz pełnomocnictwa do reprezentowania Cię w urzędach i u dostawców mediów."],
["Rozwój","Projektowanie zasadnicze, model cyfrowy i uzgodnienia","2–4 tygodnie + uzgodnienia",["Na podstawie zatwierdzonej koncepcji tworzymy cyfrowy model budynku i dokładnie sytuujemy go na mapie do celów projektowych. Doprecyzowujemy relacje przestrzenne i szczegóły, ostatecznie uzgadniamy technologie.","Do pracy zapraszamy inżynierów i specjalistów innych branż. To również czas na wystąpienie o warunki przyłączenia mediów i zjazd z drogi – jeśli chcesz, załatwimy to w Twoim imieniu. Rysunki wyglądają już jak budowlane, ale na ich podstawie nie można jeszcze budować."],["Projekt zagospodarowania terenu z sieciami","Rzuty kondygnacji","Elewacje z dyspozycją materiałową","Model cyfrowy 3D","Podkłady dla branż","Kosztorys szacunkowy"],"Ostatecznych decyzji o konstrukcji, elewacjach, dachu i technologiach. Do tego warunki przyłączenia mediów, wyłączenie z produkcji rolnej, uzgodnienie zjazdu, a na terenach chronionych – uzgodnienie konserwatorskie."],
["Pozwolenia","Projektowanie budowlane – rysunki „dla urzędu”","3–5 tygodni + ok. 90 dni procedury",["Na podstawie wcześniejszych opracowań i wspólnych decyzji przygotowujemy projekt budowlany potrzebny do uzyskania pozwolenia na budowę. Jego zakres służy weryfikacji w urzędzie, a po wydaniu decyzji staje się wiążący dla dalszych opracowań.","Jeśli zechcesz, reprezentujemy Cię w postępowaniu. Procedura trwa około 60 dni, do tego dochodzi wszczęcie i uprawomocnienie decyzji – realnie pozwolenia można się spodziewać po około 90 dniach od złożenia dokumentów."],["Projekt budowlany","Projekt zagospodarowania terenu","Złożenie wniosku w Twoim imieniu","Koordynacja administracyjna"],"Niewiele – większość decyzji już zapadła. Kontakty z urzędem, które bywają czasochłonne, możemy poprowadzić za Ciebie."],
["Technologia","Projektowanie techniczne – rysunki „dla budowlańców”","8–10 tygodni",["Równolegle z procedurą w urzędzie przygotowujemy projekt techniczny: koordynujemy branże i uzupełniamy projekt budowlany o dane technologiczne, konstrukcyjne i instalacyjne. Na jego podstawie można formalnie rozpocząć budowę i rozmawiać z wykonawcami.","To odpowiedni moment na wybór kierownika budowy. Pomagamy w rozmowach z wykonawcami, w negocjacjach i układaniu harmonogramu. Projekt techniczny nie jest jeszcze dokumentacją wykonawczą."],["Koordynacja międzybranżowa","Wielobranżowy projekt techniczny","Oświadczenie o wykonaniu projektu technicznego"],"Udziału w rozmowach z wykonawcami. Warto już teraz pomyśleć o projekcie wnętrz (faza 7) – przyłącza i instalacje ustawione na tym etapie to mniej zmian i kosztów na budowie."],
["Produkcja","Projektowanie wykonawcze, realizacja i nadzór","4–10 tygodni + 10–20 wizyt",["Wykonujemy rysunki szczegółowe: od detali architektonicznych przez konstrukcję po instalacje. Zakres ustalamy z kierownikiem budowy – im więcej wyjaśnimy w projekcie, tym mniej zostaje do interpretacji wykonawcy i tym mniej okazji do zmian w umówionych pracach.","Przy budowie prywatnej rysunki powstają sukcesywnie, z wyprzedzeniem prac. W tym czasie jesteśmy Twoim doradcą w kontaktach z wykonawcami i pomagamy podejmować decyzje techniczne."],["Rysunki wykonawcze konstrukcji, architektury i instalacji","Spotkania koordynacyjne z kierownikiem budowy","Nadzór autorski na budowie","Kosztorys inwestorski"],"Akceptacji niektórych rozwiązań szczegółowych. Najlepiej, gdy ta faza zazębia się z projektem wnętrz – unikamy wtedy zmian w trakcie prac wykończeniowych."],
["Haptyka","Projektowanie wnętrz, krajobrazu i zieleni","10–20 tygodni",["Projektujemy wnętrza: wspólnie dobieramy materiały, kolory, struktury i faktury, wygodne meble stałe i ruchome, oświetlenie i wyposażenie. Zestawiamy i zamawiamy materiały, a potem nadzorujemy ich montaż.","Projektujemy też otoczenie budynku – plany widokowe, sceny, perspektywy, może sad albo zielnik. Inwestycja to cała posesja, więc dom, wnętrze i ogród układamy spójnie, z pomocą specjalistów od zieleni i prac ogrodowych."],["Koncepcja wnętrz","Rysunki realizacyjne wnętrz","Projekt krajobrazu i zieleni","Nadzór autorski"],"Dużego zaangażowania: wyboru wykończeń i wczucia się w to, jak będziesz żyć w przestrzeni – w domu i wokół niego. My podpowiadamy scenariusze, decyzje są Twoje."],
["Praktyka","Zakwaterowanie, wyposażenie, organizacja","3–6 tygodni",["Wspólnie planujemy miejsce każdego elementu wyposażenia – od tkanin po naczynia i drobiazgi codziennego użytku. Dobrze ułożona przestrzeń od początku to łatwy porządek na lata.","Pomagamy dobrać nowe wyposażenie kolorystycznie, stylowo i ilościowo, a na koniec złożyć dokumenty o zakończeniu budowy. Potem po prostu przyjeżdżasz i zaczynasz mieszkać, pracować, tworzyć. Gratulacje!"],["Dyspozycja i adresacja wyposażenia","Indywidualny charakter wnętrza przez dobór detali","Katalog wyposażenia","Dokumenty o zakończeniu budowy"],"Bardzo dużego zaangażowania – to Ty będziesz używać każdego zakamarka. Każdą decyzję podejmujemy razem, świadomie i celowo."]];
V.proces=()=>head("Proces")+`<p class="lead-c">Metafora Standard. Projekt powstaje w&nbsp;ośmiu fazach – od marzeń po dzień wprowadzki. Każda kończy się konkretnym opracowaniem i&nbsp;Twoją akceptacją, a&nbsp;fazę&nbsp;1 traktujemy jako fundament każdej współpracy.</p><ol class="phases">`+
  FAZY.map((f,i)=>`<li class="ph"><button class="ph-b" type="button" aria-expanded="false" aria-controls="ph-${i+1}"><span class="no">Faza ${i+1}</span><span class="nm">${esc(f[0])}</span><span class="ds">${nb(f[1])}</span><span class="tm">${esc(f[2])}</span><span class="pl" aria-hidden="true">+</span></button><div class="ph-p" id="ph-${i+1}" hidden><div class="c1">${f[3].map(t=>`<p>${nb(t)}</p>`).join("")}</div><div class="c2"><span class="lbl">Wyniki</span><ul>${f[4].map(t=>`<li>${nb(t)}</li>`).join("")}</ul><span class="lbl">Potrzebujemy od Ciebie</span><p>${nb(f[5])}</p></div></div></li>`).join("")+`</ol>`;

V.woodgood=()=>`<div class="pg-h"><h1>WoodGood</h1></div><div class="wg-h"><img src="img/logo-woodgood.png" width="900" height="625" alt="WoodGood"><p>Nasza marka produktowa i&nbsp;kierunek rozwoju do&nbsp;2030: domy modułowe z&nbsp;drewna klejonego krzyżowo (CLT). Prefabrykacja, szybka budowa i&nbsp;zdrowy mikroklimat.</p></div>${mix(P.filter(p=>p.b==="wg"),0)}`;

const Z1=[["team-grzegorz","arch. Grzegorz Kłopocki","założyciel, prezes zarządu"],["team-klementyna","arch. Klementyna Kopczyńska-Kłopocka","współzałożycielka, dyrektor artystyczna"],["team-patryk","arch. Patryk Filis","w zespole Metafory"],["team-marianna","arch. Marianna Łata","architekt"],["team-hania","Hania Kłopocka","scenografka – projektuje przestrzeń dla teatru"]];
const Z2=[["branza-najbar","inż. Grzegorz Najbar","konstrukcje"],["branza-puzanowski","inż. Tomasz Puzanowski","instalacje sanitarne"],["branza-nejman","inż. Marcin Nejman","instalacje elektryczne i teletechniczne"],["branza-majda","inż. Mirosław Majda","kierownik budów, nadzory"],["branza-steczkiewicz","Krzysztof Steczkiewicz","oświetlenie architektury"],["branza-delineszew","Nikolaj Delineszew †","nauczyciel, mentor, konstruktor artysta – in memoriam"]];
const person=([f,n,r])=>`<figure class="person"><div class="pic"><img loading="lazy" decoding="async" src="img/zespol/${f}.jpg" width="900" height="1200" alt="${esc(n.replace(/^(arch\.|inż\.)\s/,"").replace(" †",""))}"></div><figcaption><span class="pn">${esc(n)}</span><span class="pr">${esc(r)}</span></figcaption></figure>`;
V.zespol=()=>head("Zespół","Dzięki fantastycznym ludziom, z&nbsp;którymi w&nbsp;przyjacielskich relacjach budujemy zespół, nasze projekty stają się Architekturą.")+`<div class="team">${Z1.map(person).join("")}</div><div class="sub-h"><h2 class="lbl">Wsparcie branżowe</h2></div><div class="team sm">${Z2.map(person).join("")}</div>`;

V.media=()=>head("Media","Artykuły, wywiady i&nbsp;filmy o&nbsp;naszych projektach.")+`<div class="mlist">
<div class="mrow"><span class="n">2018</span><span class="t">Murator</span><p>Wyróżnienie w&nbsp;konkursie Remont Roku 2018 miesięcznika „Murator” dla koncepcji mieszkania w&nbsp;poznańskiej kamienicy.</p><a class="more" href="#p-wnetrze-poznan-jezyce">Zobacz projekt</a></div>
<div class="mrow"><span class="n">2026</span><span class="t">Film o&nbsp;pracowni</span><p>Krótki film o&nbsp;tym, jak projektujemy.</p><a class="more" href="#filmy">Obejrzyj</a></div>
</div>`;
V.filmy=()=>head("Filmy")+`<div class="film"><video controls playsinline preload="none" poster="video/hero-poster.jpg"><source src="video/hero.mp4" type="video/mp4" media="(min-width: 901px)"><source src="video/hero-720.mp4" type="video/mp4"></video><p class="meta">Metafora Architekci<i>|</i>film o&nbsp;pracowni</p></div>`;

V.kontakt=()=>head("Kontakt")+`<div class="contact"><div class="cl">
  <p class="note">Opowiedzcie nam o&nbsp;swoim miejscu. Pierwsza rozmowa jest bezpłatna.</p>
  <div class="it"><span class="lbl">Telefon</span><span class="v">+48 606 355 220</span><span class="acts"><button type="button" data-copy="+48606355220">Kopiuj</button></span></div>
  <div class="it"><span class="lbl">E-mail</span><span class="v">biuro@metaforaarchitekci.pl</span><span class="acts"><button type="button" data-copy="biuro@metaforaarchitekci.pl">Kopiuj</button></span></div>
  <div class="it"><span class="lbl">Wrocław – biuro główne</span><span class="v">ul. Legnicka 55/10<br>54-203 Wrocław</span><span class="acts"><a href="https://www.google.com/maps/search/?api=1&amp;query=Legnicka%2055%2C%2054-203%20Wroc%C5%82aw" target="_blank" rel="noopener">Mapa</a></span></div>
  <div class="it"><span class="lbl">Wilkszyn – biuro domowe</span><span class="v">ul. Łąkowa 6<br>55-330 Wilkszyn</span><span class="acts"><a href="https://www.google.com/maps/search/?api=1&amp;query=%C5%81%C4%85kowa%206%2C%2055-330%20Wilkszyn" target="_blank" rel="noopener">Mapa</a></span></div>
</div><figure><img loading="lazy" src="p/dom-clt-probono-czerna/06.jpg" alt="Wnętrze domu z CLT w Czernej" style="aspect-ratio:${ratio("dom-clt-probono-czerna",6)}"></figure></div>`;

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
  const dl=[["Miejsce",p.w],["Rok",p.y],["Dziedzina",DN[p.D]+" · "+TN[p.T]],["Typ",DEF.includes(p.typ)?"":p.typ]].filter(x=>x[1]);
  let h=`<figure class="p-img${c[1]>=1.3?" hero":""}" data-i="0"><img src="p/${p.s}/${pad(c[0])}.jpg${v}" alt="${esc(p.t)}" style="--r:${c[1]}" fetchpriority="high"></figure>
  <div class="p-t"><h1>${esc(p.t)}</h1><p class="meta">${metaOf(p)}</p></div>
  ${p.d?`<div class="p-info"><dl class="p-dl">${dl.map(([a,b])=>`<div><dt>${a}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl><div class="p-d"><p>${nb(p.d)}</p>${p.b==="wg"?`<a class="wg" href="#woodgood"><img src="img/logo-woodgood.png" width="900" height="625" alt="WoodGood">Projekt marki WoodGood</a>`:""}</div></div>`:`<div class="p-sp"></div>`}<div class="bl-r"><aside class="bl-s" aria-hidden="true"><span class="vtag">${TAG}</span></aside><div class="bl-c gal">`;
  if(p.g&&p.g[0])h+=`<div class="ghead lbl">${esc(p.g[0])}</div>`;
  rows(items.slice(1)).forEach(row=>{
    if(row[0].g)h+=`<div class="ghead lbl">${esc(row[0].g)}</div>`;
    const portr=row.length>1&&row.every(x=>x.r<.95);
    h+=`<div class="grow${portr?" portr":""}">`+row.map(x=>`<figure style="flex:${x.r} 1 0" data-i="${x.q}"><img loading="lazy" decoding="async" src="p/${p.s}/${pad(x.n)}.jpg${v}" alt="${esc(p.t)} – ryc. ${x.q+1}" style="--r:${x.r}"></figure>`).join("")+`</div>`;
  });
  h+=`</div></div>`;
  if(p.pl&&p.pl.length){
    const base=LB.length;
    p.pl.forEach(([n,r])=>LB.push({src:`p/${p.s}/${pad(n)}.jpg${v}`,cap:p.t+" – "+(p.ph||"Rzut"),r}));
    const lines=(p.pr||[]).map(([a,b])=>`<div><span>${esc(a)}</span><span>${esc(b)}</span></div>`).join("")+(p.pu?`<div class="sum"><span>Powierzchnia użytkowa</span><span>${esc(p.pu)}</span></div>`:"");
    h+=`<section class="plan" aria-label="Rzut"><div class="pi"><h2>${esc(p.ph||"Rzut")}</h2>${lines?`<div class="lines">${lines}</div><p class="note">Powierzchnie orientacyjne.</p>`:""}</div><div class="pd">${p.pl.map(([n,r],k)=>`<figure data-i="${base+k}"><img loading="lazy" decoding="async" src="p/${p.s}/${pad(n)}.jpg${v}" alt="${esc(p.t)} – ${esc(p.ph||"rzut")}" style="--r:${r}"></figure>`).join("")}</div></section>`;
  }
  const same=ofT(p.T).length>1?ofT(p.T):ofD(p.D),nx=same[(same.indexOf(p)+1)%same.length];
  h+=`<nav class="next" aria-label="Nawigacja projektów"><a href="#prace/${p.D}${TYA(p.D).length>1?"/"+p.T:""}"><span class="lbl">Wróć</span><span class="ttl">${esc(DN[p.D]+(TYA(p.D).length>1?" · "+TN[p.T]:""))}</span></a>${nx!==p?`<a class="r nx" href="#p-${nx.s}"><span class="nx-t"><span class="lbl">Następny projekt</span><span class="ttl">${esc(nx.t)}</span><span class="meta">${metaOf(nx)}</span></span><span class="nx-ph"><img loading="lazy" decoding="async" src="p/${nx.s}/t.jpg${ver(nx)}" alt="" width="1400" height="933"></span></a>`:""}</nav>`;
  return h;
}

/* ───── routing ───── */
const view=$("#view");
function route(){
  let h=decodeURIComponent(location.hash.slice(1))||"start",html=null,group=h,title="New M Metafora";
  if(OLD[h]){history.replaceState(null,"","#"+OLD[h]);h=OLD[h]}
  const seg=h.split("/");
  if(h.startsWith("p-")){const p=P.find(x=>x.s===h.slice(2));if(p){html=project(p);group="prace";title=p.t+" – Metafora Architekci"}}
  else if(seg[0]==="prace"){html=prace(seg[1]||"",seg[2]||"");group=seg[1]?"prace/"+seg[1]:"prace";title=[DN[seg[1]],TN[seg[2]]].filter(Boolean).join(" · ")+(seg[1]?"":"Prace")+" – Metafora Architekci"}
  else if(seg[0]==="indeks"){html=indeks(seg[1]||"");group="indeks";title="Indeks – Metafora Architekci"}
  if(html===null){if(!V[h])h="start";html=V[h]();group=h;const n={"o-nas":"Pracownia",proces:"Proces",woodgood:"WoodGood",zespol:"Zespół",media:"Media",filmy:"Filmy",kontakt:"Kontakt"}[h];if(n)title=n+" – Metafora Architekci"}
  view.innerHTML=html;document.title=title;
  document.body.classList.toggle("hero-on",!!view.querySelector(".hero"));
  const top=MENU.find(m=>m.h===group||group.startsWith(m.h+"/")||(m.o&&m.o.some(o=>o[0]===group)));
  document.querySelectorAll("#nav a").forEach(a=>{const on=(a.dataset.g&&top&&a.dataset.g===top.h)||(a.dataset.h&&a.dataset.h===group);a.setAttribute("aria-current",on?"true":"false")});
  const hasHero=!!view.querySelector(".hero");
  document.querySelectorAll("#nav>ul>li").forEach(li=>li.classList.toggle("open",!hasHero&&!!top&&!!top.o&&li.firstElementChild.dataset.g===top.h));
  scrollTo(0,0);subOpen();heroText();hdrState();stkCache();
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
const STK_SEL="h1,h2,h3,p,figcaption,dt,dd,.ph-b,.lines>*,.mrow,.it,.ix-h,.ix li,.facts>*,.flt";
const STK_NOT=".tile,.bl-r,.hero,.gal,.plan,.next,.p-t,.p-info";
let STK=[],STOP=[];
function stkCache(){
  STK.forEach(o=>{o.el.style.transform="";o.el.style.opacity="";o.el.style.visibility=""});STK=[];STOP=[];
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
  const txt=hero&&(hero.querySelector(".hero-t")||hero.nextElementSibling);
  const solid=!hero||!txt||txt.getBoundingClientRect().top<hdrEl.offsetHeight+90;   // zapas na płynne przejście (0,7 s)
  document.body.classList.toggle("solid",solid);
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
const lb=$("#lb"),lbI=$("#lbI");let lastF=null,srcF=null,busy=false,lbR=1.5;
/* zdjęcie zawsze wypełnia ekran: na całą szerokość albo na całą wysokość */
function fitLb(){const w=Math.min(innerWidth,innerHeight*lbR);lbI.style.width=Math.round(w)+"px";lbI.style.height=Math.round(w/lbR)+"px"}
addEventListener("resize",()=>{if(!lb.hidden)fitLb()});
const RM=matchMedia("(prefers-reduced-motion: reduce)");
function flip(from,toRect){const sx=from.width/toRect.width,sy=from.height/toRect.height;return `translate(${from.left-toRect.left}px,${from.top-toRect.top}px) scale(${sx},${sy})`}
function openLb(i,fig){
  const it=LB[i];if(!it||busy)return;lastF=document.activeElement;srcF=fig||null;
  lbI.src=it.src;lbI.alt=it.cap;lbR=it.r||1.5;fitLb();lb.hidden=false;document.body.style.overflow="hidden";
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
  if(lb.hidden||busy)return;
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
let ty0=null;lb.addEventListener("touchstart",e=>{ty0=e.touches[0].clientY},{passive:true});
lb.addEventListener("touchmove",e=>{if(ty0!==null&&Math.abs(ty0-e.touches[0].clientY)>24){ty0=null;closeLb()}},{passive:true});
document.addEventListener("keydown",e=>{if(!lb.hidden&&["ArrowDown","ArrowUp","PageDown","PageUp"," "].includes(e.key)){e.preventDefault();closeLb()}});
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(!lb.hidden)closeLb();else if(!mnav.hidden)setMenu(false)});
})();
