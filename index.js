const stations = [
    { name: '衡水北', code: 'HSP' },
    { name: '武邑', code: 'WYI' },
    { name: '阜城南', code: 'FCN' },
    { name: '交河', code: 'JHE' },
    { name: '泊头西', code: 'BTX' },
    { name: '泊头东', code: 'BTD' },
    { name: '沧州西', code: 'CZX' },
    { name: '沧州东', code: 'CZD' },
    { name: '黄骅南', code: 'HHN' },
    { name: '黄骅东', code: 'HHD' },
    { name: '黄骅港', code: 'HHG' }
];

const distanceToHengshui = [0, 27, 48, 71, 95, 110, 129, 154, 188, 202, 222];

function buildDistanceMatrix(distArray) {
    const n = distArray.length;
    const matrix = [];
    for (let i = 0; i < n; i++) {
        matrix[i] = [];
        for (let j = 0; j < n; j++) {
            matrix[i][j] = Math.abs(distArray[i] - distArray[j]);
        }
    }
    return matrix;
}

const distanceMatrix = buildDistanceMatrix(distanceToHengshui);

const CONFIG = {
    BASE_PRICE: 0.34,
    CLASS_RATIO: {
        '二等座': 1.0,
        '一等座': 1.6,
        '特等座': 1.8,
        '优选一等座': 1.9,
        '商务座': 3.3
    },
    TIME_PER_KM: 0.24,
    FIXED_EXTRA: 2.17
};

const fromSelect = document.getElementById('fromStation');
const toSelect = document.getElementById('toStation');
const resultBox = document.getElementById('resultBox');
const distanceDisplay = document.getElementById('distanceDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const priceDisplay = document.getElementById('priceDisplay');
const priceFirst = document.getElementById('priceFirst');
const pricePremium = document.getElementById('pricePremium');
const pricePreferred = document.getElementById('pricePreferred');
const priceBusiness = document.getElementById('priceBusiness');

function populateSelects() {
    const options = stations.map((s, idx) =>
        `<option value="${idx}">${s.name}</option>`
    ).join('');
    fromSelect.innerHTML = options;
    toSelect.innerHTML = options;
    fromSelect.value = '0';
    toSelect.value = '10';
}

function getPrice(distance, seatClass) {
    const ratio = CONFIG.CLASS_RATIO[seatClass] || 1.0;
    return distance * CONFIG.BASE_PRICE * ratio;
}

function updateAllPrices(distance) {
    if (!distance || distance <= 0) {
        priceFirst.textContent = '--';
        pricePremium.textContent = '--';
        pricePreferred.textContent = '--';
        priceBusiness.textContent = '--';
        return;
    }
    priceFirst.textContent = getPrice(distance, '一等座').toFixed(0) + '元';
    pricePremium.textContent = getPrice(distance, '特等座').toFixed(0) + '元';
    pricePreferred.textContent = getPrice(distance, '优选一等座').toFixed(0) + '元';
    priceBusiness.textContent = getPrice(distance, '商务座').toFixed(0) + '元';
}

function calculate() {
    const fromIdx = parseInt(fromSelect.value);
    const toIdx = parseInt(toSelect.value);
    if (isNaN(fromIdx) || isNaN(toIdx) || fromIdx === toIdx) {
        resultBox.innerHTML = `<div class="result-placeholder">请选择两个不同的车站</div>`;
        distanceDisplay.textContent = '--';
        timeDisplay.textContent = '--';
        priceDisplay.textContent = '--';
        updateAllPrices(null);
        return;
    }
    const distance = distanceMatrix[fromIdx][toIdx];
    if (!distance || distance <= 0) {
        resultBox.innerHTML = `<div class="result-placeholder">该区间暂无里程数据</div>`;
        distanceDisplay.textContent = '--';
        timeDisplay.textContent = '--';
        priceDisplay.textContent = '--';
        updateAllPrices(null);
        return;
    }
    const timeMinutes = CONFIG.TIME_PER_KM * distance + CONFIG.FIXED_EXTRA;
    const timeFormatted = timeMinutes.toFixed(1);
    const price = getPrice(distance, '二等座');
    const priceFormatted = price.toFixed(0);
    resultBox.innerHTML = `
        <div class="result-price">
            ${priceFormatted}<small> 元</small>
            <span style="font-size:18px;font-weight:400;color:#3b6d8a;margin-left:10px;">二等座</span>
        </div>
    `;
    distanceDisplay.textContent = `${distance} km`;
    timeDisplay.textContent = `${timeFormatted} 分钟`;
    priceDisplay.textContent = `${priceFormatted} 元`;
    updateAllPrices(distance);
}

fromSelect.addEventListener('change', calculate);
toSelect.addEventListener('change', calculate);

populateSelects();
calculate();

console.log('衡水北到各站距离:', distanceToHengshui);
console.log('衡水北到黄骅港:', distanceToHengshui[10]);