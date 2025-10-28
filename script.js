class LotteryGame {
    constructor() {
        this.isRunning = false;
        this.numbers = [];
        this.currentIndex = 0;
        this.rollDuration = 2500; // 每个数字滚动持续时间(ms) - 2.5秒
        this.stopDelay = 1000; // 数字停稳后的延迟时间(ms) - 1秒
        
        this.initElements();
        this.bindEvents();
        this.generateNumbers();
        this.createNumberElements();
    }
    
    initElements() {
        this.initialText = document.getElementById('initialText');
        this.lotteryContainer = document.getElementById('lotteryContainer');
        this.lotteryGrid = document.getElementById('lotteryGrid');
        this.startButton = document.getElementById('startButton');
    }
    
    bindEvents() {
        this.startButton.addEventListener('click', () => {
            this.startLottery();
        });
    }
    
    // 生成1-200中随机选择56个不重复数字的数组
    generateNumbers() {
        // 创建1-200的数组
        const allNumbers = [];
        for (let i = 1; i <= 200; i++) {
            allNumbers.push(i);
        }
        
        // 使用Fisher-Yates洗牌算法打乱数组
        for (let i = allNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
        }
        
        // 取前56个数字
        this.numbers = allNumbers.slice(0, 56);
    }
    
    // 创建56个数字元素
    createNumberElements() {
        this.lotteryGrid.innerHTML = '';
        
        for (let i = 0; i < 56; i++) {
            const numberItem = document.createElement('div');
            numberItem.className = 'number-item hidden'; // 初始状态完全隐藏
            numberItem.id = `number-${i}`;
            
            const numberSpan = document.createElement('span');
            numberSpan.className = 'number';
            numberSpan.textContent = ''; // 不显示任何内容
            
            numberItem.appendChild(numberSpan);
            this.lotteryGrid.appendChild(numberItem);
        }
    }
    
    // 开始抽奖
    startLottery() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.currentIndex = 0;
        
        // 隐藏初始文字
        this.initialText.style.opacity = '0';
        
        // 显示抽奖区域
        setTimeout(() => {
            this.initialText.style.display = 'none';
            this.lotteryContainer.classList.add('show');
            
            // 禁用按钮
            this.startButton.disabled = true;
            this.startButton.textContent = '抽奖进行中...';
            
            // 开始逐个滚动
            this.startRolling();
        }, 500);
    }
    
    // 开始逐个滚动动画
    startRolling() {
        if (this.currentIndex >= 56) {
            this.finishLottery();
            return;
        }
        
        const currentElement = document.getElementById(`number-${this.currentIndex}`);
        const numberSpan = currentElement.querySelector('.number');
        
        // 显示当前数字的num图片并开始滚动
        currentElement.classList.remove('hidden');
        currentElement.classList.add('rolling');
        
        // 滚动过程中随机显示数字
        const rollInterval = setInterval(() => {
            const randomNum = Math.floor(Math.random() * 200) + 1;
            numberSpan.textContent = randomNum;
        }, 50);
        
        // 停止滚动并显示最终数字
        setTimeout(() => {
            clearInterval(rollInterval);
            currentElement.classList.remove('rolling');
            currentElement.classList.add('stopped');
            
            // 显示最终确定的数字
            numberSpan.textContent = this.numbers[this.currentIndex];
            
            // 移动到下一个数字
            this.currentIndex++;
            
            // 延迟后开始下一个数字的滚动
            setTimeout(() => {
                this.startRolling();
            }, this.stopDelay);
            
        }, this.rollDuration);
    }
    
    // 完成抽奖
    finishLottery() {
        // 重新启用按钮
        this.startButton.disabled = false;
        this.startButton.textContent = '重新抽奖';
        
        // 重置状态
        this.isRunning = false;
        
        // 可以在这里添加抽奖完成后的效果
        this.showCompletionEffect();
    }
    
    // 显示完成效果
    showCompletionEffect() {
        // 为所有数字添加完成效果
        const allNumbers = document.querySelectorAll('.number-item');
        allNumbers.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(1.05)';
                item.style.boxShadow = '0 0 25px rgba(255, 255, 255, 0.8)';
                
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                    item.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
                }, 200);
            }, index * 50);
        });
    }
    
    // 重置游戏
    resetGame() {
        this.isRunning = false;
        this.currentIndex = 0;
        
        // 隐藏抽奖区域
        this.lotteryContainer.classList.remove('show');
        
        // 显示初始文字
        setTimeout(() => {
            this.initialText.style.display = 'block';
            this.initialText.style.opacity = '1';
            
            // 重置按钮
            this.startButton.disabled = false;
            this.startButton.textContent = '开始抽奖';
            
            // 重新生成数字
            this.generateNumbers();
            this.createNumberElements();
        }, 500);
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new LotteryGame();
    
    // 添加重新抽奖功能
    document.getElementById('startButton').addEventListener('click', () => {
        if (game.isRunning) return;
        
        if (game.startButton.textContent === '重新抽奖') {
            game.resetGame();
        }
    });
});

// 防止页面缩放和右键菜单（适合大屏展示）
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

document.addEventListener('keydown', (e) => {
    // 禁用F11以外的功能键
    if (e.key === 'F11') {
        e.preventDefault();
    }
    
    // ESC键退出全屏
    if (e.key === 'Escape') {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
});
