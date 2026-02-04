// Public Holiday Checker Application

// Display current date
function displayCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// Predefined holiday data (fallback for demo purposes)
const holidayData = {
    'US': {
        '01-01': { name: "New Year's Day", type: "National Holiday", description: "The first day of the year in the Gregorian calendar." },
        '07-04': { name: "Independence Day", type: "National Holiday", description: "Celebrates the Declaration of Independence of the United States." },
        '12-25': { name: "Christmas Day", type: "National Holiday", description: "Christian holiday celebrating the birth of Jesus Christ." },
        '11-11': { name: "Veterans Day", type: "National Holiday", description: "Honors military veterans of the U.S. Armed Forces." },
        '02-14': { name: "Valentine's Day", type: "Observance", description: "A day celebrating love and affection." }
    },
    'GB': {
        '01-01': { name: "New Year's Day", type: "National Holiday", description: "The first day of the year." },
        '12-25': { name: "Christmas Day", type: "National Holiday", description: "Christian holiday celebrating the birth of Jesus Christ." },
        '12-26': { name: "Boxing Day", type: "National Holiday", description: "A day after Christmas traditionally for giving gifts to service workers." },
        '02-14': { name: "Valentine's Day", type: "Observance", description: "A day celebrating love and affection." }
    },
    'CA': {
        '01-01': { name: "New Year's Day", type: "National Holiday", description: "The first day of the year." },
        '07-01': { name: "Canada Day", type: "National Holiday", description: "Celebrates the anniversary of Canadian Confederation." },
        '12-25': { name: "Christmas Day", type: "National Holiday", description: "Christian holiday celebrating the birth of Jesus Christ." }
    },
    'AU': {
        '01-01': { name: "New Year's Day", type: "National Holiday", description: "The first day of the year." },
        '01-26': { name: "Australia Day", type: "National Holiday", description: "The national day of Australia." },
        '12-25': { name: "Christmas Day", type: "National Holiday", description: "Christian holiday celebrating the birth of Jesus Christ." },
        '12-26': { name: "Boxing Day", type: "National Holiday", description: "A day after Christmas." }
    },
    'DE': {
        '01-01': { name: "New Year's Day", type: "National Holiday", description: "The first day of the year." },
        '10-03': { name: "German Unity Day", type: "National Holiday", description: "Celebrates German reunification in 1990." },
        '12-25': { name: "Christmas Day", type: "National Holiday", description: "Christian holiday celebrating the birth of Jesus Christ." },
        '12-26': { name: "Second Day of Christmas", type: "National Holiday", description: "Second day of Christmas celebration." }
    },
    'FR': {
        '01-01': { name: "New Year's Day", type: "National Holiday", description: "The first day of the year." },
        '07-14': { name: "Bastille Day", type: "National Holiday", description: "French National Day commemorating the Storming of the Bastille." },
        '12-25': { name: "Christmas Day", type: "National Holiday", description: "Christian holiday celebrating the birth of Jesus Christ." }
    },
    'IT': {
        '01-01': { name: "New Year's Day", type: "National Holiday", description: "The first day of the year." },
        '04-25': { name: "Liberation Day", type: "National Holiday", description: "Celebrates the liberation of Italy at the end of World War II." },
        '12-25': { name: "Christmas Day", type: "National Holiday", description: "Christian holiday celebrating the birth of Jesus Christ." }
    },
    'ES': {
        '01-01': { name: "New Year's Day", type: "National Holiday", description: "The first day of the year." },
        '10-12': { name: "National Day of Spain", type: "National Holiday", description: "Spain's national day commemorating Christopher Columbus's arrival in the Americas." },
        '12-25': { name: "Christmas Day", type: "National Holiday", description: "Christian holiday celebrating the birth of Jesus Christ." }
    },
    'JP': {
        '01-01': { name: "New Year's Day", type: "National Holiday", description: "The first day of the year." },
        '02-11': { name: "National Foundation Day", type: "National Holiday", description: "Celebrates the founding of Japan." },
        '12-25': { name: "Christmas", type: "Observance", description: "Though not an official holiday, Christmas is widely observed in Japan." }
    },
    'CN': {
        '01-01': { name: "New Year's Day", type: "National Holiday", description: "The first day of the year." },
        '10-01': { name: "National Day", type: "National Holiday", description: "Celebrates the founding of the People's Republic of China." }
    },
    'IN': {
        '01-26': { name: "Republic Day", type: "National Holiday", description: "Honors the date when the Constitution of India came into effect." },
        '08-15': { name: "Independence Day", type: "National Holiday", description: "Celebrates India's independence from British rule." },
        '10-02': { name: "Gandhi Jayanti", type: "National Holiday", description: "Birthday of Mahatma Gandhi." }
    },
    'BR': {
        '01-01': { name: "New Year's Day", type: "National Holiday", description: "The first day of the year." },
        '09-07': { name: "Independence Day", type: "National Holiday", description: "Celebrates Brazil's independence from Portugal." },
        '12-25': { name: "Christmas Day", type: "National Holiday", description: "Christian holiday celebrating the birth of Jesus Christ." }
    }
};

// Check for holidays
function checkHolidays() {
    const country = document.getElementById('country').value;
    const resultsDiv = document.getElementById('holidayInfo');
    const loadingDiv = document.getElementById('loading');
    
    // Show loading
    loadingDiv.style.display = 'block';
    resultsDiv.innerHTML = '';
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        loadingDiv.style.display = 'none';
        
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateKey = `${month}-${day}`;
        
        const countryHolidays = holidayData[country] || {};
        const todayHoliday = countryHolidays[dateKey];
        
        if (todayHoliday) {
            resultsDiv.innerHTML = `
                <div class="holiday-card">
                    <h3>🎊 ${todayHoliday.name}</h3>
                    <p><strong>Date:</strong> ${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                    <p><strong>Description:</strong> ${todayHoliday.description}</p>
                    <span class="holiday-type">${todayHoliday.type}</span>
                </div>
            `;
        } else {
            resultsDiv.innerHTML = `
                <div class="no-holiday">
                    <div class="no-holiday-icon">📅</div>
                    <p>No public holidays today in ${getCountryName(country)}</p>
                    <p style="margin-top: 10px; font-size: 0.9em; color: #999;">But every day is a good day! 😊</p>
                </div>
            `;
        }
    }, 800);
}

// Get country name from code
function getCountryName(code) {
    const countryNames = {
        'US': 'the United States',
        'GB': 'the United Kingdom',
        'CA': 'Canada',
        'AU': 'Australia',
        'DE': 'Germany',
        'FR': 'France',
        'IT': 'Italy',
        'ES': 'Spain',
        'JP': 'Japan',
        'CN': 'China',
        'IN': 'India',
        'BR': 'Brazil'
    };
    return countryNames[code] || code;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDate();
    
    // Add event listener to check button
    document.getElementById('checkButton').addEventListener('click', checkHolidays);
    
    // Auto-check on page load
    checkHolidays();
    
    // Add enter key support for country selector
    document.getElementById('country').addEventListener('change', checkHolidays);
});
