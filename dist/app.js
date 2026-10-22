const state={region:'전체',date:'2026년 9월',type:'매매',period:1};
const regionMods={전체:0,'신천동':9.4,'신암동':2.7,'효목동':1.2,'봉무동':7.1,'불로동':-5.8,'각산동':3.9,'율하동':4.8,'지묘동':-1.9,'검사동':-4.1};
const typeData={
  '매매':{index:104.8,change:'+0.62%',avg:43820,pyeong:1438,count:286,insight:'매매 지수 3개월 연속 상승',sub:'혁신도시·동대구역 생활권이 상승을 견인했어요.',series:[99.2,99.6,99.9,100.1,100.6,101.1,101.7,102.0,102.8,103.3,104.1,104.8]},
  '전세':{index:103.1,change:'+0.38%',avg:28640,pyeong:942,count:214,insight:'전세 수요, 역세권 중심 회복',sub:'신천·율하동 중소형 단지의 회전율이 빨라졌어요.',series:[99.4,99.1,99.6,100.0,100.2,100.7,101.1,101.5,101.9,102.2,102.7,103.1]},
  '월세':{index:101.7,change:'+0.21%',avg:86,pyeong:3.2,count:172,insight:'월세 거래량은 전월과 비슷',sub:'보증금 1억 미만·월 70~100만 원 구간이 중심이에요.',series:[100,100.2,100.1,100.4,100.6,100.8,100.9,101.0,101.2,101.4,101.5,101.7]}
};
const apartments=[
  {n:'동대구역 화성파크드림',dong:'신암동',price:98500,py:2410,area:'84㎡',age:'2023'},
  {n:'동대구역 센텀 화성파크드림',dong:'신천동',price:93200,py:2350,area:'84㎡',age:'2022'},
  {n:'동대구역 더샵 센터시티',dong:'신천동',price:89500,py:2290,area:'84㎡',age:'2022'},
  {n:'이안 센트럴D',dong:'신암동',price:85200,py:2210,area:'84㎡',age:'2021'},
  {n:'안심역 코오롱하늘채',dong:'괴전동',price:76800,py:1980,area:'84㎡',age:'2017'},
  {n:'율하 롯데캐슬 TOPCLASS',dong:'율하동',price:74100,py:1910,area:'84㎡',age:'2015'},
  {n:'이시아폴리스 더샵 4차',dong:'봉무동',price:71800,py:1860,area:'84㎡',age:'2014'},
  {n:'대구혁신 LH이노힐즈',dong:'각산동',price:69400,py:1810,area:'84㎡',age:'2016'},
  {n:'태왕메트로시티',dong:'효목동',price:64800,py:1760,area:'84㎡',age:'2003'},
  {n:'봉무청구새들마을',dong:'봉무동',price:61100,py:1680,area:'84㎡',age:'2001'}
];
const locData={
  school:{label:'EDUCATION',title:'아이의 하루가 가까워지는 학군',desc:'초등학교 접근성과 학원가 밀집도, 통학 안전 요소를 함께 평가했습니다.',score:82,facts:[['초등학교','32개','동구 전체'],['도보 통학권','71%','단지 기준'],['학원 시설','486개','생활권 합계']],note:'율하·각산 생활권은 학교와 신축 주거지가 가깝고, 신천·신암 생활권은 학원 및 문화시설 접근성이 상대적으로 우수합니다.'},
  transit:{label:'MOBILITY',title:'대구 도심을 잇는 입체적인 교통망',desc:'주요 도로 진입성과 버스 노선, 출퇴근 시간대 접근성을 분석했습니다.',score:88,facts:[['도심 접근','18분','차량 기준'],['간선버스','42개','노선 수'],['IC 접근','12분','평균']],note:'동대구역 일대는 도심·광역 이동이 모두 편리합니다. 혁신도시는 차량 이동성이 좋지만 출퇴근 시간대 정체 변수를 함께 살펴보세요.'},
  subway:{label:'METRO',title:'역과 가까울수록 넓어지는 생활 반경',desc:'도시철도 1호선 역세권과 환승 편의, 평균 도보 거리를 반영했습니다.',score:79,facts:[['도시철도역','8개','1호선'],['평균 배차','7.5분','평일 기준'],['역세권 단지','43%','도보 10분']],note:'신천·동대구역·율하·각산·안심 생활권은 1호선 이용이 편리합니다. 봉무·지묘 생활권은 버스 또는 차량 연계가 중요합니다.'},
  ktx:{label:'KTX & SRT',title:'전국을 하루 생활권으로 만드는 동대구역',desc:'KTX·SRT와 복합환승센터 접근 시간, 광역 이동 편의를 비교합니다.',score:94,facts:[['KTX 정차','상시','동대구역'],['서울까지','약 1시간 50분','KTX'],['환승센터','1곳','복합교통']],note:'신천·신암·효목동은 동대구역 직접 수혜 생활권입니다. 장거리 출장이 잦다면 역 접근 시간과 주차·환승 편의를 우선 확인하세요.'},
  gtx:{label:'REGIONAL RAIL',title:'대경선으로 연결되는 더 큰 생활권',desc:'광역철도 운영축과 예정 교통망의 생활권 확장 가능성을 살펴봅니다.',score:85,facts:[['광역철도','대경선','운영축'],['주요 거점','구미–경산','연결'],['환승 허브','동대구역','핵심']],note:'광역철도 효과는 역 접근성과 환승 편의에 따라 달라집니다. 계획 노선은 일정 변경 가능성이 있으므로 계약 전 최신 공공 발표를 확인하세요.'},
  life:{label:'DAILY LIFE',title:'장보기부터 산책까지 가까운 일상',desc:'대형 쇼핑시설, 의료기관, 공원과 문화공간의 접근성을 종합했습니다.',score:87,facts:[['종합병원','4곳','생활권 내'],['대형 상업시설','6곳','복합몰 포함'],['공원·녹지','우수','팔공산 연계']],note:'동대구역은 복합상업시설, 봉무동은 쇼핑·레저, 혁신도시는 녹지와 신축 생활 인프라의 강점이 뚜렷합니다.'}
};

const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
function formatPrice(v){return v>=10000?`${Math.floor(v/10000)}억 ${Math.round(v%10000).toLocaleString()}`:Math.round(v).toLocaleString()}
function currentMod(){return regionMods[state.region]||0}
function renderMetrics(){
  const d=typeData[state.type],m=currentMod(),dateShift=-($('#dateSelect').selectedIndex*.28);
  const index=d.index+m*.12+dateShift,avg=d.avg*(1+m/100+dateShift/100);
  $('#indexValue').textContent=index.toFixed(1);$('#indexChange').textContent=d.change;
  $('#avgPrice').textContent=state.type==='월세'?`${Math.round(avg)} / 1억`:formatPrice(avg);
  $('#pyeongPrice').textContent=state.type==='월세'?d.pyeong.toFixed(1):Math.round(d.pyeong*(1+m/100)).toLocaleString();
  $('#dealCount').textContent=Math.max(31,Math.round(d.count*(1+(m/100)*.6)-$('#dateSelect').selectedIndex*7)).toLocaleString();
  $('#chartSummary').textContent=index.toFixed(1);$('#chartModeLabel').textContent=`${state.type} 지수`;
  $('#heroInsight').textContent=d.insight;$('#heroInsightSub').textContent=d.sub;
}
function renderChart(){
  const d=typeData[state.type],m=currentMod()*.12;let vals=d.series.map((v,i)=>v+m*(i/11));
  if(state.period>1){const n=state.period*12;vals=Array.from({length:n},(_,i)=>{const x=i/(n-1);return 91+(d.series.at(-1)+m-91)*x+Math.sin(i*.8)*.34+(i>n*.72?x*.8:0)})}
  const w=760,h=210,p={l:38,r:18,t:20,b:28};const min=Math.floor(Math.min(...vals)-1),max=Math.ceil(Math.max(...vals)+1);
  const x=i=>p.l+i*(w-p.l-p.r)/(vals.length-1),y=v=>p.t+(max-v)*(h-p.t-p.b)/(max-min);
  const pts=vals.map((v,i)=>`${x(i)},${y(v)}`).join(' ');const area=`M${x(0)},${h-p.b} L${pts.replaceAll(' ',',')} L${x(vals.length-1)},${h-p.b} Z`;
  const ticks=[min,(min+max)/2,max];const dateLabels=state.period===1?['25.10','26.01','26.04','26.07','26.09']:state.period===3?['23.10','24.07','25.04','26.01','26.09']:['21.10','23.01','24.04','25.07','26.09'];
  $('#lineChart').innerHTML=`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff705d" stop-opacity=".22"/><stop offset="1" stop-color="#ff705d" stop-opacity="0"/></linearGradient></defs>${ticks.map(t=>`<line class="grid-line" x1="${p.l}" y1="${y(t)}" x2="${w-p.r}" y2="${y(t)}"/><text class="axis-label" x="0" y="${y(t)+3}">${t.toFixed(0)}</text>`).join('')}<path class="area-path" d="${area}"/><polyline class="line-path" points="${pts}"/>${vals.map((v,i)=>i===vals.length-1?`<circle class="line-point" cx="${x(i)}" cy="${y(v)}" r="4"/>`:``).join('')}<line class="hover-guide" x1="${x(vals.length-1)}" y1="${p.t}" x2="${x(vals.length-1)}" y2="${h-p.b}"/><rect class="chart-tooltip" x="${x(vals.length-1)-47}" y="${y(vals.at(-1))-31}" width="45" height="22" rx="5"/><text class="tooltip-text" x="${x(vals.length-1)-24.5}" y="${y(vals.at(-1))-17}" text-anchor="middle">${vals.at(-1).toFixed(1)}</text>${dateLabels.map((t,i)=>`<text class="axis-label" x="${p.l+i*(w-p.l-p.r)/(dateLabels.length-1)}" y="${h-7}" text-anchor="${i===0?'start':i===dateLabels.length-1?'end':'middle'}">${t}</text>`).join('')}</svg>`;
}
function renderRankings(){
  const mult=state.type==='매매'?1:state.type==='전세'?.63:.024;const mod=1+currentMod()/100;
  const filtered=apartments.filter(a=>(state.region==='전체'||a.dong===state.region)&&(!$('#searchInput').value||a.n.includes($('#searchInput').value.trim())));
  const list=filtered.length?filtered:apartments;const maxPrice=Math.max(...list.map(a=>a.price));const maxPy=Math.max(...list.map(a=>a.py));
  $('#priceRanking').innerHTML=list.slice(0,10).map((a,i)=>`<div class="rank-row"><span class="rank-no ${i<3?'top':''}">${String(i+1).padStart(2,'0')}</span><span class="rank-name">${a.n}<small class="rank-sub">${a.dong} · ${a.area} · ${a.age}년</small></span><span class="rank-bar"><i style="width:${a.price/maxPrice*100}%"></i></span><span class="rank-price">${state.type==='월세'?`${Math.round(a.price*mult/100)}만`:formatPrice(a.price*mult*mod)}<small>${state.type==='월세'?'월세 / 보증금 별도':state.type+' 실거래'}</small></span></div>`).join('');
  $('#pyeongRanking').innerHTML=[...list].sort((a,b)=>b.py-a.py).slice(0,10).map((a,i)=>`<div class="rank-row"><span class="rank-no ${i<3?'top':''}">${String(i+1).padStart(2,'0')}</span><span class="rank-name">${a.n}<small class="rank-sub">${a.dong} · ${a.area} · ${a.age}년</small></span><span class="rank-bar"><i style="width:${a.py/maxPy*100}%"></i></span><span class="rank-price">${state.type==='월세'?(a.py*mult/10).toFixed(1):Math.round(a.py*mult*mod).toLocaleString()}<small>만원 / 3.3㎡</small></span></div>`).join('');
}
function renderLocation(key){const d=locData[key];$('#locLabel').textContent=d.label;$('#locTitle').textContent=d.title;$('#locDesc').textContent=d.desc;$('#locScore').textContent=d.score;$('.score-ring').style.setProperty('--score',d.score);$('#locFacts').innerHTML=d.facts.map(f=>`<div class="detail-fact"><span>${f[0]}</span><b>${f[1]}</b><small>${f[2]}</small></div>`).join('');$('#locNote').textContent=d.note}
function updateRegion(region){state.region=region;$('#regionSelect').value=region;$('#heroRegion').textContent=region==='전체'?'동구 전체':region;$('#mapRegion').textContent=region==='전체'?'동구 전체':region;const score=Math.round(82+currentMod()*.6);$('#mapTransit').textContent=score>=87?'A+':score>=83?'A':'B+';$('#mapSchool').textContent=score>=85?'A':'B+';$('#mapLife').textContent=score>=86?'A':'A−';renderAll()}
function renderAll(){renderMetrics();renderChart();renderRankings()}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}

$('#regionSelect').addEventListener('change',e=>updateRegion(e.target.value));$('#dateSelect').addEventListener('change',e=>{state.date=e.target.value});
$$('#dealType button').forEach(b=>b.addEventListener('click',()=>{$$('#dealType button').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.type=b.dataset.type;renderAll()}));
$$('#periodControl button').forEach(b=>b.addEventListener('click',()=>{$$('#periodControl button').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.period=+b.dataset.period;renderChart()}));
$('#applyButton').addEventListener('click',()=>{state.date=$('#dateSelect').value;renderAll();toast(`${state.date} · ${state.region==='전체'?'동구 전체':state.region} · ${state.type} 기준으로 갱신했습니다.`)});
$('#searchInput').addEventListener('input',renderRankings);
$$('.location-tab').forEach(b=>b.addEventListener('click',()=>{$$('.location-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderLocation(b.dataset.loc)}));
$$('.map-pin').forEach(b=>b.addEventListener('click',()=>{updateRegion(b.dataset.region);toast(`${b.dataset.region} 생활권을 선택했습니다.`)}));$('#resetMap').addEventListener('click',()=>updateRegion('전체'));
$$('.nav-link').forEach(b=>b.addEventListener('click',()=>{document.getElementById(b.dataset.scroll).scrollIntoView({behavior:'smooth'});$$('.nav-link').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
$$('.mini-info').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.tip)));$$('[data-expand]').forEach(b=>b.addEventListener('click',()=>toast('현재 조건의 상위 10개 단지를 표시하고 있습니다.')));
const dialog=$('#infoDialog');$('#helpButton').addEventListener('click',()=>dialog.showModal());$('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
renderLocation('school');renderAll();
