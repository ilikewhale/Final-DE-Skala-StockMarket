<!-- <template>
    <div class="transaction-wrapper">
      <button @click="router.back()" class="back-button">이전으로</button>
      <h1 class="transaction-title">거래 내역</h1>
      
      <div v-if="loading" class="loading-state">
        <p>데이터를 불러오는 중입니다...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>데이터를 불러오는데 문제가 발생했습니다.</p>
        <small>{{ error }}</small>
      </div>
      
      <div v-else-if="transactions.length === 0" class="empty-state">
        <p>거래 내역이 없습니다.</p>
      </div>
      
      <div v-else class="transaction-container">
        <div class="transaction-header">
          <span class="column date">날짜</span>
          <span class="column stock">종목명</span>
          <span class="column type">유형</span>
          <span class="column quantity">수량</span>
          <span class="column price">단가</span>
          <span class="column total">총액</span>
        </div>
        
        <ul class="transaction-list">
          <li v-for="transaction in transactions" :key="transaction.generatedAt" class="transaction-item">
            <div class="transaction-card">
              <div class="transaction-main">
                <div class="column date">
                  <span class="label">날짜</span>
                  <span>{{ formatDate(transaction.generatedAt) }}</span>
                </div>
                
                <div class="column stock">
                  <span class="label">종목</span>
                  <span>{{ transaction.stockName }}</span>
                </div>
                
                <div class="column type">
                  <span class="label">유형</span>
                  <span :class="getTypeClass(transaction.transactionType)">
                    {{ transaction.transactionType }}
                  </span>
                </div>
                
                <div class="column quantity">
                  <span class="label">수량</span>
                  <span>{{ formatNumber(transaction.transactionQuantity) }}</span>
                </div>
                
                <div class="column price">
                  <span class="label">단가</span>
                  <span>{{ formatCurrency(transaction.buyPrice) }}</span>
                </div>
                
                <div class="column total">
                  <span class="label">총액</span>
                  <span :class="getTotalClass(transaction.transactionType)">
                    {{ formatCurrency(transaction.totalPrice) }}
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const route = useRoute()
  const playerId = route.query.playerId as string
  
  type Transaction = {
    generatedAt: string;
    playerId: string;
    stockName: string;
    transactionType: string; // "매입" 또는 "매도"로 변경
    transactionQuantity: number;
    buyPrice: number;
    totalPrice: number;
  };
  
  // 상태 관리
  const transactions = ref<Transaction[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);
  let intervalId: number | null = null
  
  // 포맷팅 유틸리티 함수
  const formatDate = (dateString: string) => {
    try {
      // YYYY-MM-DD HH:MM:SS 형식의 문자열을 Date 객체로 변환
      const [datePart, timePart] = dateString.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hour, minute, second] = timePart?.split(':') || ['00', '00', '00'];
      
      const date = new Date(
        Number(year), 
        Number(month) - 1, // 월은 0부터 시작
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
      );
      
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("날짜 변환 에러:", error);
      return dateString; // 에러 발생 시 원본 문자열 반환
    }
  };
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getTypeClass = (type: string) => {
    return {
      'type-buy': type === '매입',
      'type-sell': type === '매도'
    };
  };
  
  const getTotalClass = (type: string) => {
    return {
      'total-buy': type === '매입',
      'total-sell': type === '매도'
    };
  };
  
  // 거래 데이터 가져오기 함수
  const fetchTransactions = async () => {
    if (!playerId) {
      error.value = "플레이어 ID가 제공되지 않았습니다."
      loading.value = false
      return
    }
  
    try {
      const url = `/api/transaction/player/${playerId}/all`
      const res = await axios.get<Transaction[]>(url)
  
      if (Array.isArray(res.data)) {
        const newData = res.data
  
        // 새 데이터와 기존 데이터 비교 후 업데이트
        if (JSON.stringify(newData) !== JSON.stringify(transactions.value)) {
          transactions.value = newData
          console.log("업데이트된 거래 내역 반영:", newData.length, "건")
        }
      } else {
        error.value = "API 응답 형식이 예상과 다릅니다"
      }
    } catch (err: any) {
      error.value = err?.message || "데이터를 불러오는데 실패했습니다."
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    fetchTransactions()
    intervalId = setInterval(fetchTransactions, 1000) // 10초마다 체크
  })
  
  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })
  </script>
  
  <style scoped>
  .transaction-wrapper {
    padding: 2rem 1rem;
    min-height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .transaction-title {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .loading-state, .error-state, .empty-state {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  .error-state {
    color: #e74c3c;
  }
  
  .transaction-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    max-height: 600px; /* 원하는 최대 높이 설정 */
    overflow-y: auto;   /* 세로 스크롤 활성화 */
  }
  
  .transaction-header {
    display: flex;
    background-color: #f8f9fa;
    padding: 1rem;
    font-weight: bold;
    border-bottom: 1px solid #eee;
  }
  
  .transaction-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .transaction-item {
    border-bottom: 1px solid #eee;
  }
  
  .transaction-item:last-child {
    border-bottom: none;
  }
  
  .transaction-card {
    padding: 1rem;
  }
  
  .transaction-main {
    display: flex;
    align-items: center;
  }
  
  .column {
    flex: 1;
    padding: 0 0.5rem;
  }
  
  .column.date {
    flex: 1.5;
  }
  
  .column.stock {
    flex: 1.5;
  }
  
  .column.type, .column.quantity {
    flex: 0.8;
  }
  
  /* 모바일 뷰에서는 레이블 표시 */
  @media (max-width: 768px) {
    .transaction-header {
      display: none;
    }
    
    .transaction-main {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .column {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
    }
    
    .label {
      display: inline-block;
      font-weight: bold;
      width: 80px;
    }
  }
  
  /* 데스크톱 뷰에서는 레이블 숨김 */
  @media (min-width: 769px) {
    .label {
      display: none;
    }
  }
  
  .type-buy {
    color: #2980b9;
    font-weight: bold;
  }
  
  .type-sell {
    color: #e74c3c;
    font-weight: bold;
  }
  
  .total-buy {
    color: #2980b9;
    font-weight: bold;
  }
  
  .total-sell {
    color: #e74c3c;
    font-weight: bold;
  }
  
  .debug-info {
    margin-top: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .debug-info pre {
    white-space: pre-wrap;
    overflow-x: auto;
    background: #f1f1f1;
    padding: 1rem;
    border-radius: 4px;
  }
  
  .debug-info button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .back-button {
    background-color: #eee;
    color: #333;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    font-weight: bold;
  }
  .back-button:hover {
    background-color: #ddd;
  }
  </style> -->

  <template>
    <div class="view-container">
      <div class="animated-bg"></div>
      
      <div class="particles-container">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>
      
      <div class="dashboard-layout">
        <div class="side-menu auth-card">
          <div class="card-decoration"></div>
          <div class="user-profile">
            <div class="avatar-container">
              <img :src="profileImage" alt="프로필 이미지" class="profile-image">
            </div>
            <div class="user-info">
              <div class="user-name">player: {{ playerId }}</div>
              <div class="user-balance">{{ formattedMoney }}</div>
            </div>
          </div>
          
          <div class="menu-items">
            <div class="menu-item" @click="router.push({ path: '/dashboard', query: { playerId } })">
              <div class="menu-icon">📊</div>
              <span>대시보드</span>
            </div>
            <div class="menu-item active">
              <div class="menu-icon">⏱️</div>
              <span>거래 내역</span>
            </div>
            <div class="menu-item logout" @click="logout">
              <div class="menu-icon">🚪</div>
              <span>로그아웃</span>
            </div>
          </div>
        </div>
        
        <div class="main-content">
          <div class="welcome-section">
            <h1>거래 내역</h1>
            <p>주식 거래 기록을 확인하고 투자 성과를 분석하세요.</p>
          </div>
          
          <div v-if="loading" class="loading-state auth-card">
            <div class="card-decoration"></div>
            <p>데이터를 불러오는 중입니다...</p>
          </div>
          
          <div v-else-if="error" class="error-state auth-card">
            <div class="card-decoration"></div>
            <p>데이터를 불러오는데 문제가 발생했습니다.</p>
            <small>{{ error }}</small>
          </div>
          
          <div v-else-if="transactions.length === 0" class="empty-state auth-card">
            <div class="card-decoration"></div>
            <p>거래 내역이 없습니다.</p>
          </div>
          
          <div v-else class="transaction-container auth-card">
            <div class="card-decoration"></div>
            <h2>거래 목록</h2>
            
            <div class="transaction-header">
              <span class="column date">날짜</span>
              <span class="column stock">종목명</span>
              <span class="column type">유형</span>
              <span class="column quantity">수량</span>
              <span class="column price">단가</span>
              <span class="column total">총액</span>
            </div>
            
            <ul class="transaction-list">
              <li v-for="transaction in transactions" :key="transaction.generatedAt" class="transaction-item">
                <div class="transaction-card">
                  <div class="transaction-main">
                    <div class="column date">
                      <span class="label">날짜</span>
                      <span>{{ formatDate(transaction.generatedAt) }}</span>
                    </div>
                    
                    <div class="column stock">
                      <span class="label">종목</span>
                      <span>{{ transaction.stockName }}</span>
                    </div>
                    
                    <div class="column type">
                      <span class="label">유형</span>
                      <span :class="getTypeClass(transaction.transactionType)">
                        {{ transaction.transactionType }}
                      </span>
                    </div>
                    
                    <div class="column quantity">
                      <span class="label">수량</span>
                      <span>{{ formatNumber(transaction.transactionQuantity) }}</span>
                    </div>
                    
                    <div class="column price">
                      <span class="label">단가</span>
                      <span>{{ formatCurrency(transaction.buyPrice) }}</span>
                    </div>
                    
                    <div class="column total">
                      <span class="label">총액</span>
                      <span :class="getTotalClass(transaction.transactionType)">
                        {{ formatCurrency(transaction.totalPrice) }}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const route = useRoute()
  const playerId = route.query.playerId as string
  const profileImage = ref('image.jpg') // 기본 이미지 경로
  const formattedMoney = ref('₩0')
  
  type Transaction = {
    generatedAt: string;
    playerId: string;
    stockName: string;
    transactionType: string; // "매입" 또는 "매도"로 변경
    transactionQuantity: number;
    buyPrice: number;
    totalPrice: number;
  };
  
  // 상태 관리
  const transactions = ref<Transaction[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);
  let intervalId: number | null = null
  
  // 플레이어 정보 가져오기
  const fetchPlayerInfo = async () => {
    try {
      const res = await axios.get(`/api/player/${playerId}`)
      formattedMoney.value = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        maximumFractionDigits: 0
      }).format(res.data.playerMoney);
    } catch (err) {
      console.error('유저 정보 불러오기 실패:', err)
    }
  }
  
  // 로그아웃 함수
  const logout = () => {
    router.push('/')
  }
  
  // 포맷팅 유틸리티 함수
  const formatDate = (dateString: string) => {
    try {
      // YYYY-MM-DD HH:MM:SS 형식의 문자열을 Date 객체로 변환
      const [datePart, timePart] = dateString.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hour, minute, second] = timePart?.split(':') || ['00', '00', '00'];
      
      const date = new Date(
        Number(year), 
        Number(month) - 1, // 월은 0부터 시작
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
      );
      
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("날짜 변환 에러:", error);
      return dateString; // 에러 발생 시 원본 문자열 반환
    }
  };
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getTypeClass = (type: string) => {
    return {
      'type-buy': type === '매입',
      'type-sell': type === '매도'
    };
  };
  
  const getTotalClass = (type: string) => {
    return {
      'total-buy': type === '매입',
      'total-sell': type === '매도'
    };
  };
  
  // 거래 데이터 가져오기 함수
  const fetchTransactions = async () => {
    if (!playerId) {
      error.value = "플레이어 ID가 제공되지 않았습니다."
      loading.value = false
      return
    }
  
    try {
      const url = `/api/transaction/player/${playerId}/all`
      const res = await axios.get<Transaction[]>(url)
  
      if (Array.isArray(res.data)) {
        const newData = res.data
  
        // 새 데이터와 기존 데이터 비교 후 업데이트
        if (JSON.stringify(newData) !== JSON.stringify(transactions.value)) {
          transactions.value = newData
          console.log("업데이트된 거래 내역 반영:", newData.length, "건")
        }
      } else {
        error.value = "API 응답 형식이 예상과 다릅니다"
      }
    } catch (err: any) {
      error.value = err?.message || "데이터를 불러오는데 실패했습니다."
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    fetchPlayerInfo()
    fetchTransactions()
    intervalId = setInterval(fetchTransactions, 10000) // 10초마다 체크
  })
  
  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })
  </script>

<style scoped>
/* 공통 스타일 시작 */
.view-container {
  max-width: 2000px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
}

h1, h2, h3 {
  color: #1a365d;
  font-weight: 700;
}

/* 애니메이션 배경 */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: white;
  border-radius: 30%;
  z-index: -1;
}

.animated-bg::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle, rgb(255, 255, 255) 0%, rgba(49, 130, 206, 0) 70%);
  animation: pulse-bg 15s infinite;
}

@keyframes pulse-bg {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.3; }
  100% { transform: scale(1); opacity: 0.5; }
}

/* 파티클 효과 */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(66, 153, 225, 0.3);
  border-radius: 50%;
  z-index: -1;
}

.particle:nth-child(1) {
  top: 10%;
  left: 20%;
  animation: float 25s infinite linear;
}

.particle:nth-child(2) {
  top: 30%;
  left: 80%;
  animation: float 20s infinite linear;
  width: 12px;
  height: 12px;
}

.particle:nth-child(3) {
  top: 70%;
  left: 15%;
  animation: float 22s infinite linear;
  width: 10px;
  height: 10px;
}

.particle:nth-child(4) {
  top: 40%;
  left: 90%;
  animation: float 18s infinite linear;
  width: 6px;
  height: 6px;
}

.particle:nth-child(5) {
  top: 85%;
  left: 60%;
  animation: float 24s infinite linear;
  width: 14px;
  height: 14px;
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
  25% { transform: translate(-100px, 100px) rotate(90deg); opacity: 0.7; }
  50% { transform: translate(100px, 200px) rotate(180deg); opacity: 0.3; }
  75% { transform: translate(200px, -100px) rotate(270deg); opacity: 0.7; }
  100% { transform: translate(0, 0) rotate(360deg); opacity: 0.3; }
}

/* 대시보드 레이아웃 */
.dashboard-layout {
  display: flex;
  gap: 25px;
  align-items: stretch
}

/* 카드 공통 스타일 */
.auth-card {
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(49, 130, 206, 0.15);
  padding: 25px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(49, 130, 206, 0.2);
}

.card-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, rgba(49, 130, 206, 0.1), rgba(66, 153, 225, 0.05));
  border-radius: 0 0 0 100%;
  z-index: -1;
}

.card-decoration::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(49, 130, 206, 0.05), rgba(66, 153, 225, 0.02));
  border-radius: 100% 0 0 0;
}

/* 타이틀 섹션 스타일 */
.welcome-section {
  text-align: center;
  margin-bottom: 25px;
  padding: 30px 20px;
  border-radius: 20px;
  position: relative;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  animation: slideIn 1s ease-out;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-section h1 {
  font-size: 2.4rem;
  background: linear-gradient(45deg, #2b6cb0, #4299e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 8px rgba(66, 153, 225, 0.2);
  margin: 0;
}

.welcome-section p {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.7;
  margin: 0;
  margin-left: 20px;
  flex: 1;
  text-align: left;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 사이드 메뉴 스타일 */
.side-menu {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-self: stretch
}

.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.avatar-container {
  margin-right: 5px;
  margin-left: 0px;
}

.user-info {
  flex: 1;
  margin-left: -5px;
}

.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #60a5fa;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.user-name {
  font-weight: 600;
  font-size: 18px;
  color: #2d3748;
  margin-bottom: 4px;
  text-align: left; 
  margin-left: -5px;
}

.user-balance {
  font-size: 18px;
  color: #4a5568;
  font-weight: 500;
  margin-left: -5px;
  text-align: left;
}

.menu-items {
  display: flex;
  flex-direction: column;
  flex: 1; /* 남은 공간을 모두 차지하도록 설정 */
  justify-content: flex-start; /* 상단 정렬 */
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px;
  color: #4a5568;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 12px;
  margin-bottom: 8px;
}

.menu-item:hover {
  background-color: #f0f5ff;
  color: #3182ce;
}

.menu-item.active {
  background-color: #ebf8ff;
  color: #3182ce;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.15);
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item.logout {
  color: #e53e3e;
  margin-top: 30px;
}

/* 메인 콘텐츠 스타일 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-profile-small {
  display: flex;
  align-items: center;
}

.profile-image-container {
  position: relative;
  width: 42px;
  height: 42px;
}

.image-upload-label {
  position: absolute;
  bottom: -3px;
  right: -3px;
  background-color: #3182ce;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.image-upload-label:hover {
  background-color: #2563eb;
  transform: scale(1.1);
}

.image-upload {
  display: none;
}

.upload-icon {
  font-size: 10px;
  color: white;
}

/* 거래 내역 스타일 */
.transaction-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #edf2f7;
  background: linear-gradient(45deg, #2b6cb0, #4299e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #3182ce, #63b3ed);
  border-radius: 2px;
}

.transaction-header {
  display: flex;
  background-color: #f8fafc;
  padding: 1rem;
  font-weight: 600;
  border-radius: 8px;
  margin-bottom: 10px;
  color: #4a5568;
}

.transaction-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 350px);
}

.transaction-item {
  border-bottom: 1px solid #edf2f7;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-card {
  padding: 1rem;
  transition: all 0.2s ease;
}

.transaction-card:hover {
  background-color: #f8fafc;
}

.transaction-main {
  display: flex;
  align-items: center;
}

.column {
  flex: 1;
  padding: 0 0.5rem;
}

.column.date {
  flex: 1.5;
}

.column.stock {
  flex: 1.5;
}

.column.type, .column.quantity {
  flex: 0.8;
}

/* 모바일 뷰에서는 레이블 표시 */
@media (max-width: 768px) {
  .transaction-header {
    display: none;
  }
  
  .transaction-main {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .column {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
  }
  
  .label {
    display: inline-block;
    font-weight: bold;
    width: 80px;
  }
}

/* 데스크톱 뷰에서는 레이블 숨김 */
@media (min-width: 769px) {
  .label {
    display: none;
  }
}

.type-buy {
  color: #3182ce;
  font-weight: bold;
}

.type-sell {
  color: #e53e3e;
  font-weight: bold;
}

.total-buy {
  color: #3182ce;
  font-weight: bold;
}

.total-sell {
  color: #e53e3e;
  font-weight: bold;
}

/* 로딩, 에러, 빈 상태 */
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.error-state {
  color: #e53e3e;
}

/* 반응형 스타일 */
@media (max-width: 1200px) {
  .transaction-list {
    max-height: 500px;
  }
}

@media (max-width: 992px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .side-menu {
    width: 100%;
    margin-bottom: 25px;
  }
  
  .menu-items {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .menu-item {
    flex: 1;
    min-width: 120px;
    text-align: center;
    padding: 12px 8px;
  }
  
  .menu-icon {
    margin-right: 6px;
  }
  
  .menu-item.logout {
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    text-align: center;
    padding: 20px 15px;
  }
  
  .welcome-section h1 {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  .welcome-section p {
    font-size: 1rem;
    margin-left: 0;
    text-align: center;
    margin-bottom: 15px;
  }
  
  .user-profile-small {
    margin-top: 15px;
  }
  
  .balance-amount {
    font-size: 26px;
  }
  
  .menu-item {
    padding: 10px 6px;
    min-width: 100px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .welcome-section h1 {
    font-size: 1.8rem;
  }
}
</style>