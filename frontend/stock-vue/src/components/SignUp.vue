<!-- <script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const playerId = ref('');
const playerPw = ref('');
const playerMoney = ref();

const isLoading = ref(false);
const errorMessage = ref('');

const signup = async () => {

  if (!playerId.value || !playerPw.value || !playerMoney.value) {
    errorMessage.value = '모든 필드를 입력해주세요.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  
  const url = '/api/player';
  const requestBody = {
    playerId: playerId.value,
    playerPw: playerPw.value,
    playerMoney: playerMoney.value,
  };
  
  try {
    const response = await axios.post(url, requestBody);
    if (response.data) {
      alert('회원가입 성공!');
      router.push('/'); 
    } else {
      errorMessage.value = '회원가입에 실패했습니다. 다시 시도해주세요.';
    }
  } catch (error) {
    console.error('Signup error:', error);
    errorMessage.value = '중복된 아이디입니다. 다시 시도해주세요.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="stock-container">
    <div class="animated-bg"></div>
    
    <div class="stock-card">
      <div class="card-decoration"></div>
      
      <div class="logo-area">
        <h2 class="stock-title">Stock Market</h2>
        <p class="subtitle">회원가입</p>
      </div>

      <form @submit.prevent="signup" class="login-form">
        <div class="stock-group">
          <label for="player-id">아이디</label>
          <div class="input-container">
            <span class="input-icon">👤</span>
            <input 
              id="player-id"
              type="text" 
              v-model="playerId" 
              placeholder="ID를 입력하세요"
              autocomplete="username">
          </div>
        </div>

        <div class="stock-group">
          <label for="player-pw">비밀번호</label>
          <div class="input-container">
            <span class="input-icon">🔒</span>
            <input 
              id="player-pw"
              type="password" 
              v-model="playerPw" 
              placeholder="비밀번호를 입력하세요"
              autocomplete="current-password">
          </div>
        </div>

        <div class="stock-group">
          <label for="player-money">초기 자산</label>
          <div class="input-container">
            <span class="input-icon">💰</span>
            <input 
              id="player-money"
              type="number" 
              v-model="playerMoney"
              :max="9007199254740991"
              :min="0"
              placeholder="금액을 입력하세요"
              autocomplete="off">
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <button 
          type="submit" 
          class="signin-btn pulse" 
          :disabled="isLoading">
          {{ isLoading ? '회원가입 중...' : '회원가입' }}
        </button>

        <button @click="router.back()" class="home-btn">이전으로</button>
      </form>
    </div>
    
    <div class="particles-container">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
  </div>
</template>

<style scoped>
/* 공통 스타일 시작 */
.stock-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%);
  position: relative;
  overflow: hidden;
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

.stock-card {
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(49, 130, 206, 0.15);
  padding: 40px;
  max-width: 450px;
  margin: 0 auto;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.stock-card:hover {
  transform: translateY(-8px);
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

.logo-area {
  margin-bottom: 30px;
  text-align: center;
}

.stock-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #2b6cb0, #4299e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 8px rgba(66, 153, 225, 0.2);
  font-weight: 700;
  position: relative;
}

.stock-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 4px;
  background: linear-gradient(90deg, #2b6cb0, #4299e1);
  border-radius: 2px;
}

.subtitle {
  font-size: 1.2rem;
  color: #4a5568;
  margin-top: 10px;
}

.login-form {
  margin-bottom: 1.5rem;
}

.stock-group {
  margin-bottom: 28px;
}

.stock-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
  transition: color 0.3s;
}

.stock-group:hover label {
  color: #4299e1;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 1.2rem;
}

.stock-group input {
  width: 100%;
  padding: 14px 16px 14px 46px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s;
  background-color: #f8fafc;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stock-group input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 4px rgba(66, 153, 225, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0);
  background-color: white;
}

.stock-group input::placeholder {
  color: #9ca3af;
}

.error-message {
  color: #e53e3e;
  margin-bottom: 24px;
  font-size: 0.95rem;
  padding: 12px 16px;
  background-color: rgba(229, 62, 62, 0.1);
  border-radius: 10px;
  border-left: 4px solid #e53e3e;
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
  40%, 60% { transform: translate3d(3px, 0, 0); }
}

.signin-btn, .home-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(45deg, #2b6cb0, #4299e1);
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 6px 15px rgba(66, 153, 225, 0.3);
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
}

.signin-btn::before, .home-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s;
}

.signin-btn:hover, .home-btn:hover {
  background: linear-gradient(45deg, #2c5282, #3182ce);
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(66, 153, 225, 0.4);
}

.signin-btn:hover::before, .home-btn:hover::before {
  left: 100%;
}

.signin-btn:active, .home-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(66, 153, 225, 0.3);
}

.signin-btn:disabled {
  background: linear-gradient(45deg, #a0aec0, #cbd5e0);
  color: #f8fafc;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 10px rgba(160, 174, 192, 0.2);
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
  }
}

@media (max-width: 768px) {
  .stock-title {
    font-size: 2.2rem;
  }
  
  .stock-card {
    padding: 30px;
  }
}

@media (max-width: 480px) {
  .stock-card {
    max-width: 90%;
    padding: 25px;
  }
  
  .stock-title {
    font-size: 1.9rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}</style> -->


<template>
  <div class="view-container">
    <div class="welcome-section">
      <div class="animated-bg"></div>
      <h1>사용자 등록</h1>
      <p>Stokala에 참여하기 위한 계정을 만들어보세요.</p>
    </div>

    <div class="auth-card">
      <div class="card-decoration"></div>
      <h2>회원가입</h2>
      
      <form @submit.prevent="signup">
        <div class="form-group">
          <label for="player-id">아이디</label>
          <div class="input-container">
            <span class="input-icon">👤</span>
            <input 
              id="player-id" 
              v-model="playerId" 
              placeholder="사용할 아이디를 입력하세요" 
              required 
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">비밀번호</label>
          <div class="input-container">
            <span class="input-icon">🔒</span>
            <input 
              id="player-pw" 
              v-model="playerPw" 
              type="password" 
              placeholder="비밀번호를 입력하세요" 
              required 
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="money">초기 자산</label>
          <div class="input-container">
            <span class="input-icon">💰</span>
            <input 
              id="player-money" 
              v-model="playerMoney"
              :max="9007199254740991"
              :min="0"
              placeholder="시작 금액을 입력하세요" 
              required 
            />
          </div>
        </div>
        
        <div class="error-message" v-if="errorMessage">
          {{ errorMessage }}
        </div>
        
        <div class="auth-actions">
          <button type="submit" class="auth-button pulse">등록하기</button>
        </div>
        
        <div class="auth-link">
          <p>이미 계정이 있으신가요? <a href="#" @click="router.back()">로그인</a></p>
        </div>
      </form>
    </div>
    
    <div class="particles-container">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const playerId = ref('');
const playerPw = ref('');
const playerMoney = ref();

const isLoading = ref(false);
const errorMessage = ref('');

const signup = async () => {

  if (!playerId.value || !playerPw.value || !playerMoney.value) {
    errorMessage.value = '모든 필드를 입력해주세요.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  
  const url = '/api/player';
  const requestBody = {
    playerId: playerId.value,
    playerPw: playerPw.value,
    playerMoney: playerMoney.value,
  };
  
  try {
    const response = await axios.post(url, requestBody);
    if (response.data) {
      alert('회원가입 성공!');
      router.push('/'); 
    } else {
      errorMessage.value = '회원가입에 실패했습니다. 다시 시도해주세요.';
    }
  } catch (error) {
    console.error('Signup error:', error);
    errorMessage.value = '중복된 아이디입니다. 다시 시도해주세요.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 공통 스타일 시작 */
.view-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%);
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

/* 타이틀 섹션 스타일 */
.welcome-section {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 20px;
  border-radius: 20px;
  position: relative;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  animation: slideIn 1s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-section h1 {
  font-size: 2.8rem;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #2b6cb0, #4299e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 8px rgba(66, 153, 225, 0.2);
}

.welcome-section p {
  font-size: 1.2rem;
  color: #4a5568;
  max-width: 800px;
  margin: 0 auto 14px;
  line-height: 1.7;
  animation: fadeIn 1.2s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 카드 공통 스타일 */
.auth-card {
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(49, 130, 206, 0.15);
  padding: 40px;
  max-width: 450px;
  margin: 0 auto 70px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.auth-card:hover {
  transform: translateY(-8px);
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

.auth-card h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  background: linear-gradient(45deg, #2b6cb0, #4299e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.auth-card h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 4px;
  background: linear-gradient(90deg, #2b6cb0, #4299e1);
  border-radius: 2px;
}

/* 폼 스타일 */
.form-group {
  margin-bottom: 28px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
  transition: color 0.3s;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 1.2rem;
}

.form-group input {
  width: 100%;
  padding: 14px 16px 14px 46px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s;
  background-color: #f8fafc;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-group input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 4px rgba(66, 153, 225, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0);
  background-color: white;
}

.form-group:hover label {
  color: #4299e1;
}

.error-message {
  color: #e53e3e;
  margin-bottom: 24px;
  font-size: 0.95rem;
  padding: 12px 16px;
  background-color: rgba(229, 62, 62, 0.1);
  border-radius: 10px;
  border-left: 4px solid #e53e3e;
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
  40%, 60% { transform: translate3d(3px, 0, 0); }
}

/* 버튼 스타일 */
.auth-actions {
  margin-bottom: 24px;
}

.auth-button {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(45deg, #2b6cb0, #4299e1);
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 6px 15px rgba(66, 153, 225, 0.3);
  position: relative;
  overflow: hidden;
}

.auth-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s;
}

.auth-button:hover {
  background: linear-gradient(45deg, #2c5282, #3182ce);
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(66, 153, 225, 0.4);
}

.auth-button:hover::before {
  left: 100%;
}

.auth-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(66, 153, 225, 0.3);
}

.auth-button:disabled {
  background: linear-gradient(45deg, #a0aec0, #cbd5e0);
  color: #f8fafc;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 10px rgba(160, 174, 192, 0.2);
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
  }
}

.auth-link {
  text-align: center;
  margin-top: 24px;
  font-size: 1rem;
}

.auth-link a {
  color: #4299e1;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s;
  position: relative;
}

.auth-link a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #4299e1, #2b6cb0);
  transition: width 0.3s;
}

.auth-link a:hover {
  color: #2b6cb0;
}

.auth-link a:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .welcome-section h1 {
    font-size: 2.2rem;
  }
  
  .auth-card {
    padding: 30px;
  }
  
  .welcome-section {
    padding: 30px 15px;
  }
}

@media (max-width: 480px) {
  .welcome-section h1 {
    font-size: 1.9rem;
  }
  
  .welcome-section p {
    font-size: 1rem;
  }
  
  .auth-card h2 {
    font-size: 1.6rem;
  }
}
</style>