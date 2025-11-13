// 전역 상태 관리
let deck = [];
let nextCardId = 1;
let transformationCost = 10; // 변환 비용
let currentSavingSlot = null; // 현재 저장 중인 슬롯 번호

// 복제/제거 비용 계산 함수 (0-indexed: 0회차=0pt, 1회차=10pt, 2회차=30pt, 3회차=50pt, 4회차 이상=70pt)
function getDuplicateRemovalCost(count) {
    if (count === 0) return 0;
    if (count === 1) return 10;
    if (count === 2) return 30;
    if (count === 3) return 50;
    return 70; // 4회 이상
}

// 제거 비용 계산 (개별 카드)
function calculateRemovalCostForCard(card, removalIndex) {
    let cost = getDuplicateRemovalCost(removalIndex);

    // 기본 카드 또는 번뜩임 카드라면 20pt 추가
    if (card.type === 'basic' || card.option === 'spark') {
        cost += 20;
    }

    return cost;
}

// 카드 타입별 기본 비용
function getCardTypeCost(type) {
    switch(type) {
        case 'basic':
        case 'unique':
            return 0;
        case 'neutral':
            return 20;
        case 'forbidden':
            return 20;
        case 'monster':
            return 80;
        default:
            return 0;
    }
}

// 옵션 비용
function getOptionCost(option) {
    switch(option) {
        case 'spark':
            return 10;
        case 'divine':
            return 20;
        default:
            return 0;
    }
}

// 카드 비용 계산
function calculateCardCost(card) {
    let cost = 0;

    // 제거된 카드는 비용만 계산하고 반환
    if (card.isRemoved) {
        return card.removalCost || 0;
    }

    // 카드 타입 기본 비용
    cost += getCardTypeCost(card.type);

    // 복제 비용
    if (card.duplicateCount > 0) {
        for (let i = 0; i < card.duplicateCount; i++) {
            cost += getDuplicateRemovalCost(i);
        }
    }

    // 옵션 비용
    cost += getOptionCost(card.option);

    // 변환 비용
    if (card.isTransformed) {
        cost += transformationCost;
    }

    return cost;
}

// 총 세이브 포인트 계산
function calculateTotalPoints() {
    return deck.reduce((total, card) => total + card.cost, 0);
}

// UI 업데이트
function updateUI() {
    const totalPoints = calculateTotalPoints();
    const maxPoints = parseInt(document.getElementById('maxPoints').textContent);

    document.getElementById('currentPoints').textContent = totalPoints;

    const warningMessage = document.getElementById('warningMessage');
    if (totalPoints > maxPoints) {
        warningMessage.classList.remove('hidden');
        document.getElementById('currentPoints').style.color = '#e74c3c';
    } else {
        warningMessage.classList.add('hidden');
        document.getElementById('currentPoints').style.color = '#2ecc71';
    }

    renderDeckTable();
}

// 덱 테이블 렌더링
function renderDeckTable() {
    const tbody = document.getElementById('deckTableBody');

    // 기존 이벤트 리스너 제거를 위해 새로운 요소로 교체
    const newTbody = tbody.cloneNode(false);
    tbody.parentNode.replaceChild(newTbody, tbody);

    const updatedTbody = document.getElementById('deckTableBody');

    deck.forEach((card, index) => {
        const row = document.createElement('tr');

        // 옵션 체크박스 생성 (하나만 선택 가능)
        const sparkChecked = card.option === 'spark' ? 'checked' : '';
        const divineChecked = card.option === 'divine' ? 'checked' : '';

        // 제거 체크박스
        const removedChecked = card.isRemoved ? 'checked' : '';

        // 변환 체크박스
        const transformedChecked = card.isTransformed ? 'checked' : '';

        // 제거된 카드 스타일
        if (card.isRemoved) {
            row.classList.add('removed-card');
        }

        row.innerHTML = `
            <td>${index + 1}</td>
            <td class="editable-name" data-card-id="${card.id}" data-edit="true">${card.name}</td>
            <td class="rarity-${card.rarity}">${getRarityText(card.rarity)}</td>
            <td>${getTypeText(card.type)}</td>
            <td class="option-checkboxes">
                <label><input type="checkbox" ${sparkChecked} onchange="updateCardOption(${card.id}, 'spark', this.checked)"> 번뜩임</label>
                <label><input type="checkbox" ${divineChecked} onchange="updateCardOption(${card.id}, 'divine', this.checked)"> 신뜩임</label>
            </td>
            <td class="cost">${card.cost} pt</td>
            <td class="action-controls">
                <label class="remove-checkbox-label">
                    <input type="checkbox" ${removedChecked} onchange="toggleRemoved(${card.id}, this.checked)">
                    제거
                </label>
                <label class="remove-checkbox-label">
                    <input type="checkbox" ${transformedChecked} onchange="toggleTransformed(${card.id}, this.checked)">
                    변환
                </label>
                <button class="btn-duplicate" onclick="duplicateCard(${card.id})">복제</button>
                <button class="btn-delete" onclick="deleteCard(${card.id})">삭제</button>
            </td>
        `;

        updatedTbody.appendChild(row);
    });

    // 이벤트 위임으로 더블클릭 처리
    updatedTbody.addEventListener('dblclick', handleTableDblClick);
}

// 테이블 더블클릭 이벤트 핸들러
function handleTableDblClick(e) {
    const nameCell = e.target.closest('[data-edit="true"]');
    if (nameCell) {
        const cardId = parseInt(nameCell.getAttribute('data-card-id'));
        editCardName(cardId, nameCell);
    }
}

// 텍스트 변환 함수들
function getRarityText(rarity) {
    const rarityMap = {
        'common': '일반',
        'rare': '희귀',
        'legendary': '전설',
        'mythic': '신화'
    };
    return rarityMap[rarity] || rarity;
}

function getTypeText(type) {
    const typeMap = {
        'basic': '기본 카드',
        'unique': '고유 카드',
        'neutral': '중립 카드',
        'forbidden': '금기 카드',
        'monster': '몬스터 카드'
    };
    return typeMap[type] || type;
}

function getOptionText(option) {
    const optionMap = {
        'none': '없음',
        'spark': '번뜩임',
        'divine': '신뜩임'
    };
    return optionMap[option] || '없음';
}

// 카드 이름 편집
function editCardName(cardId, element) {
    const card = deck.find(c => c.id === cardId);
    if (!card) return;

    // 이미 편집 중이면 무시
    const existingInput = element.querySelector('input');
    if (existingInput) {
        existingInput.focus();
        return;
    }

    const currentName = card.name;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'edit-name-input';

    element.innerHTML = '';
    element.appendChild(input);

    setTimeout(() => {
        input.focus();
        input.select();
    }, 0);

    let isSaved = false;

    const saveName = () => {
        if (isSaved) return;
        isSaved = true;

        const newName = input.value.trim();
        if (newName) {
            card.name = newName;
        }
        updateUI();
    };

    const handleKeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            saveName();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            isSaved = true;
            updateUI();
        }
    };

    input.addEventListener('blur', saveName);
    input.addEventListener('keydown', handleKeydown);
}

// 카드 옵션 업데이트
function updateCardOption(cardId, optionType, isChecked) {
    const card = deck.find(c => c.id === cardId);
    if (!card) return;

    // 체크된 경우 해당 옵션만 설정 (다른 옵션은 자동으로 해제)
    if (isChecked) {
        card.option = optionType;
    } else {
        // 체크 해제된 경우 옵션 없음
        card.option = 'none';
    }

    // 비용 재계산
    card.cost = calculateCardCost(card);
    updateUI();
}

// 카드 복제
function duplicateCard(cardId) {
    const sourceCard = deck.find(c => c.id === cardId);
    if (!sourceCard) return;

    const duplicatedCard = {
        id: nextCardId++,
        name: sourceCard.name + ' 복제됨',
        rarity: sourceCard.rarity,
        type: sourceCard.type,
        option: sourceCard.option,
        duplicateCount: 0,
        isRemoval: false,
        isRemoved: false,
        isTransformed: false,
        removalCost: 0,
        cost: 0
    };

    duplicatedCard.cost = calculateCardCost(duplicatedCard);
    deck.push(duplicatedCard);
    updateUI();
}

// 카드 제거 토글
function toggleRemoved(cardId, isRemoved) {
    const card = deck.find(c => c.id === cardId);
    if (!card) return;

    card.isRemoved = isRemoved;

    if (isRemoved) {
        // 제거된 카드의 인덱스 계산 (이미 제거된 카드들의 개수)
        const removedCards = deck.filter(c => c.isRemoved && c.id !== cardId);
        const removalIndex = removedCards.length;

        // 제거 비용 계산
        card.removalCost = calculateRemovalCostForCard(card, removalIndex);
    } else {
        card.removalCost = 0;
    }

    // 모든 제거된 카드의 비용 재계산
    recalculateAllRemovalCosts();

    card.cost = calculateCardCost(card);
    updateUI();
}

// 카드 변환 토글
function toggleTransformed(cardId, isTransformed) {
    const card = deck.find(c => c.id === cardId);
    if (!card) return;

    card.isTransformed = isTransformed;
    card.cost = calculateCardCost(card);
    updateUI();
}

// 모든 제거된 카드의 비용 재계산
function recalculateAllRemovalCosts() {
    const removedCards = deck.filter(c => c.isRemoved);

    removedCards.forEach((card, index) => {
        card.removalCost = calculateRemovalCostForCard(card, index);
        card.cost = calculateCardCost(card);
    });
}

// 카드 삭제
function deleteCard(cardId) {
    deck = deck.filter(card => card.id !== cardId);

    // 제거된 카드들의 비용 재계산
    recalculateAllRemovalCosts();

    updateUI();
}

// 초기 덱 생성 (기본 카드만)
function initializeDeck() {
    deck = [];
    nextCardId = 1;

    // 기본 카드 4장 (일반 3장, 희귀 1장)
    for (let i = 0; i < 3; i++) {
        deck.push({
            id: nextCardId++,
            name: `기본 카드 ${i + 1}`,
            rarity: 'common',
            type: 'basic',
            option: 'none',
            duplicateCount: 0,
            isRemoval: false,
            isRemoved: false,
            isTransformed: false,
            removalCost: 0,
            cost: 0
        });
    }

    deck.push({
        id: nextCardId++,
        name: '기본 카드 4',
        rarity: 'rare',
        type: 'basic',
        option: 'none',
        duplicateCount: 0,
        isRemoval: false,
        isRemoved: false,
        isTransformed: false,
        removalCost: 0,
        cost: 0
    });

    updateUI();
}

// 던전 티어 변경 시 저장 용량 계산
function updateStorageCapacity() {
    let tier = parseInt(document.getElementById('dungeonTier').value);
    const isNightmare = document.getElementById('nightmareMode').checked;
    const adjustment = parseInt(document.getElementById('capacityAdjustment').value) || 0;

    // 나이트메어 모드 시 티어 +1
    if (isNightmare) {
        tier += 1;
    }

    // 저장 용량 계산: (티어 * 10) + 20 + 보정치
    const capacity = (tier * 10) + 20 + adjustment;

    document.getElementById('storageCapacity').textContent = capacity;
    document.getElementById('maxPoints').textContent = capacity;
    updateUI();
}

// 고유 카드 추가
function addUniqueCard() {
    const name = document.getElementById('uniqueCardName').value.trim();
    if (!name) {
        alert('카드 이름을 입력해주세요.');
        return;
    }

    const rarity = document.getElementById('uniqueCardRarity').value;

    const card = {
        id: nextCardId++,
        name: name,
        rarity: rarity,
        type: 'unique',
        option: 'none',
        duplicateCount: 0,
        isRemoval: false,
        isRemoved: false,
        isTransformed: false,
        removalCost: 0,
        cost: 0
    };

    card.cost = calculateCardCost(card);
    deck.push(card);

    // 폼 초기화
    document.getElementById('uniqueCardName').value = '';

    updateUI();
}

// 일반 카드 추가
function addNormalCard() {
    const name = document.getElementById('normalCardName').value.trim();
    if (!name) {
        alert('카드 이름을 입력해주세요.');
        return;
    }

    const type = document.getElementById('normalCardType').value;

    const card = {
        id: nextCardId++,
        name: name,
        rarity: 'common',
        type: type,
        option: 'none',
        duplicateCount: 0,
        isRemoval: false,
        isRemoved: false,
        isTransformed: false,
        removalCost: 0,
        cost: 0
    };

    card.cost = calculateCardCost(card);
    deck.push(card);

    // 폼 초기화
    document.getElementById('normalCardName').value = '';

    updateUI();
}

// 포커스 복구 함수 (재사용 가능)
function restoreFocus() {
    setTimeout(() => {
        // 1. 모든 input 요소를 명시적으로 활성화
        const allInputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="checkbox"]');
        allInputs.forEach(input => {
            input.disabled = false;
            input.readOnly = false;
            input.removeAttribute('disabled');
            input.removeAttribute('readonly');
        });

        // 2. Electron 윈도우 포커스 재설정 요청
        try {
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('restore-focus');
        } catch(e) {
            console.error('IPC error:', e);
        }

        // 3. 웹페이지 레벨에서도 포커스 리셋
        setTimeout(() => {
            document.body.focus();
            document.body.click();
        }, 150);
    }, 100);
}

// 덱 초기화
function clearDeck() {
    if (confirm('정말로 덱을 초기화하시겠습니까?')) {
        deck = [];
        nextCardId = 1;
        updateUI();
        restoreFocus();
    }
}

// 덱 저장
function saveDeck() {
    const deckData = {
        deck: deck,
        nextCardId: nextCardId,
        tier: parseInt(document.getElementById('dungeonTier').value),
        nightmareMode: document.getElementById('nightmareMode').checked,
        capacityAdjustment: parseInt(document.getElementById('capacityAdjustment').value) || 0
    };

    localStorage.setItem('savedDeck', JSON.stringify(deckData));
    alert('덱이 저장되었습니다.');

    // 포커스 복구
    restoreFocus();
}

// 슬롯에 저장
function saveToSlot(slotNumber) {
    currentSavingSlot = slotNumber;
    const modal = document.getElementById('slotNameModal');
    const input = document.getElementById('slotNameInput');

    input.value = '';
    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    setTimeout(() => {
        input.focus();
        input.select();
    }, 100);
}

// 슬롯 이름 입력 확인
function confirmSlotName() {
    const input = document.getElementById('slotNameInput');
    const slotName = input.value.trim() || '(이름없음)';
    const modal = document.getElementById('slotNameModal');

    if (currentSavingSlot === null) return;

    const deckData = {
        deck: deck,
        nextCardId: nextCardId,
        tier: parseInt(document.getElementById('dungeonTier').value),
        nightmareMode: document.getElementById('nightmareMode').checked,
        capacityAdjustment: parseInt(document.getElementById('capacityAdjustment').value) || 0,
        timestamp: new Date().toLocaleString('ko-KR'),
        slotName: slotName
    };

    const slotKey = `deckSlot_${currentSavingSlot}`;
    localStorage.setItem(slotKey, JSON.stringify(deckData));

    modal.classList.add('hidden');
    modal.style.display = 'none';
    input.value = '';

    alert(`슬롯 ${currentSavingSlot}에 저장되었습니다.`);
    currentSavingSlot = null;

    updateSlotDisplay();
    restoreFocus();
}

// 슬롯 이름 입력 취소
function cancelSlotName() {
    const modal = document.getElementById('slotNameModal');
    const input = document.getElementById('slotNameInput');

    modal.classList.add('hidden');
    modal.style.display = 'none';
    input.value = '';
    currentSavingSlot = null;

    restoreFocus();
}

// 슬롯에서 불러오기
function loadFromSlot(slotNumber) {
    const slotKey = `deckSlot_${slotNumber}`;
    const savedData = localStorage.getItem(slotKey);

    if (!savedData) {
        alert(`슬롯 ${slotNumber}에 저장된 덱이 없습니다.`);
        restoreFocus();
        return;
    }

    const deckData = JSON.parse(savedData);
    deck = deckData.deck;
    nextCardId = deckData.nextCardId;

    // 기존 데이터 호환성
    deck.forEach(card => {
        if (card.removalCost === undefined) {
            card.removalCost = 0;
        }
        if (card.isTransformed === undefined) {
            card.isTransformed = false;
        }
        card.cost = calculateCardCost(card);
    });

    recalculateAllRemovalCosts();

    if (deckData.tier) {
        document.getElementById('dungeonTier').value = deckData.tier;
    }

    if (deckData.nightmareMode !== undefined) {
        document.getElementById('nightmareMode').checked = deckData.nightmareMode;
    }

    if (deckData.capacityAdjustment !== undefined) {
        document.getElementById('capacityAdjustment').value = deckData.capacityAdjustment;
    }

    updateStorageCapacity();

    alert(`슬롯 ${slotNumber}에서 불러왔습니다.`);

    updateUI();
    restoreFocus();
}

// 슬롯 표시 업데이트
function updateSlotDisplay() {
    for (let i = 1; i <= 5; i++) {
        const slotKey = `deckSlot_${i}`;
        const savedData = localStorage.getItem(slotKey);
        const slotItem = document.querySelector(`.slot-item[data-slot="${i}"]`);
        const slotInfo = slotItem.querySelector('.slot-info');

        if (savedData) {
            const deckData = JSON.parse(savedData);
            const slotName = deckData.slotName || '저장됨';
            slotInfo.textContent = slotName;
            slotItem.classList.add('has-data');
        } else {
            slotInfo.textContent = '비어있음';
            slotItem.classList.remove('has-data');
        }
    }
}

// 덱 불러오기
function loadDeck() {
    const savedData = localStorage.getItem('savedDeck');

    if (!savedData) {
        alert('저장된 덱이 없습니다.');
        return;
    }

    const deckData = JSON.parse(savedData);
    deck = deckData.deck;
    nextCardId = deckData.nextCardId;

    // 기존 데이터 호환성: removalCost와 isTransformed가 없는 카드에 추가
    deck.forEach(card => {
        if (card.removalCost === undefined) {
            card.removalCost = 0;
        }
        if (card.isTransformed === undefined) {
            card.isTransformed = false;
        }
        // 모든 카드의 비용 재계산
        card.cost = calculateCardCost(card);
    });

    // 제거된 카드들의 비용 재계산
    recalculateAllRemovalCosts();

    if (deckData.tier) {
        document.getElementById('dungeonTier').value = deckData.tier;
    }

    if (deckData.nightmareMode !== undefined) {
        document.getElementById('nightmareMode').checked = deckData.nightmareMode;
    }

    if (deckData.capacityAdjustment !== undefined) {
        document.getElementById('capacityAdjustment').value = deckData.capacityAdjustment;
    }

    updateStorageCapacity();

    // alert를 먼저 표시
    alert('덱을 불러왔습니다.');

    // UI 업데이트
    updateUI();

    // 포커스 복구
    restoreFocus();
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    // 던전 티어 변경
    document.getElementById('dungeonTier').addEventListener('input', updateStorageCapacity);

    // 나이트메어 모드 체크박스
    document.getElementById('nightmareMode').addEventListener('change', updateStorageCapacity);

    // 보정치 입력
    document.getElementById('capacityAdjustment').addEventListener('input', updateStorageCapacity);

    // 고유 카드 추가
    document.getElementById('addUniqueCardBtn').addEventListener('click', addUniqueCard);

    // 일반 카드 추가
    document.getElementById('addNormalCardBtn').addEventListener('click', addNormalCard);

    // 초기 덱 생성
    document.getElementById('initDeckBtn').addEventListener('click', initializeDeck);

    // 덱 초기화
    document.getElementById('clearDeckBtn').addEventListener('click', clearDeck);

    // 종료 버튼
    const exitBtn = document.getElementById('exitBtn');
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            if (confirm('앱을 종료하시겠습니까?')) {
                try {
                    const { ipcRenderer } = require('electron');
                    ipcRenderer.send('quit-app');
                } catch(e) {
                    console.error('Exit error:', e);
                    window.close();
                }
            }
        });
    }

    // 엔터키로 고유 카드 추가
    document.getElementById('uniqueCardName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addUniqueCard();
        }
    });

    // 엔터키로 일반 카드 추가
    document.getElementById('normalCardName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNormalCard();
        }
    });

    // 슬롯 이름 입력 모달에서 엔터키로 저장
    document.getElementById('slotNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmSlotName();
        }
    });

    // 초기 UI 업데이트
    updateUI();

    // 슬롯 표시 초기화
    updateSlotDisplay();
});
