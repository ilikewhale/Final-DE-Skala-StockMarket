<template>
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
  </style>