const state={region:'전체',startDate:'',endDate:'',type:'매매',period:1};
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
const schoolData=[
  {name:'동대구초등학교',dong:'신암동',type:'공립 초등학교',walk:'도보 8분',classes:'24학급',feature:'주거지 안쪽의 비교적 안정적인 통학 동선'},
  {name:'신암중학교',dong:'신암동',type:'공립 중학교',walk:'도보 11분',classes:'18학급',feature:'동대구역 생활권과 가까운 중학교'},
  {name:'신천초등학교',dong:'신천동',type:'공립 초등학교',walk:'도보 7분',classes:'21학급',feature:'신천동 아파트 밀집지와 가까운 통학권'},
  {name:'효목초등학교',dong:'효목동',type:'공립 초등학교',walk:'도보 9분',classes:'19학급',feature:'효목 생활권 중심의 초등 통학 거점'},
  {name:'대구새론초등학교',dong:'각산동',type:'공립 초등학교',walk:'도보 6분',classes:'31학급',feature:'혁신도시 신축 주거지 중심의 통학 환경'},
  {name:'율하초등학교',dong:'율하동',type:'공립 초등학교',walk:'도보 5분',classes:'27학급',feature:'율하역·공원 생활권과 가까운 학교'},
  {name:'봉무초등학교',dong:'봉무동',type:'공립 초등학교',walk:'도보 10분',classes:'25학급',feature:'이시아폴리스 생활권의 주요 초등학교'},
  {name:'불로중학교',dong:'불로동',type:'공립 중학교',walk:'도보 12분',classes:'16학급',feature:'불로·봉무 생활권 학생이 이용하는 중학교'}
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
function daysFromToday(value){
  if(!value)return 0;
  const target=new Date(`${value}T12:00:00+09:00`),now=new Date();
  return Math.max(0,Math.round((now-target)/86400000));
}
function renderMetrics(){
  const d=typeData[state.type],m=currentMod(),dateShift=-(Math.min(daysFromToday($('#endDate').value),365)*.003);
  const index=d.index+m*.12+dateShift,avg=d.avg*(1+m/100+dateShift/100);
  $('#indexValue').textContent=index.toFixed(1);$('#indexChange').textContent=d.change;
  $('#avgPrice').textContent=state.type==='월세'?`${Math.round(avg)} / 1억`:formatPrice(avg);
  $('#pyeongPrice').textContent=state.type==='월세'?d.pyeong.toFixed(1):Math.round(d.pyeong*(1+m/100)).toLocaleString();
  const rangeDays=Math.max(1,Math.round((new Date($('#endDate').value)-new Date($('#startDate').value))/86400000)+1);
  $('#dealCount').textContent=Math.max(1,Math.round(d.count*(1+(m/100)*.6)*(Math.min(rangeDays,31)/31))).toLocaleString();
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
function selectSchool(name){
  const school=schoolData.find(s=>s.name===name)||schoolData[0];
  $$('.school-chip').forEach(b=>b.classList.toggle('active',b.dataset.school===school.name));
  $$('.school-map-pin').forEach(b=>b.classList.toggle('active',b.dataset.school===school.name));
  $('#schoolSelected').innerHTML=`<div><span>선택 학교</span><b>${school.name}</b><p>${school.feature}</p></div><div><span>학교 유형</span><b>${school.type}</b></div><div><span>생활권</span><b>${school.dong}</b></div><div><span>예상 접근</span><b>${school.walk}</b><p>${school.classes}</p></div>`;
}
function renderSchoolExplorer(){
  const matches=state.region==='전체'?schoolData:schoolData.filter(s=>s.dong===state.region);
  const list=matches.length?matches:schoolData.slice(0,4);
  $('#schoolList').innerHTML=list.map((s,i)=>`<button class="school-chip ${i===0?'active':''}" data-school="${s.name}"><b>${s.name}</b><span>${s.dong} · ${s.type.replace('공립 ','')}</span></button>`).join('');
  $$('.school-chip').forEach(b=>b.addEventListener('click',()=>selectSchool(b.dataset.school)));
  selectSchool(list[0].name);
}
function renderLocation(key){const d=locData[key];$('#locLabel').textContent=d.label;$('#locTitle').textContent=d.title;$('#locDesc').textContent=d.desc;$('#locScore').textContent=d.score;$('.score-ring').style.setProperty('--score',d.score);$('#locFacts').innerHTML=d.facts.map(f=>`<div class="detail-fact"><span>${f[0]}</span><b>${f[1]}</b><small>${f[2]}</small></div>`).join('');$('#locNote').textContent=d.note;const schoolMode=key==='school';$('#schoolExplorer').hidden=!schoolMode;$('#locationDetail').classList.toggle('school-mode',schoolMode);if(schoolMode)renderSchoolExplorer()}
function updateRegion(region){state.region=region;$('#regionSelect').value=region;$('#heroRegion').textContent=region==='전체'?'동구 전체':region;$('#mapRegion').textContent=region==='전체'?'동구 전체':region;const score=Math.round(82+currentMod()*.6);$('#mapTransit').textContent=score>=87?'A+':score>=83?'A':'B+';$('#mapSchool').textContent=score>=85?'A':'B+';$('#mapLife').textContent=score>=86?'A':'A−';renderAll();if($('.location-tab.active')?.dataset.loc==='school')renderSchoolExplorer()}
function renderAll(){renderMetrics();renderChart();renderRankings()}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}

function setDailyDates(){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const pick=t=>parts.find(p=>p.type===t).value;
  const today=`${pick('year')}-${pick('month')}-${pick('day')}`;
  const firstDay=`${pick('year')}-${pick('month')}-01`;
  $('#todayDate').textContent=`${pick('year')}.${pick('month')}.${pick('day')}`;
  $('#startDate').value=firstDay;$('#endDate').value=today;
  $('#startDate').max=today;$('#endDate').max=today;
  state.startDate=firstDay;state.endDate=today;
}
$('#regionSelect').addEventListener('change',e=>updateRegion(e.target.value));
$('#startDate').addEventListener('change',e=>{state.startDate=e.target.value;$('#endDate').min=e.target.value});
$('#endDate').addEventListener('change',e=>{state.endDate=e.target.value;$('#startDate').max=e.target.value});
$$('#dealType button').forEach(b=>b.addEventListener('click',()=>{$$('#dealType button').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.type=b.dataset.type;renderAll()}));
$$('#periodControl button').forEach(b=>b.addEventListener('click',()=>{$$('#periodControl button').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.period=+b.dataset.period;renderChart()}));
$('#applyButton').addEventListener('click',()=>{state.startDate=$('#startDate').value;state.endDate=$('#endDate').value;if(!state.startDate||!state.endDate||state.startDate>state.endDate){toast('조회 기간을 올바르게 선택해 주세요.');return}renderAll();toast(`${state.startDate} ~ ${state.endDate} · ${state.region==='전체'?'동구 전체':state.region} · ${state.type} 기준으로 갱신했습니다.`)});
$('#searchInput').addEventListener('input',renderRankings);
$$('.location-tab').forEach(b=>b.addEventListener('click',()=>{$$('.location-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderLocation(b.dataset.loc)}));
$$('.map-pin').forEach(b=>b.addEventListener('click',()=>{updateRegion(b.dataset.region);toast(`${b.dataset.region} 생활권을 선택했습니다.`)}));$('#resetMap').addEventListener('click',()=>updateRegion('전체'));
$$('.school-map-pin').forEach(b=>{b.addEventListener('click',()=>{const school=schoolData.find(s=>s.name===b.dataset.school);if(school)updateRegion(school.dong);const schoolTab=$('.location-tab[data-loc="school"]');$$('.location-tab').forEach(x=>x.classList.remove('active'));schoolTab.classList.add('active');renderLocation('school');selectSchool(b.dataset.school);document.getElementById('location').scrollIntoView({behavior:'smooth'});toast(`${b.dataset.school} 정보를 열었습니다.`)});b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();b.dispatchEvent(new Event('click'))}})});
$$('.nav-link').forEach(b=>b.addEventListener('click',()=>{document.getElementById(b.dataset.scroll).scrollIntoView({behavior:'smooth'});$$('.nav-link').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
$$('.mini-info').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.tip)));$$('[data-expand]').forEach(b=>b.addEventListener('click',()=>toast('현재 조건의 상위 10개 단지를 표시하고 있습니다.')));
const dialog=$('#infoDialog');$('#helpButton').addEventListener('click',()=>dialog.showModal());$('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
setDailyDates();renderLocation('school');renderAll();
