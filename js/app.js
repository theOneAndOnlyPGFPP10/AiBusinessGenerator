// Konfiguracja walidacji
const validationConfig = {
    formStep1: {
        aboutYou: {
            required: true,
            minLength: 10,
            message: 'Pole nie może być puste i musi zawierać minimum 10 znaków'
        },
        initialIdea: {
            required: true,
            minLength: 20,
            message: 'Opisz swój pomysł używając minimum 20 znaków'
        },
        targetAudienceSimple: {
            required: true,
            minLength: 5,
            message: 'Wskaż swoją grupę docelową (minimum 5 znaków)'
        },
        uniqueValueSimple: {
            required: true,
            minLength: 5,
            message: 'Opisz unikalną wartość swojego pomysłu (minimum 5 znaków)'
        }
    },
    formStep2: {
        customerSegments: {
            required: true,
            minLength: 20,
            message: 'Szczegółowo opisz swoje segmenty klientów (minimum 20 znaków)'
        },
        valuePropositions: {
            required: true,
            minLength: 20,
            message: 'Opisz szczegółowo swoją propozycję wartości (minimum 20 znaków)'
        },
        channels: {
            required: true,
            minLength: 10,
            message: 'Wskaż kanały dotarcia do klientów (minimum 10 znaków)'
        }
    }
};

// Stan formularza
let currentStep = 1;
const totalSteps = 3;

// Obsługa błędów
let formErrors = new Map();

// Funkcja do walidacji pojedynczego pola
function validateField(field, rules) {
    const value = field.value.trim();
    
    if (rules.required && value === '') {
        return rules.message;
    }
    
    if (rules.minLength && value.length < rules.minLength) {
        return rules.message;
    }
    
    return null;
}

// Funkcja do wyświetlania błędu dla pola
function showFieldError(field, error) {
    // Usuń poprzedni komunikat błędu, jeśli istnieje
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    if (error) {
        // Dodaj klasę błędu do pola
        field.classList.add('error');
        
        // Stwórz i dodaj komunikat błędu
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = error;
        field.parentElement.appendChild(errorDiv);
        
        // Zapisz błąd w mapie błędów
        formErrors.set(field.id, error);
    } else {
        // Usuń klasę błędu i błąd z mapy
        field.classList.remove('error');
        formErrors.delete(field.id);
    }
}

// Funkcja do przewijania do pierwszego błędu
function scrollToFirstError() {
    const firstErrorField = document.querySelector('.error');
    if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
    }
}

// Funkcja do walidacji całego kroku
function validateStep(stepNumber) {
    const formId = `formStep${stepNumber}`;
    const stepConfig = validationConfig[formId];
    let isValid = true;
    formErrors.clear();

    // Walidacja wszystkich pól w kroku
    for (const [fieldId, rules] of Object.entries(stepConfig)) {
        const field = document.getElementById(fieldId);
        const error = validateField(field, rules);
        showFieldError(field, error);
        
        if (error) {
            isValid = false;
        }
    }

    if (!isValid) {
        scrollToFirstError();
    }

    return isValid;
}

// Funkcja do aktualizacji paska postępu
function updateProgressBar() {
    const steps = document.querySelectorAll('.progress-step-number');
    const lines = document.querySelectorAll('.progress-line');
    
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < currentStep) {
            step.classList.remove('progress-step-pending', 'progress-step-active');
            step.classList.add('progress-step-completed');
        } else if (stepNum === currentStep) {
            step.classList.remove('progress-step-pending', 'progress-step-completed');
            step.classList.add('progress-step-active');
        } else {
            step.classList.remove('progress-step-completed', 'progress-step-active');
            step.classList.add('progress-step-pending');
        }
    });

    lines.forEach((line, index) => {
        if (index + 1 < currentStep) {
            line.classList.remove('progress-line-pending');
            line.classList.add('progress-line-active');
        } else {
            line.classList.remove('progress-line-active');
            line.classList.add('progress-line-pending');
        }
    });
}

// Live walidacja podczas wpisywania
function setupLiveValidation() {
    const allFields = document.querySelectorAll('input, textarea');
    
    allFields.forEach(field => {
        field.addEventListener('input', debounce(() => {
            const stepNumber = parseInt(field.closest('section').id.replace('step', ''));
            const formId = `formStep${stepNumber}`;
            const fieldRules = validationConfig[formId][field.id];
            
            if (fieldRules) {
                const error = validateField(field, fieldRules);
                showFieldError(field, error);
            }
        }, 500));
    });
}

// Funkcja debounce do ograniczenia częstotliwości walidacji
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Funkcja do przechodzenia do następnego kroku
function nextStep(step) {
    if (validateStep(step)) {
        document.getElementById(`step${step}`).classList.remove('active-step');
        document.getElementById(`step${step + 1}`).classList.add('active-step');
        currentStep = step + 1;
        updateProgressBar();
    }
}

// Funkcja do powrotu do poprzedniego kroku
function prevStep(step) {
    document.getElementById(`step${step}`).classList.remove('active-step');
    document.getElementById(`step${step - 1}`).classList.add('active-step');
    currentStep = step - 1;
    updateProgressBar();
}

// Funkcja do wysyłania formularzy
async function submitForms() {
    if (validateStep(2)) {
        // Ukryj drugi krok
        document.getElementById('step2').classList.remove('active-step');
        // Pokaż loader
        document.getElementById('step3').classList.add('active-step');
        currentStep = 3;
        updateProgressBar();
        
        // Aktualizuj tekst ładowania
        const loadingText = document.querySelector('#step3 p.text-gray-600');
        loadingText.textContent = 'Jeszcze tylko trochę... Twój pomysł biznesowy jest już w drodze!';
        
        try {
            // Zbierz dane z obu formularzy
            const formData = {
                step1: {
                    aboutYou: document.getElementById('aboutYou').value,
                    initialIdea: document.getElementById('initialIdea').value,
                    targetAudienceSimple: document.getElementById('targetAudienceSimple').value,
                    uniqueValueSimple: document.getElementById('uniqueValueSimple').value
                },
                step2: {
                    customerSegments: document.getElementById('customerSegments').value,
                    valuePropositions: document.getElementById('valuePropositions').value,
                    channels: document.getElementById('channels').value
                }
            };

            console.log('Wysyłane dane:', formData);

            // Wyślij dane do API
            const response = await fetch(window.env.BG_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Status odpowiedzi:', response.status);
            console.log('Nagłówki odpowiedzi:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Szczegóły błędu:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`Błąd serwera: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Otrzymane dane:', result);

            // Zapisz dane z serwera w localStorage
            localStorage.setItem('lastServerOutput', JSON.stringify(result.output));

            // Ukryj loader
            document.getElementById('step3').classList.remove('active-step');
            // Pokaż wyniki
            document.getElementById('step4').classList.add('active-step');
            
            // Aktualizacja wyników
            document.getElementById('businessSummary').innerHTML = result.output.businessSummary;
            document.getElementById('businessPitch').innerHTML = result.output.businessPitch;
            
            // Aktualizacja oceny
            if (result.output.evaluation) {
                const evaluationScore = document.getElementById('evaluationScore');
                const score = parseInt(result.output.evaluation);
                
                // Ustaw kolor w zależności od oceny
                if (score >= 8) {
                    evaluationScore.className = 'text-green-600';
                } else if (score >= 5) {
                    evaluationScore.className = 'text-yellow-600';
                } else {
                    evaluationScore.className = 'text-red-600';
                }
                
                evaluationScore.textContent = score;
            } else {
                document.getElementById('evaluationScore').textContent = '-';
            }

            // Aktualizacja Business Model Canvas
            if (result.output.bmc) {
                const bmcFields = {
                    customerSegments: 'Segmenty Klientów',
                    valuePropositions: 'Propozycje Wartości',
                    channels: 'Kanały',
                    customerRelationships: 'Relacje z Klientami',
                    revenueStreams: 'Strumienie Przychodów',
                    keyResources: 'Kluczowe Zasoby',
                    keyActivities: 'Kluczowe Działania',
                    keyPartnerships: 'Kluczowi Partnerzy',
                    costStructure: 'Struktura Kosztów'
                };

                // Aktualizuj każdą sekcję BMC
                Object.entries(bmcFields).forEach(([field, label]) => {
                    const element = document.getElementById('bmc-' + field);
                    if (element) {
                        if (result.output.bmc[field] && result.output.bmc[field].trim() !== '') {
                            element.innerHTML = result.output.bmc[field];
                        } else {
                            element.innerHTML = '<p class="text-gray-500 italic">Brak danych</p>';
                        }
                    }
                });
            }

            // Obsługa zdjęcia okładki
            const coverImage = document.getElementById('coverImage');
            const defaultAltText = 'Okładka Business Pitch';
            const defaultBusinessImage = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80';
            
            // Ustaw domyślne zdjęcie na podstawie alt
            const altText = result.output['cover-image'] || defaultAltText;
            const defaultImageUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(altText)}`;
            
            if (result.output.image) {
                console.log('Znaleziono base64 obrazu');
                // Sprawdź czy dane zaczynają się od data:image
                const imageData = result.output.image.startsWith('data:image') 
                    ? result.output.image 
                    : `data:image/jpeg;base64,${result.output.image}`;
                coverImage.src = imageData;
            } else {
                console.log('Używam domyślnego obrazu');
                // Spróbuj załadować obraz na podstawie alt text
                const tempImage = new Image();
                tempImage.onload = () => {
                    coverImage.src = defaultImageUrl;
                };
                tempImage.onerror = () => {
                    console.log('Nie udało się załadować obrazu na podstawie alt text, używam standardowego obrazu biznesowego');
                    coverImage.src = defaultBusinessImage;
                };
                tempImage.src = defaultImageUrl;
            }
            
            // Ustaw opis alternatywny
            coverImage.alt = altText;

            // Przełącz na krok 4
            document.getElementById('step1').classList.remove('active-step');
            document.getElementById('step2').classList.remove('active-step');
            document.getElementById('step3').classList.remove('active-step');
            document.getElementById('step4').classList.remove('hidden');
            document.getElementById('step4').classList.add('active-step');

            // Przewiń do góry strony
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Błąd podczas generowania pomysłu:', error);
            alert('Wystąpił błąd podczas generowania pomysłu. Spróbuj ponownie później.');
        }
    }
}

// Funkcja do restartu generatora
function restartGenerator() {
    // Wyczyść wszystkie pola
    document.querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
        showFieldError(field, null);
    });
    
    // Wróć do pierwszego kroku
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active-step');
    });
    document.getElementById('step1').classList.add('active-step');
    
    // Zresetuj progress bar
    currentStep = 1;
    updateProgressBar();
    
    // Przewiń na górę strony
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Funkcja generująca PDF
async function generateMD() {
    console.log('Kliknięto przycisk MD – wywołano generateMD');
    const data = JSON.parse(localStorage.getItem('lastServerOutput'));
    if (!data) {
        alert('Brak danych do wygenerowania pliku MD!');
        return;
    }

    try {
        const response = await fetch(window.env.DOC_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Pobierz odpowiedź jako blob (dane binarne)
        const blob = await response.blob();
        
        if (blob.size === 0) {
            throw new Error('Otrzymany plik jest pusty');
        }

        console.log('Otrzymano plik MD o rozmiarze:', blob.size, 'bajtów');

        // Pobierz plik
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'business-model.md';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            a.remove();
        }, 100);
    } catch (error) {
        console.error('Błąd podczas generowania pliku MD:', error);
        alert(`Błąd podczas generowania pliku MD: ${error.message}`);
    }
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    setupLiveValidation();
    updateProgressBar();
    window.nextStep = nextStep;
    window.prevStep = prevStep;
    // Jeśli są dane w localStorage, przejdź do Step4 i wyświetl je
    const saved = localStorage.getItem('lastServerOutput');
    if (saved) {
        try {
            const output = JSON.parse(saved);
            document.querySelectorAll('.step').forEach(step => step.classList.remove('active-step'));
            document.getElementById('step4').classList.remove('hidden');
            document.getElementById('step4').classList.add('active-step');
            // Ustaw currentStep na 3 (wynik)
            currentStep = 3;
            updateProgressBar();
            document.getElementById('businessSummary').innerHTML = output.businessSummary || '';
            document.getElementById('businessPitch').innerHTML = output.businessPitch || '';
            if (output.evaluation) {
                const evaluationScore = document.getElementById('evaluationScore');
                const score = parseInt(output.evaluation);
                if (score >= 8) {
                    evaluationScore.className = 'text-green-600';
                } else if (score >= 5) {
                    evaluationScore.className = 'text-yellow-600';
                } else {
                    evaluationScore.className = 'text-red-600';
                }
                evaluationScore.textContent = score;
            } else {
                document.getElementById('evaluationScore').textContent = '-';
            }
            if (output.bmc) {
                const bmcFields = {
                    customerSegments: 'Segmenty Klientów',
                    valuePropositions: 'Propozycje Wartości',
                    channels: 'Kanały',
                    customerRelationships: 'Relacje z Klientami',
                    revenueStreams: 'Strumienie Przychodów',
                    keyResources: 'Kluczowe Zasoby',
                    keyActivities: 'Kluczowe Działania',
                    keyPartnerships: 'Kluczowi Partnerzy',
                    costStructure: 'Struktura Kosztów'
                };
                Object.entries(bmcFields).forEach(([field, label]) => {
                    const element = document.getElementById('bmc-' + field);
                    if (element) {
                        if (output.bmc[field] && output.bmc[field].trim() !== '') {
                            element.innerHTML = output.bmc[field];
                        } else {
                            element.innerHTML = '<p class="text-gray-500 italic">Brak danych</p>';
                        }
                    }
                });
            }
            // Obsługa zdjęcia okładki
            const coverImage = document.getElementById('coverImage');
            const defaultAltText = 'Okładka Business Pitch';
            const defaultBusinessImage = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80';
            const altText = output['cover-image'] || defaultAltText;
            const defaultImageUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(altText)}`;
            coverImage.alt = altText;
            if (output.image) {
                const imageData = output.image.startsWith('data:image') 
                    ? output.image 
                    : `data:image/jpeg;base64,${output.image}`;
                coverImage.src = imageData;
            } else {
                const tempImage = new Image();
                tempImage.onload = () => { coverImage.src = defaultImageUrl; };
                tempImage.onerror = () => { coverImage.src = defaultBusinessImage; };
                tempImage.src = defaultImageUrl;
            }
        } catch (e) { /* ignoruj */ }
    }
    // Udostępnij restartGenerator globalnie
    window.restartGenerator = function() {
        localStorage.removeItem('lastServerOutput');
        document.querySelectorAll('input, textarea').forEach(field => {
            field.value = '';
            if (field.classList) field.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(e => e.remove());
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active-step'));
        document.getElementById('step1').classList.add('active-step');
        currentStep = 1;
        updateProgressBar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}); 