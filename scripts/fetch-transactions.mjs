import { mkdir, writeFile } from 'node:fs/promises';

const serviceKey = process.env.DATA_GO_KR_API_KEY;
if (!serviceKey) throw new Error('DATA_GO_KR_API_KEY secret is missing.');

const lawdCd = '27140';
const monthsBack = 36;
const endpoints = {
  sale: 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade',
  rent: 'https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent'
};

const decode = value => String(value ?? '')
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"').replaceAll('&#39;', "'").trim();
const tag = (xml, ...names) => {
  for (const name of names) {
    const match = xml.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${name}>`, 'i'));
    if (match) return decode(match[1]);
  }
  return '';
};
const number = value => Number(String(value || '0').replaceAll(',', '').trim()) || 0;
const pad2 = value => String(value).padStart(2, '0');
const months = Array.from({ length: monthsBack }, (_, i) => {
  const d = new Date();
  d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() - i);
  return `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}`;
});

async function fetchMonth(kind, ymd) {
  const url = new URL(endpoints[kind]);
  url.searchParams.set('serviceKey', serviceKey);
  url.searchParams.set('LAWD_CD', lawdCd);
  url.searchParams.set('DEAL_YMD', ymd);
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('numOfRows', '9999');
  let response;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      response = await fetch(url, { headers: { Accept: 'application/xml' }, signal: AbortSignal.timeout(30000) });
      if (response.ok || response.status < 500) break;
    } catch (error) {
      if (attempt === 4) throw new Error(`${kind} ${ymd}: network request failed after 4 attempts`, { cause: error });
    }
    await new Promise(resolve => setTimeout(resolve, attempt * 1500));
  }
  const xml = await response.text();
  if (!response.ok) throw new Error(`${kind} ${ymd}: HTTP ${response.status}`);
  const resultCode = tag(xml, 'resultCode');
  if (resultCode && !['00', '000'].includes(resultCode)) {
    throw new Error(`${kind} ${ymd}: ${resultCode} ${tag(xml, 'resultMsg')}`);
  }
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(match => match[1]);
}

function normalize(xml, kind) {
  const year = tag(xml, 'dealYear', '년');
  const month = tag(xml, 'dealMonth', '월');
  const day = tag(xml, 'dealDay', '일');
  const monthlyRent = number(tag(xml, 'monthlyRent', '월세금액'));
  return {
    type: kind === 'sale' ? '매매' : (monthlyRent > 0 ? '월세' : '전세'),
    date: `${year}-${pad2(month)}-${pad2(day)}`,
    apartment: tag(xml, 'aptNm', '아파트'),
    dong: tag(xml, 'umdNm', '법정동'),
    area: number(tag(xml, 'excluUseAr', '전용면적')),
    floor: number(tag(xml, 'floor', '층')),
    amount: kind === 'sale' ? number(tag(xml, 'dealAmount', '거래금액')) : number(tag(xml, 'deposit', '보증금액')),
    monthlyRent,
    buildYear: number(tag(xml, 'buildYear', '건축년도')),
    cancelled: Boolean(tag(xml, 'cdealDay', '해제사유발생일')) || tag(xml, 'cdealType', '해제여부') === 'O'
  };
}

const transactions = [];
for (const ymd of months) {
  for (const kind of ['sale', 'rent']) {
    const items = await fetchMonth(kind, ymd);
    transactions.push(...items.map(item => normalize(item, kind)));
  }
}

const clean = transactions
  .filter(t => !t.cancelled && t.apartment && t.date && t.area > 0)
  .map(({ cancelled, ...t }) => t)
  .sort((a, b) => b.date.localeCompare(a.date));

const output = {
  meta: {
    source: '국토교통부 실거래가 공개자료 OpenAPI',
    lawdCd,
    region: '대구광역시 동구',
    generatedAt: new Date().toISOString(),
    from: months.at(-1),
    to: months[0],
    count: clean.length
  },
  transactions: clean
};

await mkdir('dist/data', { recursive: true });
await writeFile('dist/data/transactions.json', `${JSON.stringify(output)}\n`, 'utf8');
console.log(`Wrote ${clean.length} verified transactions.`);
