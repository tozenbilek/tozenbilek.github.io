document.addEventListener('DOMContentLoaded', function () {
    // Tüm quiz soru konteynerlerini seç
    const questions = document.querySelectorAll('.quiz-question');

    questions.forEach(question => {
        const options = question.querySelectorAll('.quiz-option');
        const explanation = question.querySelector('.quiz-explanation');
        let answered = false; // Her soru için cevaplama durumunu takip et

        options.forEach(option => {
            option.addEventListener('click', () => {
                // Eğer bu soru daha önce cevaplandıysa, hiçbir şey yapma
                if (answered) {
                    return;
                }
                
                // Cevaplandığı için durumu kilitle
                answered = true;

                // Tıklanan şık doğru mu diye kontrol et
                const isCorrect = option.getAttribute('data-correct') === 'true';

                if (isCorrect) {
                    option.classList.add('correct');
                } else {
                    option.classList.add('incorrect');
                    // Yanlışsa, doğru olanı da göster
                    options.forEach(opt => {
                        if (opt.getAttribute('data-correct') === 'true') {
                            opt.classList.add('correct');
                        }
                    });
                }

                // Açıklamayı göster
                if (explanation) {
                    explanation.style.display = 'block';
                }
            });
        });
    });
});
