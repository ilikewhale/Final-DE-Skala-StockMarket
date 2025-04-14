<template>
    <div class="stock-trading-container">
      <h1 class="text-2xl font-bold mb-6">주식 거래</h1>
      
      <!-- 거래 폼 -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">주식 ID</label>
            <input
              v-model="stockId"
              type="text"
              placeholder="주식 ID 또는 보유 주식 ID를 입력하세요"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">비밀번호</label>
            <input
              v-model="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium mb-1">수량</label>
            <input
              v-model="quantity"
              type="text"
              placeholder="수량을 입력하세요"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div class="flex space-x-2 pt-2">
            <button @click="buyStock" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">구매</button>
            <button @click="sellStock" class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">판매</button>
            <button @click="sellAllStock" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">매도</button>
          </div>
        </div>
        
        <!-- 거래 결과 메시지 -->
        <div v-if="transactionMessage" class="mt-4 p-3 rounded" :class="messageStyle">
          {{ transactionMessage }}
        </div>
      </div>
      
      <!-- 보유 주식 리스트 -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">보유 주식</h2>
        <div v-if="ownedStocks.length === 0" class="text-gray-500">
          보유한 주식이 없습니다.
        </div>
        <ul v-else class="divide-y stock-list">
          <li v-for="stock in ownedStocks" :key="stock.stock.stockId" class="py-3 flex justify-between">
            <div>
              <span class="font-medium">{{ stock.stock.stockName }}</span>
              <span class="text-sm text-gray-500 ml-2">Own Stock ID: {{ stock.playerStockId }}</span>
            </div>
            <div class="flex items-center">
              <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">{{ stock.quantity }}개</span>
              <span class="ml-2 text-gray-700">₩{{ formatPrice(stock.stock.price * stock.quantity) }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed, defineEmits } from 'vue'
  import axios from 'axios'
  
  // Props 정의 (playerId를 받아옵니다.)
  const props = defineProps<{ playerId: string }>()
  const emit = defineEmits(['update-player'])
  
  // 상태 관리
  const stockId = ref('')
  const password = ref('')
  const quantity = ref(0)
  const transactionMessage = ref('')
  const transactionStatus = ref<'success' | 'error' | null>(null)
  
  // 메시지 스타일 계산
  const messageStyle = computed(() => {
    return transactionStatus.value === 'success'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  })
  
  type Player = {
    id: number;
    playerId: string;
    playerPw: string;
    confirmation: string;
    playerMoney: number;
    createdAt: string;
    updatedAt: string;
  };
  
  type Stock = {
    stockId: number;
    stockName: string;
    price: number;
    changeRate: string;
    createdAt: string;
    updatedAt: string;
  };
  
  type Stocks = {
    playerStockId: Number,
    player: Player;
    stock: Stock;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  };
  
  const ownedStocks = ref<Stocks[]>([]);
  
  // 가격 포맷팅 함수
  const formatPrice = (price: number): string => {
    return price.toLocaleString('ko-KR')
  }
  
  // 보유 주식 로딩
  onMounted(async () => {
    await loadOwnedStocks()
  })
  
  const initValues = () => {
    stockId.value = ""
    password.value = ""
    quantity.value = 0
  }
  
  // 주식 구매
  const buyStock = async () => {
    if (!stockId.value || !password.value || quantity.value == 0) {
      showErrorMessage('주식 ID와 비밀번호, 수량을 모두 입력해주세요.')
      return
    }
  
    try {
      await axios.post('/api/player/stock/buy', {
        playerId: props.playerId,
        playerPw: password.value,
        stockId: stockId.value,
        quantity: quantity.value,
      })
      
      showSuccessMessage(`주식 ID "${stockId.value}" 구매 성공!`)
      await loadOwnedStocks()
      emit('update-player')
      initValues()    
    } catch (error) {
      showErrorMessage(`주식 구매 실패: ${getErrorMessage(error)}`)
    }
  }
  
  // 주식 판매
  const sellStock = async () => {
    if (!stockId.value || !password.value || quantity.value == 0) {
      showErrorMessage('주식 ID와 비밀번호, 수량을 모두 입력해주세요.')
      return
    }
  
    try {
      await axios.patch('/api/player/stock/sell', {
        playerStockId: stockId.value,
        playerPw: password.value,
        reduceQuantity: quantity.value,
      })
      
      showSuccessMessage(`주식 ID "${stockId.value}" 판매 성공!`)
      await loadOwnedStocks()
      emit('update-player')
      initValues()
    } catch (error) {
      showErrorMessage(`주식 판매 실패: ${getErrorMessage(error)}`)
    }
  }
  
  // 모든 주식 판매
  const sellAllStock = async () => {
    if (!stockId.value || !password.value) {
      showErrorMessage('주식 ID와 비밀번호를 모두 입력해주세요.')
      return
    }
  
    try {
      await axios.post('/api/player/stock/sell/all', {
        playerStockId: stockId.value,
        playerPw: password.value,
      })
      
      showSuccessMessage(`주식 ID "${stockId.value}" 모든 주식 판매 성공!`)
      await loadOwnedStocks()
      emit('update-player')
      initValues()
    } catch (error) {
      showErrorMessage(`모든 주식 판매 실패: ${getErrorMessage(error)}`)
    }
  }
  
  // 보유 주식 리스트 다시 불러오기
  const loadOwnedStocks = async () => {
    try {
      const res = await axios.get(`/api/player/stock/${props.playerId}/all`)
      ownedStocks.value = res.data
    } catch (error) {
      console.error('보유 주식 로딩 실패:', error)
      showErrorMessage('보유 주식 정보를 불러오는데 실패했습니다.')
    }
  }
  
  // 에러 메시지 표시
  const showErrorMessage = (message: string) => {
    transactionMessage.value = message
    transactionStatus.value = 'error'
    setTimeout(() => {
      transactionMessage.value = ''
    }, 5000)
  }
  
  // 성공 메시지 표시
  const showSuccessMessage = (message: string) => {
    transactionMessage.value = message
    transactionStatus.value = 'success'
    setTimeout(() => {
      transactionMessage.value = ''
    }, 5000)
  }
  
  // 에러 메시지 추출
  const getErrorMessage = (error: any): string => {
    return error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'
  }
  </script>
  
  <style scoped>
  .stock-trading-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    color: #333;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  }
  
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #1a202c;
  }
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1a202c;
  }
  
  .bg-white {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  /* 폼 스타일 */
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #4a5568;
  }
  
  input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    margin-bottom: 1rem;
  }
  
  input:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
    outline: none;
  }
  
  input::placeholder {
    color: #a0aec0;
  }
  
  /* 버튼 컨테이너 */
  .flex.space-x-2 {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  /* 버튼 스타일 */
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  button:hover {
    transform: translateY(-1px);
    opacity: 0.92;
  }
  
  button:active {
    transform: translateY(1px);
  }
  
  /* 버튼 색상 */
  .bg-green-600 {
    background-color: #38a169;
    color: white;
  }
  
  .bg-orange-600 {
    background-color: #dd6b20;
    color: white;
  }
  
  .bg-red-600 {
    background-color: #e53e3e;
    color: white;
  }
  
  /* 메시지 스타일 */
  .mt-4 {
    margin-top: 1rem;
  }
  
  .p-3 {
    padding: 0.75rem;
  }
  
  .rounded {
    border-radius: 6px;
  }
  
  .bg-green-100 {
    background-color: #c6f6d5;
    border: 1px solid #9ae6b4;
  }
  
  .text-green-800 {
    color: #276749;
  }
  
  .bg-red-100 {
    background-color: #fed7d7;
    border: 1px solid #feb2b2;
  }
  
  .text-red-800 {
    color: #9b2c2c;
  }
  
  /* 보유 주식 목록 스타일 */
  .divide-y > li {
    padding: 0.75rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #edf2f7;
  }
  
  .divide-y > li:last-child {
    border-bottom: none;
  }
  
  .font-medium {
    font-weight: 500;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  .text-gray-500 {
    color: #718096;
  }
  
  .ml-2 {
    margin-left: 0.5rem;
  }
  
  .flex.items-center {
    display: flex;
    align-items: center;
  }
  
  /* 주식 수량 태그 */
  .px-2.py-1.bg-blue-100 {
    background-color: #ebf8ff;
    color: #2b6cb0;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .text-blue-800 {
    color: #2c5282;
  }
  
  .text-gray-700 {
    color: #4a5568;
  }
  
  /* 주식이 없을 때 메시지 */
  .text-gray-500 {
    color: #718096;
    padding: 1rem 0;
    text-align: center;
  }
  
  .stock-list {
    max-height: 300px; /* 원하는 높이 설정 */
    overflow-y: auto;
  }
  </style>