let selectedWords = [];
let translatedWords = [];

async function startTest() {
    const arabicWords = document.getElementById("arabicWords").value.split(",");
    const wordCount = parseInt(document.getElementById("wordCount").value);

    if (arabicWords.length < wordCount) {
        alert("عدد الكلمات المدخل أقل من العدد المطلوب.");
        return;
    }

    // اختيار كلمات عشوائية
    selectedWords = getRandomWords(arabicWords, wordCount);

    // ترجمة الكلمات
    translatedWords = await translateWords(selectedWords);

    // عرض الكلمات للطالب
    const wordsList = document.getElementById("wordsList");
    wordsList.innerHTML = "";
    selectedWords.forEach((word, index) => {
        wordsList.innerHTML += `
            <div>
                <span>${word.trim()}</span>
                <input type="text" id="studentAnswer${index}" placeholder="اكتب الترجمة هنا" />
            </div>
        `;
    });

    document.getElementById("testSection").style.display = "block";
}

// دالة لاختيار كلمات عشوائية
function getRandomWords(words, count) {
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// دالة لترجمة الكلمات باستخدام MyMemory API مع مفتاح API وبريد إلكتروني
async function translateWords(words) {
    const translations = [];
    const apiKey = '9347e7b68d3304b84327'; // مفتاح API الخاص بك
    const email = 'ibrahimahmed3470@gmail.com'; // بريدك الإلكتروني

    for (let word of words) {
        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${word.trim()}&langpair=ar|en&de=${email}&key=${apiKey}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                translations.push(data.responseData.translatedText);
            } else {
                console.error(`Error: Unable to translate "${word}".`);
                translations.push("Error: Translation failed");
            }
        } catch (error) {
            console.error(`Exception: ${error.message}`);
            translations.push("Error: Translation failed");
        }
    }
    return translations;
}

// دالة للتحقق من إجابات الطالب
function checkAnswers() {
    let resultMessage = "";
    selectedWords.forEach((word, index) => {
        const studentAnswer = document.getElementById(`studentAnswer${index}`).value.trim().toLowerCase();
        const correctAnswer = translatedWords[index].toLowerCase();

        if (studentAnswer === correctAnswer) {
            resultMessage += `<p>الإجابة على "${word}" صحيحة!</p>`;
        } else {
            resultMessage += `<p>الإجابة على "${word}" خاطئة! الإجابة الصحيحة هي: ${translatedWords[index]}</p>`;
        }
    });

    document.getElementById("resultMessage").innerHTML = resultMessage;
}
