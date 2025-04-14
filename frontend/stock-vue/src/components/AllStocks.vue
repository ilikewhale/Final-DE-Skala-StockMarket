<template>
    <div class="stock-wrapper">
      <h1 class="stock-title">전체 주식 목록</h1>
      
      <div v-if="loading" class="loading-state">
        <p>주식 정보를 불러오는 중입니다...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>데이터를 불러오는데 문제가 발생했습니다.</p>
        <small>{{ error }}</small>
      </div>
      
      <div v-else-if="stocks.length === 0" class="empty-state">
        <p>등록된 주식이 없습니다.</p>
      </div>
      
      <div v-else class="stock-container">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="주식 이름으로 검색" 
            class="search-input"
          />
        </div>
        
        <ul class="stock-list">
          <li 
            v-for="stock in filteredStocks" 
            :key="stock.stockName"
            class="stock-item"
            :class="{'up': stock.priceChange > 0, 'down': stock.priceChange < 0}"
          >
            <div class="stock-info">
              <span class="stock-name">{{ stock.stockName }}</span>
              <span class="text-sm text-gray-500 ml-2">Stock ID: {{ stock.stockId }}</span>
            </div>
            
            <div class="price-container">
              <span class="stock-price">{{ formatCurrency(stock.price) }}</span>
              <span 
                v-if="stock.priceChange !== undefined" 
                class="price-change"
                :class="{'positive': stock.priceChange > 0, 'negative': stock.priceChange < 0}"
              >
                {{ stock.priceChange > 0 ? '▲' : stock.priceChange < 0 ? '▼' : '-' }}
                {{ Math.abs(stock.priceChange || 0).toLocaleString() }}
                ({{ formatPercentage(stock.changeRate) }})
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import axios from 'axios'
  
  // 상태 관리
  const stocks = ref([])
  const loading = ref(true)
  const error = ref(null)
  const searchQuery = ref('')
  
  // 필터링된 주식 목록
  const filteredStocks = computed(() => {
    if (!searchQuery.value) return stocks.value
    
    const query = searchQuery.value.toLowerCase()
    return stocks.value.filter(stock => 
      stock.stockName.toLowerCase().includes(query)
    )
  })
  
  // 금액 포맷팅
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  // 퍼센트 포맷팅
  const formatPercentage = (value) => {
    if (value === undefined || value === null) return '-'
    return new Intl.NumberFormat('ko-KR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100)
  }
  
  let intervalId = null
  
  const fetchStockData = async () => {
    try {
    const url = '/api/stock'
    const res = await axios.get(url)
  
    stocks.value = res.data.map(stock => ({
      ...stock,
      priceChange: stock.price * (stock.changeRate / 100),
      priceChangePercent: stock.changeRate
    }))
    } catch (err) {
      console.error('주식 데이터 로드 실패:', err)
      error.value = err?.message || '데이터를 불러오는데 실패했습니다.'
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    fetchStockData() // 첫 로딩
    intervalId = setInterval(fetchStockData, 1000) // 10초마다 실행
  })
  
  onUnmounted(() => {
    clearInterval(intervalId) // 컴포넌트 종료 시 정리
  })
  </script>
  
  <style scoped>
  .stock-wrapper {
    padding: 2rem 1rem;
    min-height: 100vh;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .stock-title {
    font-size: 2.2rem;
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
  
  .stock-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  
    display: flex;
    flex-direction: column;
    height: 500px;
  }
  
  .search-box {
    padding: 1rem;
    background: #f8f9fa;
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
  }
  
  .search-input {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
  
  .stock-list {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    flex-grow: 1;
  }
  
  .stock-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s ease;
  }
  
  .stock-item:hover {
    background-color: #f9f9f9;
  }
  
  .stock-item:last-child {
    border-bottom: none;
  }
  
  .stock-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stock-id {
    font-weight: bold;
    font-size: 1.1rem;
    color: #2c3e50;
    margin-bottom: 0.2rem;
  }
  
  .stock-name {
    font-weight: bold;
    font-size: 1.1rem;
    color: #2c3e50;
    margin-bottom: 0.2rem;
  }
  
  .stock-details {
    font-size: 0.85rem;
    color: #7f8c8d;
  }
  
  .price-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .stock-price {
    font-weight: bold;
    font-size: 1.1rem;
    color: #2c3e50;
    margin-bottom: 0.2rem;
  }
  
  .price-change {
    font-size: 0.9rem;
  }
  
  .positive {
    color: #2ecc71;
  }
  
  .negative {
    color: #e74c3c;
  }
  
  /* 애니메이션 효과 */
  .stock-item.up {
    animation: highlight-green 2s ease-out;
  }
  
  .stock-item.down {
    animation: highlight-red 2s ease-out;
  }
  
  @keyframes highlight-green {
    0% { background-color: rgba(46, 204, 113, 0.2); }
    100% { background-color: transparent; }
  }
  
  @keyframes highlight-red {
    0% { background-color: rgba(231, 76, 60, 0.2); }
    100% { background-color: transparent; }
  }
  
  @media (max-width: 768px) {
    .stock-wrapper {
      padding: 1.5rem 0.8rem;
    }
    
    .stock-title {
      font-size: 1.8rem;
    }
    
    .stock-item {
      padding: 1rem;
    }
    
    .stock-name {
      font-size: 1rem;
    }
    
    .stock-price {
      font-size: 1rem;
    }
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
  </style>