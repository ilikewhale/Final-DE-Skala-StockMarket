
<script setup lang="ts">
import AllStocks from './AllStocks.vue';
import { useRoute } from 'vue-router';
import StockTrading from './StockTrading.vue';
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const router = useRouter()
const route = useRoute();
const playerId = route.query.playerId as string | '';
const player = ref<Player | null>(null);
const profileImage = ref('image.jpg'); // 기본 이미지 경로

interface Player {
  id: number;
  playerId: string;
  playerPw: string;
  playerMoney: number;
  createdAt: string;
  updatedAt: string;
}

const fetchPlayerInfo = async () => {
  try {
    const res = await axios.get(`/api/player/${playerId}`)
    player.value = res.data
  } catch (err) {
    console.error('유저 정보 불러오기 실패:', err)
  }
}


const formattedMoney = computed(() => {
  if (!player.value || player.value.playerMoney === undefined) return '₩0';
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(player.value?.playerMoney);
});


const logout = () => {
  router.push('/')
}

const uploadProfileImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        profileImage.value = e.target.result;
      }
    };
    
    reader.readAsDataURL(file);
  }
};

onMounted(() => {
  fetchPlayerInfo();
})
</script>

<template>
  <div class="stock-market-container">
    <div class="side-profile">
      <div class="profile-card">
        <div class="profile-image-container">
          <img :src="profileImage" alt="프로필 이미지" class="profile-image">
          <label class="image-upload-label">
            <input type="file" @change="uploadProfileImage" accept="image/*" class="image-upload">
            <span class="upload-icon">📷</span>
          </label>
        </div>
        <div class="profile-info">
          <h2>Player: {{ playerId }}</h2>
          <div class="money-info">
            <div class="label">보유 현금:</div>
            <div class="value">{{ formattedMoney }}</div>
          </div>
        </div>
        
        
        <div class="profile-actions">
          <button class="action-btn transaction-btn" 
        @click="router.push({ path: '/transactions', query: { playerId } })">
  거래 내역 보기
</button>
          <button class="action-btn logout-btn" @click="logout">로그아웃</button>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <header class="market-header">
        <div class="header-content">
          <h1>Skala Stock Market</h1>
        </div>
      </header>
      
      <div class="market-content">
        <section class="stocks-section">
          <AllStocks />
        </section>
        
        <section class="trading-section">
          <StockTrading :playerId="playerId" @update-player="fetchPlayerInfo" />
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stock-market-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  height: 100vh;
  background-color: #f8fafc;
}

/* 사이드 프로필 스타일 */
.side-profile {
  width: 300px;
  padding: 20px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  border-radius: 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  position: sticky;
  top: 0;
  height: 100vh;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.profile-image-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.profile-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #60a5fa;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.image-upload-label {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #3b82f6;
  border-radius: 50%;
  width: 30px;
  height: 30px;
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
  font-size: 14px;
}

.profile-info {
  width: 100%;
  text-align: center;
  margin-bottom: 25px;
}

.profile-info h2 {
  margin: 0 0 15px 0;
  font-size: 22px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.money-info {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.money-info .label {
  font-weight: 500;
}

.money-info .value {
  font-weight: 600;
}

.owned-stocks {
  width: 100%;
  margin-bottom: 25px;
}

.owned-stocks h3 {
  font-size: 18px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
}

.no-stocks {
  text-align: center;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 14px;
}

.stocks-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.stock-item {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 15px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.stock-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.stock-name {
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 15px;
}

.stock-details {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.stock-quantity {
  color: #bfdbfe;
}

.stock-price {
  font-weight: 600;
}

.profile-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
  font-size: 14px;
}

.transaction-btn {
  background-color: #60a5fa;
  color: white;
  text-decoration: none;
}

.transaction-btn:hover {
  background-color: #3b82f6;
  transform: translateY(-2px);
}

.logout-btn {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* 메인 콘텐츠 영역 */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.market-header {
  margin-bottom: 20px;
  text-align: left;
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  padding: 20px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.market-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.market-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - 140px);
}

.stocks-section,
.trading-section {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
}

/* 데스크탑에서 50%씩 배분 */
@media (min-width: 1024px) {
  .stocks-section,
  .trading-section {
    flex: 1;
  }
}

/* 태블릿 최적화 */
@media (max-width: 1023px) and (min-width: 768px) {
  .stock-market-container {
    flex-direction: column;
    height: auto;
  }
  
  .side-profile {
    width: 100%;
    height: auto;
    padding: 20px;
  }
  
  .profile-card {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .profile-image-container {
    margin-right: 20px;
  }
  
  .profile-info {
    flex: 1;
    text-align: left;
    min-width: 200px;
  }
  
  .owned-stocks {
    width: 100%;
    margin-top: 20px;
  }
  
  .market-content {
    height: auto;
  }
}

/* 모바일 최적화 */
@media (max-width: 767px) {
  .stock-market-container {
    flex-direction: column;
    height: auto;
  }
  
  .side-profile {
    width: 100%;
    height: auto;
    padding: 15px;
  }
  
  .market-content {
    flex-direction: column;
    height: auto;
  }
  
  .header-content {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .stocks-section,
  .trading-section {
    height: auto;
    min-height: 300px;
  }
  
  .profile-info h2 {
    font-size: 20px;
  }
  
  .money-info {
    font-size: 13px;
  }
}
</style>
