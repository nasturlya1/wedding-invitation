document.getElementById('rsvpForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const attendance = document.getElementById('attendance').value;
    const drinkCheckboxes = document.querySelectorAll('input[name="drinks"]:checked');
    const drinks = Array.from(drinkCheckboxes).map(cb => cb.value);
    
    // Проверка и форматирование предпочтений
    let drinkText;
    if (drinks.length === 0) {
        drinkText = "Не указано";
    } else if (drinks.includes("Не пью алкоголь")) {
        drinkText = "Не пью алкоголь";
    } else {
        drinkText = drinks.join(", ");
    }
    
    sendRSVP(name, attendance, drinkText);
    
    // Показать сообщение пользователю
    const responseMessage = document.getElementById('responseMessage');
    responseMessage.textContent = attendance === 'yes' 
        ? `Спасибо, ${name}! Мы рады, что вы придете!` 
        : `Спасибо, ${name}! Очень жаль, что вы не сможете прийти.`;
    
    this.reset();
});

async function sendRSVP(name, attendance, drinks) {
    const botToken = '7696786838:AAGrplz3V2T9zHF3e6jvufkqvwGbl-xnsMM';
    const chatId = '383224025';
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: `Новый ответ:\nИмя: ${name}\nПрисутствие: ${attendance === 'yes' ? 'Придет' : 'Не придет'}\nПредпочтения: ${drinks}`,
                parse_mode: 'Markdown'
            })
        });
        
        const data = await response.json();
        console.log('Telegram ответ:', data);
        
        if (!data.ok) {
            console.error('Ошибка Telegram:', data.description);
        }
    } catch (error) {
        console.error('Ошибка отправки:', error);
    }
}

// Функция для показа карты
function showMap() {
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = `
        <iframe 
            src="https://yandex.ru/map-widget/v1/?um=constructor%3Ae5f5d3c4d8a8f3b4a0b4b3c4d5e6f7a8&amp;source=constructor" 
            width="100%" 
            height="100%" 
            frameborder="0"
            style="border:0;"
            allowfullscreen
            loading="lazy">
        </iframe>
    `;
    
    mapContainer.style.display = 'block';
    window.scrollTo({
        top: mapContainer.offsetTop - 100,
        behavior: 'smooth'
    });
}

// Обратный отсчет до 17 августа 2025
const weddingDate = new Date('2025-08-17T15:30:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerHTML = days.toString().padStart(2, '0');
    document.getElementById('hours').innerHTML = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerHTML = seconds.toString().padStart(2, '0');
}

// Обновляем каждую секунду
setInterval(updateCountdown, 1000);
updateCountdown(); // Первый запуск

// Обработчик выбора мессенджера
function toggleMenu(type) {
    const menu = document.getElementById(`${type}Menu`);
    const allMenus = document.querySelectorAll('.messenger-menu');
    
    // Закрываем все открытые меню
    allMenus.forEach(m => {
        if(m !== menu) m.style.display = 'none';
    });
    
    // Переключаем текущее меню
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Закрытие меню при клике вне области
document.addEventListener('click', (e) => {
    if (!e.target.closest('.contact-actions')) {
        document.querySelectorAll('.messenger-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});