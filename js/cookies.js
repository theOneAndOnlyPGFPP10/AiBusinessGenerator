class CookieConsent {
    constructor() {
        this.cookieName = 'cookie_consent';
        this.cookieValue = 'accepted';
        this.cookieDuration = 365; // dni
        this.bannerHTML = `
            <div id="cookie-banner" class="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
                <div class="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between">
                    <div class="text-center sm:text-left mb-4 sm:mb-0">
                        <p>Używamy plików cookie oraz localStorage, aby poprawić Twoje doświadczenia na naszej stronie. 
                           Dane biznesowe (np. wygenerowany plan) mogą być tymczasowo przechowywane w Twojej przeglądarce. 
                           Korzystając z tej witryny, zgadzasz się na naszą 
                           <a href="/pages/privacy-policy.html" class="underline hover:text-blue-300">politykę prywatności</a>.</p>
                    </div>
                    <div class="flex space-x-4">
                        <button id="accept-cookies" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
                            Akceptuję
                        </button>
                        <button id="reject-cookies" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded">
                            Odrzuć
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        if (!this.getCookie(this.cookieName)) {
            this.showBanner();
        }
    }

    showBanner() {
        document.body.insertAdjacentHTML('beforeend', this.bannerHTML);
        
        document.getElementById('accept-cookies').addEventListener('click', () => {
            this.setCookie(this.cookieName, this.cookieValue, this.cookieDuration);
            this.hideBanner();
        });

        document.getElementById('reject-cookies').addEventListener('click', () => {
            this.hideBanner();
        });
    }

    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.remove();
        }
    }

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }
}

// Inicjalizacja modułu cookie consent
document.addEventListener('DOMContentLoaded', () => {
    const cookieConsent = new CookieConsent();
    cookieConsent.init();
}); 