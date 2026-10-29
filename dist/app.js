const state={region:'전체',startDate:'',endDate:'',type:'매매',period:1,transactions:[],dataMeta:null,dataReady:false};
const AREA_MIN=84,AREA_MAX=85;

function filteredTransactions({respectDates=true,respectSearch=true}={}){
  const query=$('#searchInput')?.value.trim()||'';
  return state.transactions.filter(t=>t.type===state.type
    &&t.area>=AREA_MIN&&t.area<AREA_MAX
    &&(state.region==='전체'||t.dong===state.region)
    &&(!respectDates||(!state.startDate||t.date>=state.startDate)&&(!state.endDate||t.date<=state.endDate))
    &&(!respectSearch||!query||t.apartment.includes(query)));
}
function transactionValue(t){return state.type==='월세'?t.monthlyRent:t.amount}
function valueFor(t,type=t.type){return type==='월세'?t.monthlyRent:t.amount}
function median(values){const a=[...values].sort((x,y)=>x-y);if(!a.length)return 0;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2}
function average(values){return values.length?values.reduce((a,b)=>a+b,0)/values.length:0}
function pyeongValue(t){return transactionValue(t)/(t.area/3.3)}
function areaRows(type=state.type,start=state.startDate,end=state.endDate,region=state.region){return state.transactions.filter(t=>t.type===type&&t.area>=AREA_MIN&&t.area<AREA_MAX&&(region==='전체'||t.dong===region)&&(!start||t.date>=start)&&(!end||t.date<=end))}
function dateShift(value,days){const d=new Date(`${value}T12:00:00+09:00`);d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function pctChange(current,previous){return previous?(current/previous-1)*100:null}
function setChange(id,value,suffix='%'){const el=$(id);if(value===null||!Number.isFinite(value)){el.textContent='비교 자료 없음';el.className='';return}const sign=value>0?'+':value<0?'−':'';el.textContent=`${sign}${Math.abs(value).toFixed(1)}${suffix}`;el.className=value>0?'positive':value<0?'negative':''}
function currentMonth(){return (state.endDate||new Date().toISOString().slice(0,10)).slice(0,7)}
function dataEmpty(target,message){target.innerHTML=`<div class="data-empty"><b>${message}</b><span>조회 조건을 바꾸거나 데이터 갱신 상태를 확인해 주세요.</span></div>`}
async function loadTransactions(){
  try{
    const response=await fetch(`data/transactions.json?v=${Date.now()}`,{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const payload=await response.json();
    state.transactions=Array.isArray(payload.transactions)?payload.transactions:[];
    state.dataMeta=payload.meta||null;state.dataReady=state.transactions.length>0;
    if(state.dataReady){
      const latest=state.transactions.reduce((v,t)=>t.date>v?t.date:v,'');
      const generated=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(state.dataMeta.generatedAt));
      $('#dataFreshness').textContent=`전용 84㎡형 · 국토교통부 실거래가 · ${latest} 계약까지 · ${generated} 갱신`;
    }else $('#dataFreshness').textContent='실거래 자료 첫 동기화 대기 중';
  }catch(error){
    console.error(error);$('#dataFreshness').textContent='실거래 자료를 불러오지 못했습니다';
  }
}
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
function formatPrice(v){
  const rounded=Math.round(v);
  if(rounded<10000)return rounded.toLocaleString();
  const remainder=rounded%10000;
  return `${Math.floor(rounded/10000)}억${remainder?` ${remainder.toLocaleString()}`:''}`;
}
function renderMetrics(){
  if(!state.dataReady)return;
  const rows=filteredTransactions({respectSearch:false}),values=rows.map(transactionValue).filter(Boolean),avg=average(values),py=average(rows.map(pyeongValue));
  const days=Math.max(1,Math.round((new Date(state.endDate)-new Date(state.startDate))/86400000)+1),prevEnd=dateShift(state.startDate,-1),prevStart=dateShift(prevEnd,-days+1),prevRows=areaRows(state.type,prevStart,prevEnd),prevAvg=average(prevRows.map(t=>valueFor(t)).filter(Boolean)),prevPy=average(prevRows.map(t=>valueFor(t)/(t.area/3.3)));
  const monthly=new Map();areaRows(state.type,'','',state.region).forEach(t=>{const k=t.date.slice(0,7);if(!monthly.has(k))monthly.set(k,[]);monthly.get(k).push(valueFor(t))});
  const keys=[...monthly.keys()].sort().slice(-12),monthMedians=keys.map(k=>median(monthly.get(k))),base=monthMedians[0]||1,last=monthMedians.at(-1)||0,previous=monthMedians.at(-2)||0,index=last/base*100,indexDelta=pctChange(last,previous);
  $('#indexValue').textContent=index.toFixed(1);setChange('#indexChange',indexDelta);
  $('#avgPrice').textContent=state.type==='월세'?`${Math.round(avg).toLocaleString()}만`:formatPrice(avg);
  $('#pyeongPrice').textContent=py?Math.round(py).toLocaleString():'—';$('#dealCount').textContent=rows.length.toLocaleString();
  setChange('#avgChange',pctChange(avg,prevAvg));setChange('#pyeongChange',pctChange(py,prevPy));setChange('#dealChange',pctChange(rows.length,prevRows.length));
  const sales=areaRows('매매',state.startDate,state.endDate),leases=areaRows('전세',state.startDate,state.endDate),saleMedian=median(sales.map(t=>t.amount)),leaseMedian=median(leases.map(t=>t.amount)),rate=saleMedian?leaseMedian/saleMedian*100:0;
  $('#jeonseRate').textContent=rate?rate.toFixed(1):'—';$('#jeonseNote').textContent=rate?'84형 중위가격 기준':'비교 자료 없음';
  $('#chartSummary').textContent=index.toFixed(1);$('#chartModeLabel').textContent=`${state.type} 84형 지수`;setChange('#chartChange',indexDelta);
  $('#heroInsight').textContent=rows.length?`${state.type} 84형 실거래 ${rows.length.toLocaleString()}건`:'선택 기간에 신고된 거래가 없습니다';
  $('#heroInsightSub').textContent=`직전 동기간 ${prevRows.length.toLocaleString()}건 · 취소·해제 거래 제외`;
}
function renderDailyBrief(){
  if(!state.dataReady)return;
  const month=currentMonth(),monthStart=`${month}-01`,monthRows=areaRows(state.type,monthStart,state.endDate),monthValues=monthRows.map(t=>valueFor(t)).filter(Boolean),monthMedian=median(monthValues);
  const prevMonthDate=new Date(`${monthStart}T12:00:00+09:00`);prevMonthDate.setMonth(prevMonthDate.getMonth()-1);const prevMonth=prevMonthDate.toISOString().slice(0,7),prevMonthRows=areaRows(state.type,`${prevMonth}-01`,`${prevMonth}-31`),prevMonthMedian=median(prevMonthRows.map(t=>valueFor(t)).filter(Boolean)),monthDelta=pctChange(monthMedian,prevMonthMedian);
  const groups=new Map();monthRows.forEach(t=>groups.set(t.apartment,(groups.get(t.apartment)||0)+1));const active=[...groups.entries()].sort((a,b)=>b[1]-a[1])[0]||['거래 없음',0];
  const highest=[...monthRows].sort((a,b)=>valueFor(b)-valueFor(a))[0];
  const metaNew=state.region==='전체'?state.dataMeta?.newSincePrevious?.[state.type]:state.dataMeta?.newByDong?.[state.region]?.[state.type];const newText=Number.isFinite(metaNew)?`${metaNew.toLocaleString()}건`:'집계 준비 중';
  const deltaText=monthDelta===null?'비교 자료 없음':`${monthDelta>0?'+':monthDelta<0?'−':''}${Math.abs(monthDelta).toFixed(1)}%`;
  $('#briefList').innerHTML=`<li><span>1</span><p>직전 갱신 이후 새로 공개된 ${state.region==='전체'?'동구 전체':state.region} 84형 ${state.type}는 <b>${newText}</b>입니다.</p></li><li><span>2</span><p>${month.replace('-','년 ')}월 계약 누적은 <b>${monthRows.length.toLocaleString()}건</b>, 거래가 가장 모인 단지는 <b>${active[0]} ${active[1]}건</b>입니다.</p></li><li><span>3</span><p>이번 달 중위가격은 <b>${state.type==='월세'?`${Math.round(monthMedian).toLocaleString()}만원`:formatPrice(monthMedian)}</b>, 직전 달 대비 <b class="${monthDelta>0?'positive':monthDelta<0?'negative':''}">${deltaText}</b>입니다${highest?`, 최고 거래는 ${highest.apartment} ${state.type==='월세'?`${highest.monthlyRent.toLocaleString()}만원`:formatPrice(highest.amount)}입니다.`:'.'}</p></li>`;
  const generated=new Date(state.dataMeta.generatedAt);$('#reportDate').textContent=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'long',day:'numeric',weekday:'short'}).format(generated);
  $('#briefSource').textContent=`출처: 국토교통부 실거래가 공개 API · ${new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(generated)} 조회 · 최근 계약은 신고기한으로 늘어날 수 있습니다.`;
  const ninetyStart=dateShift(state.endDate,-89),recent=areaRows(state.type,ninetyStart,state.endDate),recentGroups=new Map();recent.forEach(t=>recentGroups.set(t.apartment,(recentGroups.get(t.apartment)||0)+1));const featured=[...recentGroups.entries()].sort((a,b)=>b[1]-a[1])[0]||active;const featuredRows=recent.filter(t=>t.apartment===featured[0]).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
  $('#featuredComplexName').textContent=featured[0];$('#featuredComplexCount').textContent=`최근 90일 ${featured[1]}건`;const first=featuredRows[0];$('#featuredComplexMeta').textContent=first?`${first.dong} · 전용 84㎡형 · ${state.type} 거래 집중 단지`:'선택 조건에 해당하는 거래가 없습니다.';
  $('#recentDeals').innerHTML=featuredRows.length?`<div class="recent-row recent-head"><span>계약일</span><span>층</span><span>${state.type==='월세'?'보증금 / 월세':'거래금액'}</span></div>${featuredRows.map(t=>`<div class="recent-row"><span>${t.date.slice(5).replace('-','.')}</span><span>${t.floor}층</span><b>${state.type==='월세'?`${formatPrice(t.amount)} / ${t.monthlyRent.toLocaleString()}만`:formatPrice(t.amount)}</b></div>`).join('')}`:`<div class="data-empty compact"><b>최근 거래가 없습니다.</b></div>`;
}
function renderChart(){
  if(!state.dataReady){dataEmpty($('#lineChart'),'실거래 자료를 불러오고 있습니다.');return}
  const cutoff=new Date();cutoff.setMonth(cutoff.getMonth()-state.period*12);
  const grouped=new Map();filteredTransactions({respectDates:false,respectSearch:false}).filter(t=>new Date(`${t.date}T00:00:00`)>=cutoff).forEach(t=>{const k=t.date.slice(0,7);if(!grouped.has(k))grouped.set(k,[]);grouped.get(k).push(transactionValue(t))});
  const keys=[...grouped.keys()].sort();const medians=keys.map(k=>median(grouped.get(k))),base=medians[0]||1,vals=medians.map(v=>v/base*100);
  if(vals.length<2){dataEmpty($('#lineChart'),'차트를 만들기에 거래 월이 부족합니다.');return}
  const w=760,h=210,p={l:38,r:18,t:20,b:28},min=Math.floor(Math.min(...vals)-1),max=Math.ceil(Math.max(...vals)+1),x=i=>p.l+i*(w-p.l-p.r)/(vals.length-1),y=v=>p.t+(max-v)*(h-p.t-p.b)/Math.max(1,max-min),pts=vals.map((v,i)=>`${x(i)},${y(v)}`).join(' '),area=`M${x(0)},${h-p.b} L${pts.replaceAll(' ',',')} L${x(vals.length-1)},${h-p.b} Z`,ticks=[min,(min+max)/2,max],labelIdx=[0,Math.floor((keys.length-1)/2),keys.length-1];
  $('#lineChart').innerHTML=`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff705d" stop-opacity=".22"/><stop offset="1" stop-color="#ff705d" stop-opacity="0"/></linearGradient></defs>${ticks.map(t=>`<line class="grid-line" x1="${p.l}" y1="${y(t)}" x2="${w-p.r}" y2="${y(t)}"/><text class="axis-label" x="0" y="${y(t)+3}">${t.toFixed(0)}</text>`).join('')}<path class="area-path" d="${area}"/><polyline class="line-path" points="${pts}"/><circle class="line-point" cx="${x(vals.length-1)}" cy="${y(vals.at(-1))}" r="4"/>${labelIdx.map((i,j)=>`<text class="axis-label" x="${x(i)}" y="${h-7}" text-anchor="${j===0?'start':j===2?'end':'middle'}">${keys[i].replace('-','.')}</text>`).join('')}</svg>`;
}
function renderRankings(){
  if(state.dataReady){
    const rows=filteredTransactions();
    if(!rows.length){dataEmpty($('#priceRanking'),'선택 기간에 실거래가 없습니다.');dataEmpty($('#pyeongRanking'),'선택 기간에 실거래가 없습니다.');return}
    const top=[...rows].sort((a,b)=>transactionValue(b)-transactionValue(a)).slice(0,10),topPy=[...rows].sort((a,b)=>pyeongValue(b)-pyeongValue(a)).slice(0,10),maxPrice=transactionValue(top[0]),maxPy=pyeongValue(topPy[0]);
    const row=(t,i,value,max,perPy=false)=>`<div class="rank-row"><span class="rank-no ${i<3?'top':''}">${String(i+1).padStart(2,'0')}</span><span class="rank-name">${t.apartment}<small class="rank-sub">${t.dong} · ${t.area.toFixed(2)}㎡ · ${t.floor}층 · ${t.date}</small></span><span class="rank-bar"><i style="width:${value/max*100}%"></i></span><span class="rank-price">${perPy?Math.round(value).toLocaleString():(state.type==='월세'?`${Math.round(value).toLocaleString()}만`:formatPrice(value))}<small>${perPy?'만원 / 전용 3.3㎡':state.type==='월세'?`월세 · 보증금 ${formatPrice(t.amount)}`:`${state.type} 실거래`}</small></span></div>`;
    $('#priceRanking').innerHTML=top.map((t,i)=>row(t,i,transactionValue(t),maxPrice)).join('');
    $('#pyeongRanking').innerHTML=topPy.map((t,i)=>row(t,i,pyeongValue(t),maxPy,true)).join('');return;
  }
  dataEmpty($('#priceRanking'),'국토교통부 실거래 자료 동기화 대기 중');dataEmpty($('#pyeongRanking'),'국토교통부 실거래 자료 동기화 대기 중');
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
function updateRegion(region){state.region=region;$('#regionSelect').value=region;$('#heroRegion').textContent=region==='전체'?'동구 전체':region;$('#mapRegion').textContent=region==='전체'?'동구 전체':region;renderAll();if($('.location-tab.active')?.dataset.loc==='school')renderSchoolExplorer()}
function renderAll(){renderMetrics();renderDailyBrief();renderChart();renderRankings()}
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
async function initialize(){setDailyDates();renderLocation('school');await loadTransactions();renderAll()}
initialize();
