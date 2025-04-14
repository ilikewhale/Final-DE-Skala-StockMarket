<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const isLoading = ref(true);
const errorMessage = ref('');

// 사용자 정보
const playerInfo = ref({
  playerId: '',
  playerMoney: 0,
  lastLoginDate: ''
});

// 보유 주식 정보
const holdings = ref([]);

// 주식 시장 정보
const marketData = ref([]);

// 차트 데이터
const selectedStock = ref(null);
const stockHistory = ref([]);

// 시간 데이터 (x축)
const timeLabels = ref([]);

// 기본 페이지 설정
const currentPage = ref('overview'); // 'overview', 'portfolio', 'market', 'trade'

// 검색 및 정렬
const searchStock = ref('');
const sortBy = ref('code');

// 거래 관련
const stockToBuy = ref('');
const stockToSell = ref('');
const quantity = ref(1);

// 현재 시장 전체 상태
const marketStatus = ref({
  total: 0,
  up: 0,
  down: 0,
  unchanged: 0
});

// 사용자 데이터 로드
const loadUserData = async () => {
  isLoading.value = true;
  try {
    // API 엔드포인트는 실제 백엔드에 맞게 수정 필요
    const response = await axios.get('/api/player/info');
    playerInfo.value = response.data;
    loadHoldings();
  } catch (error) {
    console.error('사용자 정보 로드 오류:', error);
    errorMessage.value = '사용자 정보를 불러오는데 실패했습니다.';
    // 로그인 페이지로 리다이렉트 (인증 오류 시)
    if (error.response && error.response.status === 401) {
      router.push('/login');
    }
  } finally {
    isLoading.value = false;
  }
};

// 보유 주식 정보 로드
const loadHoldings = async () => {
  try {
    const response = await axios.get('/api/player/holdings');
    holdings.value = response.data;
  } catch (error) {
    console.error('보유 주식 정보 로드 오류:', error);
    errorMessage.value = '보유 주식 정보를 불러오는데 실패했습니다.';
  }
};

// 주식 시장 정보 로드
const loadMarketData = async () => {
  try {
    const response = await axios.get('/api/market/stocks');
    marketData.value = response.data;
    
    // 시장 상태 계산
    const total = marketData.value.length;
    const up = marketData.value.filter(stock => stock.priceChange > 0).length;
    const down = marketData.value.filter(stock => stock.priceChange < 0).length;
    const unchanged = total - up - down;
    
    marketStatus.value = { total, up, down, unchanged };
  } catch (error) {
    console.error('주식 시장 정보 로드 오류:', error);
    errorMessage.value = '주식 시장 정보를 불러오는데 실패했습니다.';
  }
};

// 주식 구매 함수
const buyStock = async () => {
  if (!stockToBuy.value || quantity.value <= 0) {
    errorMessage.value = '주식 코드와 수량을 올바르게 입력해주세요.';
    return;
  }
  
  try {
    const response = await axios.post('/api/trade/buy', {
      stockCode: stockToBuy.value,
      quantity: quantity.value
    });
    
    if (response.data.success) {
      alert('주식 구매 성공!');
      loadUserData(); // 사용자 정보 및 보유 주식 업데이트
      loadMarketData(); // 시장 정보 업데이트
      
      // 입력값 초기화
      stockToBuy.value = '';
      quantity.value = 1;
    } else {
      errorMessage.value = response.data.message || '주식 구매에 실패했습니다.';
    }
  } catch (error) {
    console.error('주식 구매 오류:', error);
    errorMessage.value = '주식 구매 중 오류가 발생했습니다.';
  }
};

// 주식 판매 함수
const sellStock = async () => {
  if (!stockToSell.value || quantity.value <= 0) {
    errorMessage.value = '주식 코드와 수량을 올바르게 입력해주세요.';
    return;
  }
  
  try {
    const response = await axios.post('/api/trade/sell', {
      stockCode: stockToSell.value,
      quantity: quantity.value
    });
    
    if (response.data.success) {
      alert('주식 판매 성공!');
      loadUserData(); // 사용자 정보 및 보유 주식 업데이트
      loadMarketData(); // 시장 정보 업데이트
      
      // 입력값 초기화
      stockToSell.value = '';
      quantity.value = 1;
    } else {
      errorMessage.value = response.data.message || '주식 판매에 실패했습니다.';
    }
  } catch (error) {
    console.error('주식 판매 오류:', error);
    errorMessage.value = '주식 판매 중 오류가 발생했습니다.';
  }
};

// 주식 상세 정보 불러오기
const loadStockDetail = async (stockCode) => {
  selectedStock.value = marketData.value.find(s => s.stockCode === stockCode);
  
  try {
    const response = await axios.get(`/api/market/stock/${stockCode}/history`);
    stockHistory.value = response.data.priceHistory;
    timeLabels.value = response.data.timeLabels;
  } catch (error) {
    console.error('주식 상세 정보 로드 오류:', error);
    errorMessage.value = '주식 상세 정보를 불러오는데 실패했습니다.';
  }
};

// 포트폴리오 총 가치 계산
const totalPortfolioValue = computed(() => {
  let total = 0;
  
  if (holdings.value.length > 0 && marketData.value.length > 0) {
    total = holdings.value.reduce((sum, holding) => {
      const stock = marketData.value.find(s => s.stockCode === holding.stockCode);
      return sum + (stock ? stock.currentPrice * holding.quantity : 0);
    }, 0);
  }
  
  return total + playerInfo.value.playerMoney;
});

// 필터링된 시장 데이터
const filteredMarketData = computed(() => {
  return marketData.value
    .filter(stock => 
      stock.stockCode.toLowerCase().includes(searchStock.value.toLowerCase()) ||
      stock.stockName.toLowerCase().includes(searchStock.value.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy.value) {
        case 'code':
          return a.stockCode.localeCompare(b.stockCode);
        case 'name':
          return a.stockName.localeCompare(b.stockName);
        case 'price':
          return b.currentPrice - a.currentPrice;
        case 'change':
          return b.priceChange - a.priceChange;
        default:
          return 0;
      }
    });
});

// 로그아웃 함수
const logout = async () => {
  try {
    await axios.post('/api/auth/logout');
    router.push('/login');
  } catch (error) {
    console.error('로그아웃 오류:', error);
  }
};

// 초기 데이터 로드
onMounted(() => {
  loadUserData();
  loadMarketData();
});
</script>

<template>
  <div class="dashboard-container">
    <div class="animated-bg"></div>
    
    <!-- 상단 네비게이션 -->
    <nav class="dashboard-nav">
      <div class="logo-area">
        <h2 class="stock-title">Stock Market</h2>
      </div>
      
      <div class="nav-links">
        <button @click="currentPage = 'overview'" 
          :class="{ active: currentPage === 'overview' }">대시보드</button>
        <button @click="currentPage = 'portfolio'" 
          :class="{ active: currentPage === 'portfolio' }">포트폴리오</button>
        <button @click="currentPage = 'market'" 
          :class="{ active: currentPage === 'market' }">시장현황</button>
        <button @click="currentPage = 'trade'" 
          :class="{ active: currentPage === 'trade' }">거래</button>
      </div>
      
      <div class="user-area">
        <div class="user-info" v-if="!isLoading">
          <span class="user-icon">👤</span>
          <span class="user-id">{{ playerInfo.playerId }}</span>
        </div>
        <button @click="logout" class="logout-btn">로그아웃</button>
      </div>
    </nav>
    
    <!-- 로딩 화면 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>데이터를 불러오는 중입니다...</p>
    </div>
    
    <!-- 오류 메시지 -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    
    <!-- 메인 컨텐츠 영역 -->
    <div v-if="!isLoading" class="dashboard-content">
      <!-- 개요 페이지 -->
      <div v-if="currentPage === 'overview'" class="page-container">
        <div class="dashboard-cards">
          <div class="dashboard-card balance-card">
            <h3>현재 자산</h3>
            <div class="balance-amount">₩{{ playerInfo.playerMoney.toLocaleString() }}</div>
            <div class="balance-subtitle">현금</div>
          </div>
          
          <div class="dashboard-card portfolio-card">
            <h3>포트폴리오 가치</h3>
            <div class="portfolio-amount">₩{{ totalPortfolioValue.toLocaleString() }}</div>
            <div class="portfolio-subtitle">전체 자산</div>
          </div>
          
          <div class="dashboard-card stocks-card">
            <h3>보유 주식 수</h3>
            <div class="stocks-amount">{{ holdings.length }}종</div>
            <div class="stocks-subtitle">주식 종류</div>
          </div>
          
          <div class="dashboard-card market-card">
            <h3>시장 현황</h3>
            <div class="market-status">
              <span class="up">↑ {{ marketStatus.up }}</span>
              <span class="down">↓ {{ marketStatus.down }}</span>
              <span class="unchanged">- {{ marketStatus.unchanged }}</span>
            </div>
            <div class="market-subtitle">상승/하락/변동없음</div>
          </div>
        </div>
        
        <div class="recent-activity">
          <h3>최근 시장 주요 변동</h3>
          <div class="activity-list">
            <div v-for="(stock, index) in marketData.slice(0, 5)" :key="index" class="activity-item">
              <div class="stock-code">{{ stock.stockCode }}</div>
              <div class="stock-name">{{ stock.stockName }}</div>
              <div class="stock-price">₩{{ stock.currentPrice.toLocaleString() }}</div>
              <div :class="['stock-change', stock.priceChange > 0 ? 'up' : stock.priceChange < 0 ? 'down' : '']">
                {{ stock.priceChange > 0 ? '+' : '' }}{{ stock.priceChange.toFixed(2) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 포트폴리오 페이지 -->
      <div v-if="currentPage === 'portfolio'" class="page-container">
        <h2 class="page-title">나의 포트폴리오</h2>
        
        <div class="portfolio-summary">
          <div class="summary-item">
            <span class="summary-label">총 자산:</span>
            <span class="summary-value">₩{{ totalPortfolioValue.toLocaleString() }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">보유 현금:</span>
            <span class="summary-value">₩{{ playerInfo.playerMoney.toLocaleString() }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">보유 주식 가치:</span>
            <span class="summary-value">₩{{ (totalPortfolioValue - playerInfo.playerMoney).toLocaleString() }}</span>
          </div>
        </div>
        
        <div class="holdings-table">
          <div class="table-header">
            <div class="col-code">종목코드</div>
            <div class="col-name">종목명</div>
            <div class="col-quantity">보유수량</div>
            <div class="col-price">현재가</div>
            <div class="col-value">평가금액</div>
            <div class="col-profit">손익률</div>
          </div>
          
          <div v-if="holdings.length === 0" class="no-holdings">
            보유 중인 주식이 없습니다.
          </div>
          
          <div v-for="(holding, index) in holdings" :key="index" class="table-row">
            <div class="col-code">{{ holding.stockCode }}</div>
            <div class="col-name">{{ holding.stockName }}</div>
            <div class="col-quantity">{{ holding.quantity.toLocaleString() }}</div>
            <div class="col-price">₩{{ holding.currentPrice.toLocaleString() }}</div>
            <div class="col-value">₩{{ (holding.quantity * holding.currentPrice).toLocaleString() }}</div>
            <div :class="['col-profit', holding.profitRate > 0 ? 'up' : holding.profitRate < 0 ? 'down' : '']">
              {{ holding.profitRate > 0 ? '+' : '' }}{{ holding.profitRate.toFixed(2) }}%
            </div>
          </div>
        </div>
      </div>
      
      <!-- 시장 현황 페이지 -->
      <div v-if="currentPage === 'market'" class="page-container">
        <h2 class="page-title">시장 현황</h2>
        
        <div class="market-status-summary">
          <div class="status-item">
            <div class="status-circle total">{{ marketStatus.total }}</div>
            <div class="status-label">전체 종목</div>
          </div>
          <div class="status-item">
            <div class="status-circle up">{{ marketStatus.up }}</div>
            <div class="status-label">상승</div>
          </div>
          <div class="status-item">
            <div class="status-circle down">{{ marketStatus.down }}</div>
            <div class="status-label">하락</div>
          </div>
          <div class="status-item">
            <div class="status-circle unchanged">{{ marketStatus.unchanged }}</div>
            <div class="status-label">변동없음</div>
          </div>
        </div>
        
        <div class="market-filter">
          <input type="text" placeholder="종목 검색" v-model="searchStock" class="search-input">
          <select v-model="sortBy" class="sort-select">
            <option value="code">종목코드</option>
            <option value="name">종목명</option>
            <option value="price">현재가</option>
            <option value="change">등락률</option>
          </select>
        </div>
        
        <div class="stocks-table">
          <div class="table-header">
            <div class="col-code">종목코드</div>
            <div class="col-name">종목명</div>
            <div class="col-price">현재가</div>
            <div class="col-change">등락률</div>
            <div class="col-volume">거래량</div>
            <div class="col-actions">상세/거래</div>
          </div>
          
          <div v-for="(stock, index) in filteredMarketData" :key="index" class="table-row">
            <div class="col-code">{{ stock.stockCode }}</div>
            <div class="col-name">{{ stock.stockName }}</div>
            <div class="col-price">₩{{ stock.currentPrice.toLocaleString() }}</div>
            <div :class="['col-change', stock.priceChange > 0 ? 'up' : stock.priceChange < 0 ? 'down' : '']">
              {{ stock.priceChange > 0 ? '+' : '' }}{{ stock.priceChange.toFixed(2) }}%
            </div>
            <div class="col-volume">{{ stock.volume.toLocaleString() }}</div>
            <div class="col-actions">
              <button class="detail-btn" @click="loadStockDetail(stock.stockCode)">상세</button>
              <button class="buy-btn" @click="stockToBuy = stock.stockCode; currentPage = 'trade'">매수</button>
            </div>
          </div>
        </div>
        
        <!-- 주식 상세 정보 모달 -->
        <div v-if="selectedStock" class="stock-detail-modal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ selectedStock.stockName }} ({{ selectedStock.stockCode }})</h3>
              <button class="close-btn" @click="selectedStock = null">×</button>
            </div>
            
            <div class="stock-info">
              <div class="info-item">
                <span class="info-label">현재가:</span>
                <span class="info-value">₩{{ selectedStock.currentPrice.toLocaleString() }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">등락률:</span>
                <span :class="['info-value', selectedStock.priceChange > 0 ? 'up' : selectedStock.priceChange < 0 ? 'down' : '']">
                  {{ selectedStock.priceChange > 0 ? '+' : '' }}{{ selectedStock.priceChange.toFixed(2) }}%
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">거래량:</span>
                <span class="info-value">{{ selectedStock.volume.toLocaleString() }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">시가총액:</span>
                <span class="info-value">₩{{ (selectedStock.currentPrice * selectedStock.outstandingShares).toLocaleString() }}</span>
              </div>
            </div>
            
            <div class="stock-chart">
              <!-- 차트 데이터 시각화 (실제로는 Chart.js 등의 라이브러리 사용) -->
              <div class="chart-placeholder">
                <div class="chart-title">{{ selectedStock.stockName }} 가격 추이</div>
                <div class="chart-visual">
                  <!-- 간단한 차트 시각화 (실제로는 적절한 라이브러리로 대체) -->
                  <div v-for="(price, index) in stockHistory" :key="index" 
                       :style="`height: ${price}px; left: ${index * (100 / stockHistory.length)}%`" 
                       class="chart-bar"></div>
                </div>
                <div class="chart-x-axis">
                  <span v-for="(label, index) in timeLabels" :key="index" 
                        :style="`left: ${index * (100 / timeLabels.length)}%`" 
                        class="axis-label">{{ label }}</span>
                </div>
              </div>
            </div>
            
            <div class="action-buttons">
              <button class="buy-btn" @click="stockToBuy = selectedStock.stockCode; currentPage = 'trade'; selectedStock = null">매수</button>
              <button class="sell-btn" @click="stockToSell = selectedStock.stockCode; currentPage = 'trade'; selectedStock = null">매도</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 거래 페이지 -->
      <div v-if="currentPage === 'trade'" class="page-container">
        <h2 class="page-title">주식 거래</h2>
        
        <div class="trade-content">
          <div class="trade-balance">
            <h3>현재 보유 현금</h3>
            <div class="balance-amount">₩{{ playerInfo.playerMoney.toLocaleString() }}</div>
          </div>
          
          <div class="trade-cards">
            <div class="trade-card">
              <h3>주식 매수</h3>
              <div class="trade-form">
                <div class="form-group">
                  <label for="stock-buy">종목코드</label>
                  <div class="input-container">
                    <span class="input-icon">📈</span>
                    <input id="stock-buy" type="text" v-model="stockToBuy" placeholder="종목코드 입력">
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="buy-quantity">수량</label>
                  <div class="input-container">
                    <span class="input-icon">🔢</span>
                    <input id="buy-quantity" type="number" v-model="quantity" min="1" placeholder="수량 입력">
                  </div>
                </div>
                
                <div class="price-estimate" v-if="stockToBuy">
                  <div class="stock-detail" v-if="marketData.find(s => s.stockCode === stockToBuy)">
                    <div class="detail-row">
                      <span class="detail-label">종목명:</span>
                      <span class="detail-value">{{ marketData.find(s => s.stockCode === stockToBuy).stockName }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">현재가:</span>
                      <span class="detail-value">₩{{ marketData.find(s => s.stockCode === stockToBuy).currentPrice.toLocaleString() }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">예상 금액:</span>
                      <span class="detail-value">₩{{ (marketData.find(s => s.stockCode === stockToBuy).currentPrice * quantity).toLocaleString() }}</span>
                    </div>
                  </div>
                  <div class="stock-not-found" v-else>
                    해당 종목을 찾을 수 없습니다.
                  </div>
                </div>
                
                <button @click="buyStock" class="buy-btn pulse">매수하기</button>
              </div>
            </div>
            
            <div class="trade-card">
              <h3>주식 매도</h3>
              <div class="trade-form">
                <div class="form-group">
                  <label for="stock-sell">종목코드</label>
                  <div class="input-container">
                    <span class="input-icon">📉</span>
                    <input id="stock-sell" type="text" v-model="stockToSell" placeholder="종목코드 입력">
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="sell-quantity">수량</label>
                  <div class="input-container">
                    <span class="input-icon">🔢</span>
                    <input id="sell-quantity" type="number" v-model="quantity" min="1" placeholder="수량 입력">
                  </div>
                </div>
                
                <div class="price-estimate" v-if="stockToSell">
                  <div class="stock-detail" v-if="marketData.find(s => s.stockCode === stockToSell)">
                    <div class="detail-row">
                      <span class="detail-label">종목명:</span>
                      <span class="detail-value">{{ marketData.find(s => s.stockCode === stockToSell).stockName }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">현재가:</span>
                      <span class="detail-value">₩{{ marketData.find(s => s.stockCode === stockToSell).currentPrice.toLocaleString() }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">예상 금액:</span>
                      <span class="detail-value">₩{{ (marketData.find(s => s.stockCode === stockToSell).currentPrice * quantity).toLocaleString() }}</span>
                    </div>
                    <div class="detail-row" v-if="holdings.find(h => h.stockCode === stockToSell)">
                      <span class="detail-label">보유 수량:</span>
                      <span class="detail-value">{{ holdings.find(h => h.stockCode === stockToSell).quantity.toLocaleString() }}</span>
                    </div>
                    <div class="detail-row" v-else>
                      <span class="detail-label warning">주의:</span>
                      <span class="detail-value warning">해당 종목을 보유하고 있지 않습니다.</span>
                    </div>
                  </div>
                  <div class="stock-not-found" v-else>
                    해당 종목을 찾을 수 없습니다.
                  </div>
                </div>
                
                <button @click="sellStock" class="sell-btn pulse">매도하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 파티클 효과 -->
    <div class="particles-container">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
  </div>
</template>