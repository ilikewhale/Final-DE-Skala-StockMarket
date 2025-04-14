<!-- <script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const featuredStocks = ref([]);
const marketNews = ref([]);
const isLoading = ref(true);
const error = ref(null);

const stats = reactive({
  totalPlayers: 0,
  totalStocks: 0,
  totalTransactions: 0
});

// 주식 시장 데이터 가져오기
const fetchMarketData = async () => {
  isLoading.value = true;
  try {
    // 인기 있는 주식 불러오기
    const stocksResponse = await axios.get('/api/stock');
    featuredStocks.value = stocksResponse.data.slice(0, 5); // 상위 5개만 표시
    
    // 통계 데이터 가져오기
    stats.totalStocks = stocksResponse.data.length;
    
    // 더미 뉴스 데이터 (실제로는 API에서 가져올 수 있음)
    marketNews.value = [
      { id: 1, title: '주식 시장 신규 상장 소식', content: '새로운 기업들이 Skala 주식 시장에 상장될 예정입니다.', date: '2025-04-13' },
      { id: 2, title: '분기별 시장 동향 분석', content: '이번 분기 주식 시장은 전반적으로 상승세를 보이고 있습니다.', date: '2025-04-10' },
      { id: 3, title: '투자자 가이드라인 업데이트', content: '초보 투자자를 위한 새로운 가이드라인이 발표되었습니다.', date: '2025-04-08' }
    ];
    
  } catch (err) {
    console.error('시장 데이터 로딩 실패:', err);
    error.value = '데이터를 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
  } finally {
    isLoading.value = false;
  }
};

const navigateToLogin = () => {
  router.push('/login');
};

const navigateToSignup = () => {
  router.push('/signup');
};

const navigateToStocks = () => {
  router.push('/stocks');
};

onMounted(() => {
  fetchMarketData();
});
</script>

<template>
  <div class="home-container">
    <!-- 헤더 섹션 -->
    <header class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Skala Stock Market</h1>
        <p class="hero-subtitle">안전하고 신뢰할 수 있는 가상 주식 거래 플랫폼</p>
        <div class="hero-actions">
          <button @click="navigateToLogin" class="btn-primary">로그인</button>
          <button @click="navigateToSignup" class="btn-secondary">회원가입</button>
        </div>
      </div>
      <div class="hero-image">
        <div class="stock-chart-graphic"></div>
      </div>
    </header>

    <!-- 주요 기능 섹션 -->
    <section class="features-section">
      <h2 class="section-title">왜 Skala Stock Market인가?</h2>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">💼</div>
          <h3>다양한 포트폴리오</h3>
          <p>다양한 산업 분야의 주식을 거래하고 자신만의 포트폴리오를 구성하세요.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>실시간 차트</h3>
          <p>주식의 실시간 가격 변동을 그래프로 한눈에 확인하세요.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>안전한 거래</h3>
          <p>안전한 암호화 기술로 모든 거래 기록이 안전하게 보호됩니다.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>언제 어디서나</h3>
          <p>모바일 환경에 최적화된 디자인으로 언제 어디서나 거래하세요.</p>
        </div>
      </div>
    </section>

    <!-- 인기 주식 섹션 -->
    <section class="stocks-section">
      <h2 class="section-title">인기 있는 주식</h2>
      
      <div v-if="isLoading" class="loading-spinner">
        <div class="spinner"></div>
        <p>데이터를 불러오는 중입니다...</p>
      </div>
      
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-else class="stocks-grid">
        <div v-for="stock in featuredStocks" :key="stock.stockId" class="stock-card">
          <div class="stock-info">
            <h3 class="stock-name">{{ stock.stockName }}</h3>
            <p class="stock-price">₩{{ stock.price.toLocaleString() }}</p>
          </div>
          <div class="stock-change" :class="stock.changeRate >= 0 ? 'positive' : 'negative'">
            {{ stock.changeRate >= 0 ? '+' : '' }}{{ stock.changeRate }}%
          </div>
        </div>
        
        <div v-if="featuredStocks.length === 0" class="no-stocks">
          표시할 주식 데이터가 없습니다.
        </div>
      </div>
      
      <div class="view-all-container">
        <button @click="navigateToStocks" class="btn-view-all">모든 주식 보기</button>
      </div>
    </section>

    <!-- 시장 동향 섹션 -->
    <section class="news-section">
      <h2 class="section-title">시장 동향 및 뉴스</h2>
      
      <div class="news-grid">
        <div v-for="news in marketNews" :key="news.id" class="news-card">
          <div class="news-date">{{ news.date }}</div>
          <h3 class="news-title">{{ news.title }}</h3>
          <p class="news-content">{{ news.content }}</p>
          <a href="#" class="news-link">자세히 보기</a>
        </div>
      </div>
    </section>

    <!-- 시장 통계 섹션 -->
    <section class="stats-section">
      <h2 class="section-title">시장 통계</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalStocks }}</div>
          <div class="stat-label">상장된 주식</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalPlayers || '1,000+' }}</div>
          <div class="stat-label">활성 유저</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalTransactions || '10,000+' }}</div>
          <div class="stat-label">총 거래량</div>
        </div>
      </div>
    </section>

    <!-- 시작하기 섹션 -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>지금 바로 주식 투자를 시작하세요</h2>
        <p>무료 회원가입 후 바로 주식 거래를 시작할 수 있습니다.</p>
        <button @click="navigateToSignup" class="btn-cta">회원가입 하기</button>
      </div>
    </section>

    <!-- 푸터 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">Skala Stock Market</div>
        <div class="footer-info">
          <p>© 2025 Skala Stock Market. All rights reserved.</p>
          <p>이 서비스는 실제 화폐가 아닌 가상의 화폐를 사용합니다.</p>
        </div>
        <div class="footer-links">
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">고객센터</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 전역 스타일 */
.home-container {
  font-family: 'Noto Sans KR', 'Segoe UI', sans-serif;
  color: #333;
  max-width: 100%;
  overflow-x: hidden;
  background-color: #f8fafc;
}

.section-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 2px;
}

/* 버튼 스타일 */
.btn-primary {
  background: linear-gradient(45deg, #2563eb, #3b82f6);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(37, 99, 235, 0.3);
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.btn-view-all {
  background: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view-all:hover {
  background: rgba(59, 130, 246, 0.1);
}

.btn-cta {
  background: linear-gradient(45deg, #2563eb, #3b82f6);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(37, 99, 235, 0.3);
}

/* 헤더 섹션 */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5rem 10%;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 600px;
  z-index: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #1e40af;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #475569;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.stock-chart-graphic {
  width: 400px;
  height: 300px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMjUwSDQwMCIgc3Ryb2tlPSIjQ0JEOUUxIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMCAwTDUwIDE1MEwxMDAgMTAwTDE1MCAxNzBMMjAwIDkwTDI1MCAxMzBMMzAwIDcwTDM1MCAxMTBMNDAwIDUwIiBzdHJva2U9IiMzQjgyRjYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyKSIgZmlsbC1vcGFjaXR5PSIwLjEiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXIiIHgxPSIyMDAiIHkxPSIwIiB4Mj0iMjAwIiB5Mj0iMjUwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzNCODJGNiIgc3RvcC1vcGFjaXR5PSIwLjgiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMzQjgyRjYiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.9;
}

/* 기능 섹션 */
.features-section {
  padding: 5rem 10%;
  background-color: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #2d3748;
  font-weight: 600;
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
}

/* 주식 섹션 */
.stocks-section {
  padding: 5rem 10%;
  background-color: #f8fafc;
}

.stocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stock-card {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.stock-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
}

.stock-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.stock-price {
  font-size: 1rem;
  color: #64748b;
}

.stock-change {
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.stock-change.positive {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.stock-change.negative {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.view-all-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.no-stocks {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 1.1rem;
}

/* 로딩 스피너 */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #3b82f6;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #ef4444;
  text-align: center;
  padding: 2rem;
  background-color: #fee2e2;
  border-radius: 8px;
  margin: 1rem 0;
}

/* 뉴스 섹션 */
.news-section {
  padding: 5rem 10%;
  background-color: white;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.news-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
}

.news-date {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.news-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
}

.news-content {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex-grow: 1;
}

.news-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  transition: all 0.3s ease;
}

.news-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* 통계 섹션 */
.stats-section {
  padding: 5rem 10%;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: #64748b;
}

/* CTA 섹션 */
.cta-section {
  padding: 5rem 10%;
  background: linear-gradient(45deg, #1e40af, #3b82f6);
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.cta-section h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-section p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

/* 푸터 */
.footer {
  background-color: #1e293b;
  color: white;
  padding: 3rem 10%;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.footer-info {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 1rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.footer-links a:hover {
  opacity: 1;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    padding: 3rem 5%;
    text-align: center;
  }
  
  .hero-content {
    margin-bottom: 2rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .features-section,
  .stocks-section,
  .news-section,
  .stats-section,
  .cta-section {
    padding: 3rem 5%;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-links {
    margin-top: 1rem;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> -->