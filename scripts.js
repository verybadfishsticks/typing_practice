        const paragraphs = [
            "the quick brown fox jumps over the lazy dog. this pangram contains every letter of the english alphabet at least once.",
            "remember to never look at the keyboard while typing. at some point, you'll forget that you are typing in the first place.",
            "if you want to type fast, you must first focus on your accuracy. bad accuracy will always overpower fast typing.",
            "practice makes perfect. the more you practice at typing, the faster and more accurate you'll get.",
            "in a world of technology, human connection remains vital. face-to-face interactions create lasting memories and bonds.",
            "the art of typing quickly and accurately is an essential skill in today's digital age. practice makes perfect.",
            "success is not final, failure is not fatal: it is the courage to continue that counts. keep moving forward.",
            "life is like riding a bicycle. to keep your balance, you must keep moving forward with determination.",
            "the only way to do great work is to love what you do. find your passion and pursue it relentlessly.",
            "education is not the learning of facts, but the training of the mind to think. critical thinking is essential.",
            "time management is the key to productivity. focus on what matters most and eliminate distractions.",
            "leadership is not about being in charge. it's about taking care of those in your charge. be a servant and humble leader.",
        ];

        let startTime, timer;
        let currentParagraph = '';
        let isCustomMode = false;
        let correctCharacters = 0;

        const textDisplay = document.getElementById('textDisplay');
        const input = document.getElementById('input');
        const wpmDisplay = document.getElementById('wpm');
        const accuracyDisplay = document.getElementById('accuracy');
        const newParagraphBtn = document.getElementById('newParagraph');
        const customParagraphBtn = document.getElementById('customParagraph');
        const saveButton = document.getElementById('saveButton');
        const customTextArea = document.getElementById('customTextArea');
        const customInput = document.getElementById('customInput');

        function getRandomParagraph() {
            const newParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
            return newParagraph !== currentParagraph ? newParagraph : getRandomParagraph();
        }

        function initializeTest(newParagraph = null) {
            clearInterval(timer);
            input.value = '';
            startTime = null;
            correctCharacters = 0;
            wpmDisplay.textContent = '0';
            accuracyDisplay.textContent = '100';
            
            currentParagraph = newParagraph || getRandomParagraph();
            displayText();
        }

        function displayText() {
            textDisplay.innerHTML = currentParagraph.split('').map(char => 
                `<span>${char}</span>`
            ).join('');
        }

        function calculateWPM() {
            if (!startTime || correctCharacters === 0) return;
            const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes 
            const words = correctCharacters / 5; // standard word length...retarded i know...
            const wpm = Math.round(words / timeElapsed);
            wpmDisplay.textContent = wpm;
        }

        function calculateAccuracy() {
            const inputChars = input.value.split('');
            const targetChars = currentParagraph.split('');
            let correct = 0;
            correctCharacters = 0;

            inputChars.forEach((char, i) => {
                if (char === targetChars[i]) {
                    correct++;
                    correctCharacters++;
                }
                
                const span = textDisplay.children[i];
                if (span) {
                    if (char === targetChars[i]) {
                        span.className = 'correct';
                    } else {
                        span.className = 'wrong';
                    }
                }
            });

            const accuracy = Math.max(0, Math.min(100, Math.round((correct / inputChars.length) * 100)));
            accuracyDisplay.textContent = accuracy;

            // check if paragraph is complete and move to next. i should probably fix this shit.
            if (input.value.length === currentParagraph.length) {
                setTimeout(() => {
                    initializeTest();
                }, 500);
            }
        }

        input.addEventListener('input', () => {
            if (!startTime && input.value.length > 0) {
                startTime = Date.now();
                timer = setInterval(calculateWPM, 1000);
            }
            calculateAccuracy();
        });

        newParagraphBtn.addEventListener('click', () => {
            isCustomMode = false;
            customTextArea.style.display = 'none';
            saveButton.style.display = 'none';
            initializeTest();
        });

        customParagraphBtn.addEventListener('click', () => {
            isCustomMode = true;
            customTextArea.style.display = 'block';
            saveButton.style.display = 'inline-block';
            customInput.value = '';
            customInput.focus();
        });

        saveButton.addEventListener('click', () => {
            const customText = customInput.value.trim();
            if (customText) {
                paragraphs.push(customText);
                customTextArea.style.display = 'none';
                saveButton.style.display = 'none';
                initializeTest(customText);
            }
        });

        // Initialize the first test
        initializeTest();