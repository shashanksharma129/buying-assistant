const productInput = document.getElementById('product-input');
const searchBtn = document.getElementById('search-btn');
const messagesContainer = document.getElementById('messages-container');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');

// Card selector elements
const selectedCardsDiv = document.getElementById('selected-cards');
const cardDropdown = document.getElementById('card-dropdown');
const cardSearch = document.getElementById('card-search');
const cardList = document.getElementById('card-list');

// Indian Cards Database
const INDIAN_CARDS = [
    // HDFC Bank
    { name: "HDFC Regalia", bank: "HDFC", type: "Credit" },
    { name: "HDFC Diners Club Black", bank: "HDFC", type: "Credit" },
    { name: "HDFC Infinia", bank: "HDFC", type: "Credit" },
    { name: "HDFC MoneyBack", bank: "HDFC", type: "Credit" },
    { name: "HDFC Millennia", bank: "HDFC", type: "Credit" },
    { name: "HDFC Freedom", bank: "HDFC", type: "Credit" },
    { name: "HDFC Platinum Debit Card", bank: "HDFC", type: "Debit" },
    // ICICI Bank
    { name: "ICICI Amazon Pay", bank: "ICICI", type: "Credit" },
    { name: "ICICI Sapphiro", bank: "ICICI", type: "Credit" },
    { name: "ICICI Coral", bank: "ICICI", type: "Credit" },
    { name: "ICICI Rubyx", bank: "ICICI", type: "Credit" },
    { name: "ICICI Platinum", bank: "ICICI", type: "Credit" },
    { name: "ICICI Emeralde", bank: "ICICI", type: "Credit" },
    // SBI
    { name: "SBI Card Elite", bank: "SBI", type: "Credit" },
    { name: "SBI Card Prime", bank: "SBI", type: "Credit" },
    { name: "SBI SimplyCLICK", bank: "SBI", type: "Credit" },
    { name: "SBI SimplySAVE", bank: "SBI", type: "Credit" },
    { name: "SBI Platinum Debit Card", bank: "SBI", type: "Debit" },
    // Axis Bank
    { name: "Axis Magnus", bank: "Axis", type: "Credit" },
    { name: "Axis Reserve", bank: "Axis", type: "Credit" },
    { name: "Axis Vistara", bank: "Axis", type: "Credit" },
    { name: "Axis Flipkart", bank: "Axis", type: "Credit" },
    { name: "Axis Ace", bank: "Axis", type: "Credit" },
    { name: "Axis Neo", bank: "Axis", type: "Credit" },
    // American Express
    { name: "Amex Platinum Card", bank: "Amex", type: "Credit" },
    { name: "Amex Gold Card", bank: "Amex", type: "Credit" },
    { name: "Amex Membership Rewards", bank: "Amex", type: "Credit" },
    { name: "Amex SmartEarn", bank: "Amex", type: "Credit" },
    // Citibank
    { name: "Citi Prestige", bank: "Citi", type: "Credit" },
    { name: "Citi PremierMiles", bank: "Citi", type: "Credit" },
    { name: "Citi Rewards", bank: "Citi", type: "Credit" },
    { name: "Citi Cashback", bank: "Citi", type: "Credit" },
    // Standard Chartered
    { name: "SC Ultimate", bank: "Standard Chartered", type: "Credit" },
    { name: "SC DigiSmart", bank: "Standard Chartered", type: "Credit" },
    { name: "SC Platinum Rewards", bank: "Standard Chartered", type: "Credit" },
    // Kotak Mahindra
    { name: "Kotak Royale Signature", bank: "Kotak", type: "Credit" },
    { name: "Kotak Zen", bank: "Kotak", type: "Credit" },
    { name: "Kotak League Platinum", bank: "Kotak", type: "Credit" },
    // Yes Bank
    { name: "Yes First Exclusive", bank: "Yes Bank", type: "Credit" },
    { name: "Yes Prosperity Rewards Plus", bank: "Yes Bank", type: "Credit" },
    // IndusInd Bank
    { name: "IndusInd Legend", bank: "IndusInd", type: "Credit" },
    { name: "IndusInd Pinnacle", bank: "IndusInd", type: "Credit" },
    { name: "IndusInd Iconia", bank: "IndusInd", type: "Credit" },
    // RBL Bank
    { name: "RBL Bank World Safari", bank: "RBL", type: "Credit" },
    { name: "RBL Bank Shoprite", bank: "RBL", type: "Credit" },
    // AU Small Finance Bank
    { name: "AU Altura Plus", bank: "AU Bank", type: "Credit" },
    { name: "AU Zenith", bank: "AU Bank", type: "Credit" },
];

// Session management for persistent chat
let currentSessionId = null;
let isFirstMessage = true;
let selectedCards = [];

// Initialize card selector
function initCardSelector() {
    renderCardList(INDIAN_CARDS);

    // Toggle dropdown
    selectedCardsDiv.addEventListener('click', () => {
        cardDropdown.classList.toggle('hidden');
        if (!cardDropdown.classList.contains('hidden')) {
            cardSearch.focus();
        }
    });

    // Search functionality
    cardSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = INDIAN_CARDS.filter(card =>
            card.name.toLowerCase().includes(query) ||
            card.bank.toLowerCase().includes(query)
        );
        renderCardList(filtered);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.card-selector-wrapper')) {
            cardDropdown.classList.add('hidden');
        }
    });
}

function renderCardList(cards) {
    cardList.innerHTML = '';

    if (cards.length === 0) {
        cardList.innerHTML = '<div class="no-results">No cards found</div>';
        return;
    }

    cards.forEach(card => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        if (selectedCards.includes(card.name)) {
            cardItem.classList.add('selected');
        }

        cardItem.innerHTML = `
            <div class="card-info">
                <div class="card-name">${card.name}</div>
                <div class="card-meta">${card.bank} • ${card.type}</div>
            </div>
            <div class="card-check">${selectedCards.includes(card.name) ? '✓' : ''}</div>
        `;

        cardItem.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCard(card.name);
        });

        cardList.appendChild(cardItem);
    });
}

function toggleCard(cardName) {
    const index = selectedCards.indexOf(cardName);
    if (index > -1) {
        selectedCards.splice(index, 1);
    } else {
        selectedCards.push(cardName);
    }
    updateSelectedCardsDisplay();
    renderCardList(INDIAN_CARDS.filter(card =>
        card.name.toLowerCase().includes(cardSearch.value.toLowerCase()) ||
        card.bank.toLowerCase().includes(cardSearch.value.toLowerCase())
    ));
}

function updateSelectedCardsDisplay() {
    if (selectedCards.length === 0) {
        selectedCardsDiv.innerHTML = '<span class="placeholder">Click to select your cards...</span>';
    } else {
        selectedCardsDiv.innerHTML = selectedCards.map(card => `
            <span class="selected-card-tag">
                ${card}
                <span class="remove-card" onclick="removeCard('${card}')">×</span>
            </span>
        `).join('');
    }
}

function removeCard(cardName) {
    const index = selectedCards.indexOf(cardName);
    if (index > -1) {
        selectedCards.splice(index, 1);
        updateSelectedCardsDisplay();
        renderCardList(INDIAN_CARDS);
    }
}

// Make removeCard globally accessible
window.removeCard = removeCard;

// Initialize on page load
initCardSelector();

searchBtn.addEventListener('click', sendMessage);

// Allow Enter key to send message
productInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const product = productInput.value.trim();

    if (!product) {
        alert('Please enter a product name or question.');
        return;
    }

    // Remove welcome message on first interaction
    if (isFirstMessage) {
        const welcomeMsg = messagesContainer.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }
        isFirstMessage = false;
    }

    // UI Loading State
    setLoading(true);

    // Add user message to chat
    addMessageToChat('user', product);
    productInput.value = ''; // Clear input
    productInput.focus(); // Keep focus on input

    try {
        const payload = {
            message: product,
            cards: selectedCards.length > 0 ? selectedCards : null,
            session_id: currentSessionId
        };

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Store session ID for next message
        currentSessionId = data.session_id;

        // Add agent response to chat
        addMessageToChat('agent', data.response);

    } catch (error) {
        console.error('Error:', error);
        addMessageToChat('error', 'Oops! Something went wrong. Please try again later.');
    } finally {
        setLoading(false);
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        searchBtn.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
        searchBtn.disabled = false;
    }
}

function addMessageToChat(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}-message`;

    if (role === 'user') {
        messageDiv.innerHTML = `
            <div class="message-header">You</div>
            <div class="message-content">${escapeHtml(content)}</div>
        `;
    } else if (role === 'agent') {
        const htmlContent = marked.parse(content);
        messageDiv.innerHTML = `
            <div class="message-header">AI Assistant</div>
            <div class="message-content markdown-content">${htmlContent}</div>
        `;

        // Make links open in new tab
        setTimeout(() => {
            messageDiv.querySelectorAll('a').forEach(link => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            });
        }, 0);
    } else if (role === 'error') {
        messageDiv.innerHTML = `
            <div class="message-header" style="color: #ef4444;">Error</div>
            <div class="message-content">${escapeHtml(content)}</div>
        `;
    }

    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom smoothly
    messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
