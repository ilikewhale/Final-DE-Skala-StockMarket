
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
          <div class="menu-item active">
            <div class="menu-icon">📊</div>
            <span>대시보드</span>
          </div>
          <div class="menu-item" @click="router.push({ path: '/transactions', query: { playerId } })">
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
          <h1>대시보드</h1>
          <p>실시간 주식 시장 정보와 거래를 한눈에 확인하세요.</p>
          
          <div class="user-profile-small">
            <div class="profile-image-container">
              <img :src="profileImage" alt="프로필 이미지" class="profile-image">
              <label class="image-upload-label">
                <input type="file" @change="uploadProfileImage" accept="image/*" class="image-upload">
                <span class="upload-icon">📷</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="balance-card auth-card">
          <div class="card-decoration"></div>
          <div class="balance-title">총 보유자산</div>
          <div class="balance-amount">{{ formattedMoney }}</div>
        </div>
        
        <div class="dashboard-content">
          <div class="stock-holdings auth-card">
            <div class="card-decoration"></div>
            <h2>보유 주식</h2>
            <AllStocks />
          </div>
          
          <div class="stock-trading auth-card">
            <div class="card-decoration"></div>
            <h2>주식 거래</h2>
            <StockTrading :playerId="playerId" @update-player="fetchPlayerInfo" />
          </div>
        </div> 
      </div>
    </div>
  </div>
</template>

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
  margin-right: 15px;
  margin-left: 15px;
}

.avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4279ff 0%, #2563eb 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  box-shadow: 0 4px 10px rgba(66, 121, 255, 0.3);
}

.user-info {
  flex: 1;
  margin-left: -10px; /* 이 값을 조정하여 더 왼쪽으로 이동 */
}

.user-name {
  font-weight: 600;
  font-size: 18px;
  color: #2d3748;
  margin-bottom: 4px;
  text-align: left; 
  margin-left: -15px;/* 왼쪽 정렬 확실히 하기 */
}


.user-balance {
  font-size: 18px;
  color: #4a5568;
  font-weight: 500;
  margin-left: -15px;
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

.profile-image {
  width: 70%;
  height: 50%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #60a5fa;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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

/* 금액 카드 */
.balance-card {
  margin-bottom: 25px;
  padding: 25px 30px;
}

.balance-title {
  font-size: 16px;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 10px;
}

.balance-amount {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(45deg, #2b6cb0, #4299e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 대시보드 콘텐츠 */
.dashboard-content {
  display: flex;
  gap: 25px;
  margin-bottom: 25px;
}

.stock-holdings, .stock-trading {
  flex: 1;
  padding: 25px;
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

/* 반응형 스타일 */
@media (max-width: 1200px) {
  .dashboard-content {
    flex-direction: column;
  }
  
  .stock-holdings, .stock-trading {
    width: 100%;
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
  
  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .transaction-icon {
    margin-bottom: 10px;
  }
  
  .transaction-amount {
    margin-top: 10px;
    align-self: flex-end;
  }
}
</style>